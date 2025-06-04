<?php
/**
 * Guest post form template.
 *
 * @package Instant_Guest_Post_Request
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Get form style
$form_style = isset( $form_style ) ? $form_style : 'light';
$form_class = 'light' === $form_style ? 'bg-white' : 'bg-gray-800 text-white';
$input_class = 'light' === $form_style ? 'bg-gray-50 border border-gray-300 text-gray-900' : 'bg-gray-700 border border-gray-600 text-white';
$button_class = 'light' === $form_style ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white';
?>

<div class="igpr-form-container <?php echo esc_attr( $form_class ); ?> rounded-lg shadow-md p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-6 <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
        <?php esc_html_e( 'Submit a Guest Post', 'instant-guest-post-request' ); ?>
    </h2>
    
    <div class="igpr-form-messages mb-4 hidden">
        <div class="igpr-success hidden p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert"></div>
        <div class="igpr-error hidden p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert"></div>
    </div>
    
    <form id="igpr-guest-post-form" class="space-y-6" enctype="multipart/form-data">
        <?php wp_nonce_field( 'igpr_nonce', 'igpr_nonce' ); ?>
        
        <!-- Honeypot field for spam protection -->
        <div class="website_hp_wrapper" aria-hidden="true" style="position: absolute; left: -9999px;">
            <input type="text" name="website_hp" tabindex="-1" autocomplete="off" />
        </div>
        
        <!-- Post Title -->
        <div>
            <label for="post_title" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Post Title', 'instant-guest-post-request' ); ?> <span class="text-red-500">*</span>
            </label>
            <input type="text" name="post_title" id="post_title" class="<?php echo esc_attr( $input_class ); ?> text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
        </div>
        
        <!-- Post Content -->
        <div>
            <label for="post_content" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Post Content', 'instant-guest-post-request' ); ?> <span class="text-red-500">*</span>
            </label>
            <?php
            $editor_settings = array(
                'textarea_name' => 'post_content',
                'textarea_rows' => 10,
                'media_buttons' => false,
                'teeny'         => true,
                'quicktags'     => false,
            );
            wp_editor( '', 'post_content', $editor_settings );
            ?>
        </div>
        
        <!-- Author Name -->
        <div>
            <label for="author_name" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Your Name', 'instant-guest-post-request' ); ?> <span class="text-red-500">*</span>
            </label>
            <input type="text" name="author_name" id="author_name" class="<?php echo esc_attr( $input_class ); ?> text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
        </div>
        
        <!-- Author Email -->
        <div>
            <label for="author_email" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Your Email', 'instant-guest-post-request' ); ?> <span class="text-red-500">*</span>
            </label>
            <input type="email" name="author_email" id="author_email" class="<?php echo esc_attr( $input_class ); ?> text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" required>
        </div>
        
        <!-- Author Bio -->
        <div>
            <label for="author_bio" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Your Bio', 'instant-guest-post-request' ); ?>
            </label>
            <textarea name="author_bio" id="author_bio" rows="3" class="<?php echo esc_attr( $input_class ); ?> text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"></textarea>
        </div>
        
        <!-- Featured Image -->
        <div>
            <label for="featured_image" class="block mb-2 text-sm font-medium <?php echo 'dark' === $form_style ? 'text-white' : 'text-gray-900'; ?>">
                <?php esc_html_e( 'Featured Image', 'instant-guest-post-request' ); ?>
            </label>
            <input type="file" name="featured_image" id="featured_image" accept="image/jpeg,image/png,image/gif" class="block w-full text-sm <?php echo 'dark' === $form_style ? 'text-gray-300' : 'text-gray-900'; ?> file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold <?php echo 'dark' === $form_style ? 'file:bg-gray-700 file:text-white' : 'file:bg-blue-50 file:text-blue-700'; ?> hover:file:bg-blue-100">
            <p class="mt-1 text-sm <?php echo 'dark' === $form_style ? 'text-gray-400' : 'text-gray-500'; ?>">
                <?php esc_html_e( 'JPG, PNG or GIF (MAX. 2MB)', 'instant-guest-post-request' ); ?>
            </p>
        </div>
        
        <!-- Submit Button -->
        <div>
            <button type="submit" id="igpr-submit-button" class="<?php echo esc_attr( $button_class ); ?> focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center">
                <?php esc_html_e( 'Submit Guest Post', 'instant-guest-post-request' ); ?>
            </button>
            <span id="igpr-spinner" class="inline-block ml-3 align-middle hidden">
                <svg class="animate-spin h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </span>
        </div>
    </form>
</div>