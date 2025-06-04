/**
 * Frontend JavaScript for Instant Guest Post Request plugin.
 */
(function($) {
    'use strict';

    // Initialize the form handling when document is ready
    $(document).ready(function() {
        const $form = $('#igpr-guest-post-form');
        
        if (!$form.length) {
            return;
        }
        
        // Handle form submission
        $form.on('submit', function(e) {
            e.preventDefault();
            
            // Show spinner
            $('#igpr-spinner').removeClass('hidden');
            $('#igpr-submit-button').prop('disabled', true);
            
            // Hide previous messages
            $('.igpr-success, .igpr-error').addClass('hidden');
            
            // Create FormData object for file uploads
            const formData = new FormData(this);
            formData.append('action', 'igpr_submit_guest_post');
            formData.append('nonce', igpr_params.nonce);
            
            // Submit form via AJAX
            $.ajax({
                url: igpr_params.ajax_url,
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(response) {
                    // Hide spinner
                    $('#igpr-spinner').addClass('hidden');
                    $('#igpr-submit-button').prop('disabled', false);
                    
                    // Show messages container
                    $('.igpr-form-messages').removeClass('hidden');
                    
                    if (response.success) {
                        // Show success message
                        $('.igpr-success').removeClass('hidden').text(response.data.message);
                        
                        // Reset form
                        $form[0].reset();
                        
                        // Reset TinyMCE if it exists
                        if (typeof tinyMCE !== 'undefined' && tinyMCE.get('post_content')) {
                            tinyMCE.get('post_content').setContent('');
                        }
                        
                        // Scroll to message
                        $('html, body').animate({
                            scrollTop: $('.igpr-form-messages').offset().top - 100
                        }, 500);
                    } else {
                        // Show error message
                        $('.igpr-error').removeClass('hidden').text(response.data.message);
                    }
                },
                error: function() {
                    // Hide spinner
                    $('#igpr-spinner').addClass('hidden');
                    $('#igpr-submit-button').prop('disabled', false);
                    
                    // Show error message
                    $('.igpr-form-messages').removeClass('hidden');
                    $('.igpr-error').removeClass('hidden').text(igpr_params.i18n.submit_error);
                }
            });
        });
        
        // Add accessibility features
        enhanceAccessibility();
    });
    
    /**
     * Enhance form accessibility
     */
    function enhanceAccessibility() {
        // Add ARIA attributes to form elements
        $('#igpr-guest-post-form').attr('aria-live', 'polite');
        $('.igpr-success').attr('role', 'status');
        $('.igpr-error').attr('role', 'alert');
        
        // Add focus handling for error messages
        $('#igpr-submit-button').on('click', function() {
            setTimeout(function() {
                if ($('.igpr-error').is(':visible')) {
                    $('.igpr-error').focus();
                }
            }, 1000);
        });
        
        // Ensure form is keyboard navigable
        $('#igpr-guest-post-form input, #igpr-guest-post-form textarea, #igpr-guest-post-form button').on('keydown', function(e) {
            // If Enter key is pressed on any element except the submit button or textarea
            if (e.keyCode === 13 && !$(this).is('button, textarea')) {
                e.preventDefault();
                $(this).blur();
                
                // Find the next focusable element
                const focusable = $('#igpr-guest-post-form').find('input, select, textarea, button').filter(':visible');
                const nextElement = focusable.eq(focusable.index(this) + 1);
                
                if (nextElement.length) {
                    nextElement.focus();
                } else {
                    $('#igpr-submit-button').focus();
                }
            }
        });
    }
})(jQuery);