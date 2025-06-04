<?php
/**
 * API class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * API class.
 */
class IGPR_API {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'rest_api_init', array( $this, 'register_rest_routes' ) );
    }

    /**
     * Register REST API routes.
     */
    public function register_rest_routes() {
        register_rest_route(
            'igpr/v1',
            '/settings',
            array(
                'methods'             => 'GET',
                'callback'            => array( $this, 'get_settings' ),
                'permission_callback' => array( $this, 'check_admin_permission' ),
            )
        );

        register_rest_route(
            'igpr/v1',
            '/settings',
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'update_settings' ),
                'permission_callback' => array( $this, 'check_admin_permission' ),
            )
        );

        register_rest_route(
            'igpr/v1',
            '/pending-posts',
            array(
                'methods'             => 'GET',
                'callback'            => array( $this, 'get_pending_posts' ),
                'permission_callback' => array( $this, 'check_admin_permission' ),
            )
        );

        register_rest_route(
            'igpr/v1',
            '/post/(?P<id>\d+)/approve',
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'approve_post' ),
                'permission_callback' => array( $this, 'check_admin_permission' ),
            )
        );

        register_rest_route(
            'igpr/v1',
            '/post/(?P<id>\d+)/reject',
            array(
                'methods'             => 'POST',
                'callback'            => array( $this, 'reject_post' ),
                'permission_callback' => array( $this, 'check_admin_permission' ),
            )
        );
    }

    /**
     * Check if user has admin permission.
     *
     * @return bool Whether user has permission.
     */
    public function check_admin_permission() {
        return current_user_can( 'manage_options' );
    }

    /**
     * Get plugin settings.
     *
     * @return WP_REST_Response Response object.
     */
    public function get_settings() {
        $settings = get_option( 'igpr_settings', array() );
        
        // Get categories for dropdown
        $categories = get_categories( array(
            'hide_empty' => false,
        ) );
        
        $category_options = array();
        foreach ( $categories as $category ) {
            $category_options[] = array(
                'value' => $category->term_id,
                'label' => $category->name,
            );
        }
        
        $response = array(
            'settings' => $settings,
            'categories' => $category_options,
        );
        
        return rest_ensure_response( $response );
    }

    /**
     * Update plugin settings.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response Response object.
     */
    public function update_settings( $request ) {
        $settings = $request->get_json_params();
        
        if ( ! is_array( $settings ) ) {
            return new WP_Error( 'invalid_settings', __( 'Invalid settings data.', 'instant-guest-post-request' ), array( 'status' => 400 ) );
        }
        
        // Sanitize settings
        $sanitized_settings = array();
        
        if ( isset( $settings['default_category'] ) ) {
            $sanitized_settings['default_category'] = absint( $settings['default_category'] );
        }
        
        if ( isset( $settings['moderation_enabled'] ) ) {
            $sanitized_settings['moderation_enabled'] = (bool) $settings['moderation_enabled'];
        }
        
        if ( isset( $settings['email_notification'] ) ) {
            $sanitized_settings['email_notification'] = (bool) $settings['email_notification'];
        }
        
        if ( isset( $settings['email_template'] ) ) {
            $sanitized_settings['email_template'] = sanitize_textarea_field( $settings['email_template'] );
        }
        
        if ( isset( $settings['form_style'] ) ) {
            $sanitized_settings['form_style'] = sanitize_text_field( $settings['form_style'] );
        }
        
        if ( isset( $settings['submission_limit'] ) ) {
            $sanitized_settings['submission_limit'] = absint( $settings['submission_limit'] );
        }
        
        if ( isset( $settings['spam_protection'] ) ) {
            $sanitized_settings['spam_protection'] = (bool) $settings['spam_protection'];
        }
        
        // Update settings
        update_option( 'igpr_settings', $sanitized_settings );
        
        return rest_ensure_response( array(
            'success' => true,
            'settings' => $sanitized_settings,
        ) );
    }

    /**
     * Get pending posts.
     *
     * @return WP_REST_Response Response object.
     */
    public function get_pending_posts() {
        $args = array(
            'post_type'      => 'post',
            'post_status'    => 'pending',
            'posts_per_page' => 10,
            'meta_query'     => array(
                array(
                    'key'     => '_igpr_author_email',
                    'compare' => 'EXISTS',
                ),
            ),
        );
        
        $query = new WP_Query( $args );
        $posts = array();
        
        if ( $query->have_posts() ) {
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();
                
                $posts[] = array(
                    'id'          => $post_id,
                    'title'       => get_the_title(),
                    'date'        => get_the_date(),
                    'author_name' => get_post_meta( $post_id, '_igpr_author_name', true ),
                    'author_email' => get_post_meta( $post_id, '_igpr_author_email', true ),
                    'edit_url'    => get_edit_post_link( $post_id, 'raw' ),
                    'preview_url' => get_preview_post_link( $post_id ),
                );
            }
            
            wp_reset_postdata();
        }
        
        return rest_ensure_response( array(
            'posts' => $posts,
            'total' => $query->found_posts,
        ) );
    }

    /**
     * Approve a post.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response Response object.
     */
    public function approve_post( $request ) {
        $post_id = $request['id'];
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new WP_Error( 'post_not_found', __( 'Post not found.', 'instant-guest-post-request' ), array( 'status' => 404 ) );
        }
        
        // Check if it's a guest post
        if ( ! get_post_meta( $post_id, '_igpr_author_email', true ) ) {
            return new WP_Error( 'not_guest_post', __( 'This is not a guest post.', 'instant-guest-post-request' ), array( 'status' => 400 ) );
        }
        
        // Update post status to publish
        $result = wp_update_post( array(
            'ID'          => $post_id,
            'post_status' => 'publish',
        ) );
        
        if ( is_wp_error( $result ) ) {
            return new WP_Error( 'update_failed', $result->get_error_message(), array( 'status' => 500 ) );
        }
        
        return rest_ensure_response( array(
            'success' => true,
            'message' => __( 'Post approved and published.', 'instant-guest-post-request' ),
        ) );
    }

    /**
     * Reject a post.
     *
     * @param WP_REST_Request $request Request object.
     * @return WP_REST_Response Response object.
     */
    public function reject_post( $request ) {
        $post_id = $request['id'];
        $post = get_post( $post_id );
        
        if ( ! $post ) {
            return new WP_Error( 'post_not_found', __( 'Post not found.', 'instant-guest-post-request' ), array( 'status' => 404 ) );
        }
        
        // Check if it's a guest post
        if ( ! get_post_meta( $post_id, '_igpr_author_email', true ) ) {
            return new WP_Error( 'not_guest_post', __( 'This is not a guest post.', 'instant-guest-post-request' ), array( 'status' => 400 ) );
        }
        
        // Move post to trash
        $result = wp_trash_post( $post_id );
        
        if ( ! $result ) {
            return new WP_Error( 'trash_failed', __( 'Failed to reject post.', 'instant-guest-post-request' ), array( 'status' => 500 ) );
        }
        
        return rest_ensure_response( array(
            'success' => true,
            'message' => __( 'Post rejected and moved to trash.', 'instant-guest-post-request' ),
        ) );
    }
}