<?php
/**
 * Plugin Name: Instant Guest Post Request
 * Plugin URI: https://example.com/instant-guest-post-request
 * Description: Allow users to submit guest posts from the frontend with admin approval workflow.
 * Version: 1.0.0
 * Author: WordPress Developer
 * Author URI: https://example.com
 * Text Domain: instant-guest-post-request
 * Domain Path: /languages
 * License: GPL v2 or later
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants
define( 'IGPR_VERSION', '1.0.0' );
define( 'IGPR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'IGPR_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'IGPR_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

/**
 * Main Plugin Class
 */
class Instant_Guest_Post_Request {

    /**
     * Instance of this class.
     *
     * @var object
     */
    protected static $instance = null;

    /**
     * Return an instance of this class.
     *
     * @return object A single instance of this class.
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initialize the plugin.
     */
    public function __construct() {
        // Load plugin files
        $this->includes();
        
        // Initialize components
        $this->init();
        
        // Register activation and deactivation hooks
        register_activation_hook( __FILE__, array( $this, 'activate' ) );
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );
    }

    /**
     * Load required files.
     */
    private function includes() {
        // Core functionality
        require_once IGPR_PLUGIN_DIR . 'includes/class-igpr-form-handler.php';
        require_once IGPR_PLUGIN_DIR . 'includes/class-igpr-post-handler.php';
        require_once IGPR_PLUGIN_DIR . 'includes/class-igpr-email-handler.php';
        require_once IGPR_PLUGIN_DIR . 'includes/class-igpr-shortcodes.php';
        
        // Admin functionality
        if ( is_admin() ) {
            require_once IGPR_PLUGIN_DIR . 'src/admin/class-igpr-admin.php';
        }
        
        // API functionality
        require_once IGPR_PLUGIN_DIR . 'includes/class-igpr-api.php';
    }

    /**
     * Initialize plugin components.
     */
    private function init() {
        // Initialize shortcodes
        new IGPR_Shortcodes();
        
        // Initialize form handler
        new IGPR_Form_Handler();
        
        // Initialize API
        new IGPR_API();
        
        // Initialize admin if in admin area
        if ( is_admin() ) {
            new IGPR_Admin();
        }
        
        // Load text domain
        add_action( 'plugins_loaded', array( $this, 'load_textdomain' ) );
        
        // Enqueue scripts and styles
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
        
        // Enqueue admin scripts and styles
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
    }

    /**
     * Plugin activation.
     */
    public function activate() {
        // Set default options
        $default_options = array(
            'default_category' => get_option( 'default_category' ),
            'moderation_enabled' => true,
            'email_notification' => true,
            'email_template' => $this->get_default_email_template(),
            'form_style' => 'light',
            'submission_limit' => 3,
            'spam_protection' => true,
        );
        
        add_option( 'igpr_settings', $default_options );
        
        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation.
     */
    public function deactivate() {
        flush_rewrite_rules();
    }

    /**
     * Load plugin text domain.
     */
    public function load_textdomain() {
        load_plugin_textdomain( 'instant-guest-post-request', false, dirname( plugin_basename( __FILE__ ) ) . '/languages' );
    }

    /**
     * Enqueue frontend scripts and styles.
     */
    public function enqueue_frontend_assets() {
        // Enqueue built assets if they exist
        if ( file_exists( IGPR_PLUGIN_DIR . 'build/style-frontend.css' ) ) {
            wp_enqueue_style(
                'igpr-frontend-css',
                IGPR_PLUGIN_URL . 'build/style-frontend.css',
                array(),
                IGPR_VERSION
            );
        }
        
        if ( file_exists( IGPR_PLUGIN_DIR . 'build/frontend.js' ) ) {
            wp_enqueue_script(
                'igpr-frontend-js',
                IGPR_PLUGIN_URL . 'build/frontend.js',
                array( 'jquery' ),
                IGPR_VERSION,
                true
            );
        }
        
        // Localize script with AJAX URL and nonce
        wp_localize_script(
            'igpr-frontend-js',
            'igpr_params',
            array(
                'ajax_url' => admin_url( 'admin-ajax.php' ),
                'nonce' => wp_create_nonce( 'igpr_nonce' ),
                'i18n' => array(
                    'submit_success' => __( 'Your guest post has been submitted successfully!', 'instant-guest-post-request' ),
                    'submit_error' => __( 'There was an error submitting your post. Please try again.', 'instant-guest-post-request' ),
                ),
            )
        );
    }
    
    /**
     * Enqueue admin scripts and styles.
     * 
     * @param string $hook Current admin page hook.
     */
    public function enqueue_admin_assets( $hook ) {
        // Only load on plugin settings page
        if ( 'toplevel_page_igpr-settings' !== $hook ) {
            return;
        }
        
        // Enqueue React and ReactDOM from WordPress
        wp_enqueue_script( 'wp-element' );
        wp_enqueue_script( 'wp-components' );
        wp_enqueue_script( 'wp-api-fetch' );
        wp_enqueue_style( 'wp-components' );
        
        // Enqueue built admin assets
        if ( file_exists( IGPR_PLUGIN_DIR . 'build/style-admin.css' ) ) {
            wp_enqueue_style(
                'igpr-admin-css',
                IGPR_PLUGIN_URL . 'build/style-admin.css',
                array( 'wp-components' ),
                IGPR_VERSION
            );
        }
        
        if ( file_exists( IGPR_PLUGIN_DIR . 'build/admin.js' ) ) {
            wp_enqueue_script(
                'igpr-admin-js',
                IGPR_PLUGIN_URL . 'build/admin.js',
                array( 'wp-element', 'wp-components', 'wp-api-fetch' ),
                IGPR_VERSION,
                true
            );
        }
        
        // Localize script with data
        wp_localize_script(
            'igpr-admin-js',
            'igprData',
            array(
                'apiUrl' => rest_url( 'igpr/v1/' ),
                'nonce' => wp_create_nonce( 'wp_rest' ),
                'i18n' => array(
                    'saveSuccess' => __( 'Settings saved successfully!', 'instant-guest-post-request' ),
                    'saveError' => __( 'Error saving settings.', 'instant-guest-post-request' ),
                    'approveSuccess' => __( 'Post approved and published!', 'instant-guest-post-request' ),
                    'rejectSuccess' => __( 'Post rejected and moved to trash!', 'instant-guest-post-request' ),
                    'actionError' => __( 'Error performing action.', 'instant-guest-post-request' ),
                ),
            )
        );
    }

    /**
     * Get default email template.
     *
     * @return string Default email template.
     */
    private function get_default_email_template() {
        $template = "Subject: New Guest Post Submission: \"{post_title}\"\n\n";
        $template .= "A new guest post was submitted by {author_name} ({author_email})\n\n";
        $template .= "Title: {post_title}\n";
        $template .= "Preview: {preview_link}\n";
        $template .= "➕ Approve: {approve_link} | ❌ Reject: {reject_link}\n\n";
        $template .= "Review: {admin_link}";
        
        return $template;
    }
}

// Initialize the plugin
function igpr_init() {
    return Instant_Guest_Post_Request::get_instance();
}

// Start the plugin
igpr_init();