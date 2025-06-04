<?php
/**
 * Post Handler class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Post Handler class.
 */
class IGPR_Post_Handler {

    /**
     * Constructor.
     */
    public function __construct() {
        // Handle post approval and rejection
        add_action( 'admin_init', array( $this, 'handle_post_actions' ) );
        
        // Add custom columns to posts list
        add_filter( 'manage_posts_columns', array( $this, 'add_guest_post_column' ) );
        add_action( 'manage_posts_custom_column', array( $this, 'display_guest_post_column' ), 10, 2 );
        
        // Add meta box for guest post details
        add_action( 'add_meta_boxes', array( $this, 'add_guest_post_meta_box' ) );
    }

    /**
     * Handle post approval and rejection actions.
     */
    public function handle_post_actions() {
        // Check if we have a valid action
        if ( ! isset( $_GET['igpr_action'] ) || ! isset( $_GET['post_id'] ) ) {
            return;
        }

        // Check for nonce
        if ( isset( $_GET['nonce'] ) ) {
            // Verify nonce
            $nonce = sanitize_text_field( wp_unslash( $_GET['nonce'] ) );
            if ( ! wp_verify_nonce( $nonce, 'igpr_post_action' ) ) {
                wp_die( esc_html__( 'Security check failed.', 'instant-guest-post-request' ) );
            }
        } else {
            // For email links without nonce, verify user is logged in as admin
            if ( ! current_user_can( 'edit_posts' ) ) {
                wp_die( esc_html__( 'You do not have permission to perform this action.', 'instant-guest-post-request' ) );
            }
        }

        // Get post ID and action
        $post_id = intval( $_GET['post_id'] );
        $action = sanitize_text_field( wp_unslash( $_GET['igpr_action'] ) );

        // Check if post exists and is a guest post
        $post = get_post( $post_id );
        if ( ! $post || ! get_post_meta( $post_id, '_igpr_author_email', true ) ) {
            wp_die( esc_html__( 'Invalid post.', 'instant-guest-post-request' ) );
        }

        // Process action
        if ( 'approve' === $action ) {
            // Update post status to publish
            wp_update_post( array(
                'ID' => $post_id,
                'post_status' => 'publish',
            ) );

            // Redirect to post list
            wp_safe_redirect( admin_url( 'edit.php?igpr_message=approved' ) );
            exit;
        } elseif ( 'reject' === $action ) {
            // Move post to trash
            wp_trash_post( $post_id );

            // Redirect to post list
            wp_safe_redirect( admin_url( 'edit.php?igpr_message=rejected' ) );
            exit;
        }
    }

    /**
     * Add guest post column to posts list.
     *
     * @param array $columns Post list columns.
     * @return array Modified columns.
     */
    public function add_guest_post_column( $columns ) {
        $new_columns = array();
        
        foreach ( $columns as $key => $value ) {
            $new_columns[ $key ] = $value;
            
            // Add guest post column after title
            if ( 'title' === $key ) {
                $new_columns['guest_post'] = __( 'Guest Post', 'instant-guest-post-request' );
            }
        }
        
        return $new_columns;
    }

    /**
     * Display guest post column content.
     *
     * @param string $column  Column name.
     * @param int    $post_id Post ID.
     */
    public function display_guest_post_column( $column, $post_id ) {
        if ( 'guest_post' === $column ) {
            $author_name = get_post_meta( $post_id, '_igpr_author_name', true );
            
            if ( $author_name ) {
                $author_email = get_post_meta( $post_id, '_igpr_author_email', true );
                echo '<span class="dashicons dashicons-admin-users"></span> ';
                echo esc_html( $author_name );
                echo '<br><small>' . esc_html( $author_email ) . '</small>';
            }
        }
    }

    /**
     * Add meta box for guest post details.
     */
    public function add_guest_post_meta_box() {
        add_meta_box(
            'igpr_guest_post_details',
            __( 'Guest Author Details', 'instant-guest-post-request' ),
            array( $this, 'render_guest_post_meta_box' ),
            'post',
            'side',
            'high'
        );
    }

    /**
     * Render guest post meta box.
     *
     * @param WP_Post $post Post object.
     */
    public function render_guest_post_meta_box( $post ) {
        $author_name = get_post_meta( $post->ID, '_igpr_author_name', true );
        
        if ( ! $author_name ) {
            echo '<p>' . esc_html__( 'This is not a guest post.', 'instant-guest-post-request' ) . '</p>';
            return;
        }
        
        $author_email = get_post_meta( $post->ID, '_igpr_author_email', true );
        $author_bio = get_post_meta( $post->ID, '_igpr_author_bio', true );
        ?>
        <p>
            <strong><?php esc_html_e( 'Author Name:', 'instant-guest-post-request' ); ?></strong><br>
            <?php echo esc_html( $author_name ); ?>
        </p>
        <p>
            <strong><?php esc_html_e( 'Author Email:', 'instant-guest-post-request' ); ?></strong><br>
            <a href="mailto:<?php echo esc_attr( $author_email ); ?>"><?php echo esc_html( $author_email ); ?></a>
        </p>
        <?php if ( $author_bio ) : ?>
        <p>
            <strong><?php esc_html_e( 'Author Bio:', 'instant-guest-post-request' ); ?></strong><br>
            <?php echo wp_kses_post( wpautop( $author_bio ) ); ?>
        </p>
        <?php endif; ?>
        <?php
    }

    /**
     * Generate approval/rejection links.
     *
     * @param int $post_id Post ID.
     * @return array Links array.
     */
    public function generate_action_links( $post_id ) {
        $nonce = wp_create_nonce( 'igpr_post_action' );
        
        $approve_link = add_query_arg(
            array(
                'igpr_action' => 'approve',
                'post_id' => $post_id,
                'nonce' => $nonce,
            ),
            admin_url( 'admin.php' )
        );
        
        $reject_link = add_query_arg(
            array(
                'igpr_action' => 'reject',
                'post_id' => $post_id,
                'nonce' => $nonce,
            ),
            admin_url( 'admin.php' )
        );
        
        $preview_link = get_preview_post_link( $post_id );
        $admin_link = get_edit_post_link( $post_id );
        
        return array(
            'approve' => $approve_link,
            'reject' => $reject_link,
            'preview' => $preview_link,
            'admin' => $admin_link,
        );
    }
}