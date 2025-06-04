<?php
/**
 * Email Handler class for Instant Guest Post Request plugin.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Email Handler class.
 */
class IGPR_Email_Handler {

    /**
     * Constructor.
     */
    public function __construct() {
        // Set content type to HTML
        add_filter( 'wp_mail_content_type', array( $this, 'set_html_content_type' ) );
    }

    /**
     * Set email content type to HTML.
     *
     * @return string Content type.
     */
    public function set_html_content_type() {
        return 'text/html';
    }

    /**
     * Send new post notification email.
     *
     * @param int $post_id Post ID.
     * @return bool Whether the email was sent successfully.
     */
    public function send_new_post_notification( $post_id ) {
        // Get post data
        $post = get_post( $post_id );
        if ( ! $post ) {
            return false;
        }

        // Get author data
        $author_name = get_post_meta( $post_id, '_igpr_author_name', true );
        $author_email = get_post_meta( $post_id, '_igpr_author_email', true );

        // Get admin email
        $admin_email = get_option( 'admin_email' );

        // Get plugin settings
        $settings = get_option( 'igpr_settings', array() );
        $email_template = isset( $settings['email_template'] ) ? $settings['email_template'] : '';

        // If no template, use default
        if ( empty( $email_template ) ) {
            $email_template = $this->get_default_email_template();
        }

        // Get post handler to generate links
        $post_handler = new IGPR_Post_Handler();
        $links = $post_handler->generate_action_links( $post_id );

        // Replace placeholders in template
        $replacements = array(
            '{post_title}' => $post->post_title,
            '{author_name}' => $author_name,
            '{author_email}' => $author_email,
            '{preview_link}' => '<a href="' . esc_url( $links['preview'] ) . '">' . __( 'Preview Post', 'instant-guest-post-request' ) . '</a>',
            '{approve_link}' => '<a href="' . esc_url( $links['approve'] ) . '">' . __( 'Approve', 'instant-guest-post-request' ) . '</a>',
            '{reject_link}' => '<a href="' . esc_url( $links['reject'] ) . '">' . __( 'Reject', 'instant-guest-post-request' ) . '</a>',
            '{admin_link}' => '<a href="' . esc_url( $links['admin'] ) . '">' . __( 'Edit in Admin', 'instant-guest-post-request' ) . '</a>',
        );

        // Extract subject from template
        $template_parts = explode( "\n", $email_template, 2 );
        $subject = '';
        $body = $email_template;

        if ( count( $template_parts ) === 2 && strpos( $template_parts[0], 'Subject:' ) === 0 ) {
            $subject = trim( str_replace( 'Subject:', '', $template_parts[0] ) );
            $body = $template_parts[1];
        }

        // Replace placeholders in subject and body
        foreach ( $replacements as $placeholder => $value ) {
            $subject = str_replace( $placeholder, strip_tags( $value ), $subject );
            $body = str_replace( $placeholder, $value, $body );
        }

        // Format email body as HTML
        $body = nl2br( $body );
        $body = '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' . $body . '</div>';

        // Send email
        $result = wp_mail( $admin_email, $subject, $body );

        // Reset content type
        remove_filter( 'wp_mail_content_type', array( $this, 'set_html_content_type' ) );

        return $result;
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