<?php
/**
 * Shortcodes class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Shortcodes class.
 */
class IGPR_Shortcodes {

    /**
     * Constructor.
     */
    public function __construct() {
        add_shortcode( 'guest_post_form', array( $this, 'render_guest_post_form' ) );
    }

    /**
     * Render the guest post submission form.
     *
     * @param array $atts Shortcode attributes.
     * @return string HTML output.
     */
    public function render_guest_post_form( $atts ) {
        // Get plugin settings
        $settings = get_option( 'igpr_settings', array() );
        
        // Get form style (light/dark)
        $form_style = isset( $settings['form_style'] ) ? $settings['form_style'] : 'light';
        
        // Enqueue the rich editor
        wp_enqueue_editor();
        
        // Start output buffering
        ob_start();
        
        // Include form template
        include IGPR_PLUGIN_DIR . 'templates/guest-post-form.php';
        
        // Return the buffered content
        return ob_get_clean();
    }
}