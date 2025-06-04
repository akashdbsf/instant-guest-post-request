<?php
/**
 * Approval Handler class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Approval Handler class.
 */
class IGPR_Approval_Handler {

    /**
     * Constructor.
     */
    public function __construct() {
        // Add action to handle approval/rejection from email links
        add_action( 'init', array( $this, 'process_email_actions' ) );
    }

    /**
     * Process approval/rejection actions from email links.
     */
    public function process_email_actions() {
        // Check if we have the necessary parameters
        if ( ! isset( $_GET['igpr_email_action'] ) || ! isset( $_GET['post_id'] ) || ! isset( $_GET['token'] ) ) {
            return;
        }

        // Get parameters
        $action = sanitize_text_field( wp_unslash( $_GET['igpr_email_action'] ) );
        $post_id = intval( $_GET['post_id'] );
        $token = sanitize_text_field( wp_unslash( $_GET['token'] ) );

        // Verify token
        if ( ! $this->verify_action_token( $post_id, $token ) ) {
            wp_die( esc_html__( 'Invalid or expired token.', 'instant-guest-post-request' ) );
            return;
        }

        // Get post
        $post = get_post( $post_id );
        if ( ! $post || ! get_post_meta( $post_id, '_igpr_author_email', true ) ) {
            wp_die( esc_html__( 'Invalid post.', 'instant-guest-post-request' ) );
            return;
        }

        // Process action
        if ( 'approve' === $action ) {
            // Update post status to publish
            wp_update_post( array(
                'ID' => $post_id,
                'post_status' => 'publish',
            ) );
            
            // Send notification email to author
            $email_handler = new IGPR_Email_Handler();
            $email_handler->send_status_notification( $post_id, 'approved' );

            // Redirect to published post
            wp_safe_redirect( get_permalink( $post_id ) );
            exit;
        } elseif ( 'reject' === $action ) {
            // Move post to trash
            wp_trash_post( $post_id );
            
            // Send notification email to author
            $email_handler = new IGPR_Email_Handler();
            $email_handler->send_status_notification( $post_id, 'rejected' );

            // Redirect to admin
            wp_safe_redirect( admin_url( 'edit.php?post_status=trash&post_type=post' ) );
            exit;
        }
    }

    /**
     * Generate a secure token for post actions.
     *
     * @param int $post_id Post ID.
     * @return string Secure token.
     */
    public function generate_action_token( $post_id ) {
        $secret = wp_salt( 'auth' );
        return hash_hmac( 'sha256', $post_id . get_post( $post_id )->post_date, $secret );
    }

    /**
     * Verify action token.
     *
     * @param int    $post_id Post ID.
     * @param string $token   Token to verify.
     * @return bool Whether the token is valid.
     */
    private function verify_action_token( $post_id, $token ) {
        $expected_token = $this->generate_action_token( $post_id );
        return hash_equals( $expected_token, $token );
    }

    /**
     * Generate approval/rejection links for emails.
     *
     * @param int $post_id Post ID.
     * @return array Links array.
     */
    public function generate_email_action_links( $post_id ) {
        $token = $this->generate_action_token( $post_id );
        
        $approve_link = add_query_arg(
            array(
                'igpr_email_action' => 'approve',
                'post_id' => $post_id,
                'token' => $token,
            ),
            site_url()
        );
        
        $reject_link = add_query_arg(
            array(
                'igpr_email_action' => 'reject',
                'post_id' => $post_id,
                'token' => $token,
            ),
            site_url()
        );
        
        return array(
            'approve' => $approve_link,
            'reject' => $reject_link,
        );
    }
}