<?php
/**
 * Admin class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Admin class.
 */
class IGPR_Admin {

    /**
     * Constructor.
     */
    public function __construct() {
        // Add admin menu
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        
        // Add dashboard widget
        add_action( 'wp_dashboard_setup', array( $this, 'add_dashboard_widget' ) );
        
        // Add admin notices for messages
        add_action( 'admin_notices', array( $this, 'display_admin_notices' ) );
    }

    /**
     * Add admin menu.
     */
    public function add_admin_menu() {
        add_menu_page(
            __( 'Guest Post Requests', 'instant-guest-post-request' ),
            __( 'Guest Posts', 'instant-guest-post-request' ),
            'manage_options',
            'igpr-settings',
            array( $this, 'render_settings_page' ),
            'dashicons-welcome-write-blog',
            30
        );
    }

    /**
     * Render settings page.
     */
    public function render_settings_page() {
        ?>
        <div class="wrap">
            <h1><?php esc_html_e( 'Guest Post Requests', 'instant-guest-post-request' ); ?></h1>
            <div id="igpr-admin-app"></div>
        </div>
        <?php
    }

    /**
     * Add dashboard widget.
     */
    public function add_dashboard_widget() {
        wp_add_dashboard_widget(
            'igpr_dashboard_widget',
            __( 'Pending Guest Posts', 'instant-guest-post-request' ),
            array( $this, 'render_dashboard_widget' )
        );
    }

    /**
     * Render dashboard widget.
     */
    public function render_dashboard_widget() {
        $args = array(
            'post_type'      => 'post',
            'post_status'    => 'pending',
            'posts_per_page' => 5,
            'meta_query'     => array(
                array(
                    'key'     => '_igpr_author_email',
                    'compare' => 'EXISTS',
                ),
            ),
        );
        
        $query = new WP_Query( $args );
        
        if ( $query->have_posts() ) {
            echo '<ul class="igpr-pending-posts">';
            
            while ( $query->have_posts() ) {
                $query->the_post();
                $post_id = get_the_ID();
                $author_name = get_post_meta( $post_id, '_igpr_author_name', true );
                
                echo '<li>';
                echo '<strong><a href="' . esc_url( get_edit_post_link( $post_id ) ) . '">' . esc_html( get_the_title() ) . '</a></strong>';
                echo '<p>' . esc_html( sprintf( __( 'By %s on %s', 'instant-guest-post-request' ), $author_name, get_the_date() ) ) . '</p>';
                
                // Get post handler to generate links
                $post_handler = new IGPR_Post_Handler();
                $links = $post_handler->generate_action_links( $post_id );
                
                echo '<div class="row-actions">';
                echo '<span class="edit"><a href="' . esc_url( $links['admin'] ) . '">' . esc_html__( 'Edit', 'instant-guest-post-request' ) . '</a> | </span>';
                echo '<span class="view"><a href="' . esc_url( $links['preview'] ) . '">' . esc_html__( 'Preview', 'instant-guest-post-request' ) . '</a> | </span>';
                echo '<span class="approve"><a href="' . esc_url( $links['approve'] ) . '">' . esc_html__( 'Approve', 'instant-guest-post-request' ) . '</a> | </span>';
                echo '<span class="trash"><a href="' . esc_url( $links['reject'] ) . '" class="submitdelete">' . esc_html__( 'Reject', 'instant-guest-post-request' ) . '</a></span>';
                echo '</div>';
                echo '</li>';
            }
            
            echo '</ul>';
            
            $pending_count = $query->found_posts;
            if ( $pending_count > 5 ) {
                $pending_url = admin_url( 'edit.php?post_status=pending&post_type=post' );
                echo '<p class="igpr-view-all"><a href="' . esc_url( $pending_url ) . '">' . esc_html( sprintf( __( 'View all %d pending guest posts', 'instant-guest-post-request' ), $pending_count ) ) . '</a></p>';
            }
        } else {
            echo '<p>' . esc_html__( 'No pending guest posts.', 'instant-guest-post-request' ) . '</p>';
        }
        
        wp_reset_postdata();
    }

    /**
     * Display admin notices.
     */
    public function display_admin_notices() {
        if ( ! isset( $_GET['igpr_message'] ) ) {
            return;
        }
        
        $message = sanitize_text_field( wp_unslash( $_GET['igpr_message'] ) );
        $class = 'notice notice-success is-dismissible';
        
        if ( 'approved' === $message ) {
            $notice = __( 'Guest post approved and published!', 'instant-guest-post-request' );
        } elseif ( 'rejected' === $message ) {
            $notice = __( 'Guest post rejected and moved to trash!', 'instant-guest-post-request' );
        } else {
            return;
        }
        
        printf( '<div class="%1$s"><p>%2$s</p></div>', esc_attr( $class ), esc_html( $notice ) );
    }
}