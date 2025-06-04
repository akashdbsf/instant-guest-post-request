<?php
/**
 * Form Handler class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Form Handler class.
 */
class IGPR_Form_Handler {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'wp_ajax_igpr_submit_guest_post', array( $this, 'handle_form_submission' ) );
        add_action( 'wp_ajax_nopriv_igpr_submit_guest_post', array( $this, 'handle_form_submission' ) );
    }

    /**
     * Handle form submission.
     */
    public function handle_form_submission() {
        // Check nonce
        if ( ! isset( $_POST['nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['nonce'] ) ), 'igpr_nonce' ) ) {
            wp_send_json_error( array( 'message' => __( 'Security check failed.', 'instant-guest-post-request' ) ) );
        }

        // Get plugin settings
        $settings = get_option( 'igpr_settings', array() );

        // Check if spam protection is enabled and validate
        if ( isset( $settings['spam_protection'] ) && $settings['spam_protection'] ) {
            // Check honeypot field
            if ( ! empty( $_POST['website_hp'] ) ) {
                wp_send_json_error( array( 'message' => __( 'Spam submission detected.', 'instant-guest-post-request' ) ) );
            }
            
            // Check submission limit by IP
            if ( $this->is_submission_limit_exceeded() ) {
                wp_send_json_error( array( 'message' => __( 'Submission limit exceeded. Please try again later.', 'instant-guest-post-request' ) ) );
            }
        }

        // Validate required fields
        $required_fields = array(
            'post_title' => __( 'Post title is required.', 'instant-guest-post-request' ),
            'post_content' => __( 'Post content is required.', 'instant-guest-post-request' ),
            'author_name' => __( 'Author name is required.', 'instant-guest-post-request' ),
            'author_email' => __( 'Author email is required.', 'instant-guest-post-request' ),
        );

        foreach ( $required_fields as $field => $message ) {
            if ( empty( $_POST[ $field ] ) ) {
                wp_send_json_error( array( 'message' => $message ) );
            }
        }

        // Validate email
        if ( ! is_email( sanitize_email( wp_unslash( $_POST['author_email'] ) ) ) ) {
            wp_send_json_error( array( 'message' => __( 'Please enter a valid email address.', 'instant-guest-post-request' ) ) );
        }

        // Prepare post data
        $post_data = array(
            'post_title' => sanitize_text_field( wp_unslash( $_POST['post_title'] ) ),
            'post_content' => wp_kses_post( wp_unslash( $_POST['post_content'] ) ),
            'post_status' => 'pending',
            'post_type' => 'post',
        );

        // Set category if specified in settings
        if ( ! empty( $settings['default_category'] ) ) {
            $post_data['post_category'] = array( intval( $settings['default_category'] ) );
        }

        // Create the post
        $post_id = wp_insert_post( $post_data );

        if ( is_wp_error( $post_id ) ) {
            wp_send_json_error( array( 'message' => $post_id->get_error_message() ) );
        }

        // Save author meta
        update_post_meta( $post_id, '_igpr_author_name', sanitize_text_field( wp_unslash( $_POST['author_name'] ) ) );
        update_post_meta( $post_id, '_igpr_author_email', sanitize_email( wp_unslash( $_POST['author_email'] ) ) );
        
        if ( ! empty( $_POST['author_bio'] ) ) {
            update_post_meta( $post_id, '_igpr_author_bio', sanitize_textarea_field( wp_unslash( $_POST['author_bio'] ) ) );
        }

        // Handle featured image upload
        if ( ! empty( $_FILES['featured_image']['name'] ) ) {
            $this->handle_image_upload( $post_id );
        }

        // Record IP address for rate limiting
        $this->record_submission();

        // Send email notification
        if ( isset( $settings['email_notification'] ) && $settings['email_notification'] ) {
            $email_handler = new IGPR_Email_Handler();
            $email_handler->send_new_post_notification( $post_id );
        }

        // Return success
        wp_send_json_success( array( 
            'message' => __( 'Your guest post has been submitted successfully!', 'instant-guest-post-request' ),
            'post_id' => $post_id
        ) );
    }

    /**
     * Handle image upload.
     *
     * @param int $post_id Post ID.
     */
    private function handle_image_upload( $post_id ) {
        if ( ! function_exists( 'wp_handle_upload' ) ) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
        }
        
        if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }
        
        // Check file type
        $file = $_FILES['featured_image'];
        $allowed_types = array( 'image/jpeg', 'image/png', 'image/gif' );
        
        if ( ! in_array( $file['type'], $allowed_types, true ) ) {
            return;
        }
        
        // Upload file
        $upload_overrides = array( 'test_form' => false );
        $uploaded_file = wp_handle_upload( $file, $upload_overrides );
        
        if ( isset( $uploaded_file['error'] ) || ! isset( $uploaded_file['file'] ) ) {
            return;
        }
        
        // Create attachment
        $attachment = array(
            'post_mime_type' => $uploaded_file['type'],
            'post_title' => sanitize_file_name( basename( $uploaded_file['file'] ) ),
            'post_content' => '',
            'post_status' => 'inherit',
        );
        
        $attachment_id = wp_insert_attachment( $attachment, $uploaded_file['file'], $post_id );
        
        if ( ! is_wp_error( $attachment_id ) ) {
            // Generate metadata
            $attachment_data = wp_generate_attachment_metadata( $attachment_id, $uploaded_file['file'] );
            wp_update_attachment_metadata( $attachment_id, $attachment_data );
            
            // Set as featured image
            set_post_thumbnail( $post_id, $attachment_id );
        }
    }

    /**
     * Check if submission limit is exceeded.
     *
     * @return bool True if limit exceeded, false otherwise.
     */
    private function is_submission_limit_exceeded() {
        $settings = get_option( 'igpr_settings', array() );
        $limit = isset( $settings['submission_limit'] ) ? intval( $settings['submission_limit'] ) : 3;
        
        if ( $limit <= 0 ) {
            return false;
        }
        
        $ip_address = $this->get_client_ip();
        $submissions = get_transient( 'igpr_submissions_' . md5( $ip_address ) );
        
        if ( false === $submissions ) {
            return false;
        }
        
        return $submissions >= $limit;
    }

    /**
     * Record submission for rate limiting.
     */
    private function record_submission() {
        $settings = get_option( 'igpr_settings', array() );
        $limit = isset( $settings['submission_limit'] ) ? intval( $settings['submission_limit'] ) : 3;
        
        if ( $limit <= 0 ) {
            return;
        }
        
        $ip_address = $this->get_client_ip();
        $submissions = get_transient( 'igpr_submissions_' . md5( $ip_address ) );
        
        if ( false === $submissions ) {
            $submissions = 1;
        } else {
            $submissions++;
        }
        
        // Store for 24 hours
        set_transient( 'igpr_submissions_' . md5( $ip_address ), $submissions, DAY_IN_SECONDS );
    }

    /**
     * Get client IP address.
     *
     * @return string IP address.
     */
    private function get_client_ip() {
        $ip_address = '';
        
        // Check for shared internet/ISP IP
        if ( ! empty( $_SERVER['HTTP_CLIENT_IP'] ) && filter_var( $_SERVER['HTTP_CLIENT_IP'], FILTER_VALIDATE_IP ) ) {
            $ip_address = sanitize_text_field( wp_unslash( $_SERVER['HTTP_CLIENT_IP'] ) );
        } elseif ( ! empty( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) {
            // Check for IPs passing through proxies
            $forwarded_for = explode( ',', sanitize_text_field( wp_unslash( $_SERVER['HTTP_X_FORWARDED_FOR'] ) ) );
            $ip_address = trim( $forwarded_for[0] );
        } elseif ( ! empty( $_SERVER['REMOTE_ADDR'] ) ) {
            $ip_address = sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) );
        }
        
        return $ip_address;
    }
}