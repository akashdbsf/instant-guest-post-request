/**
 * Frontend entry point for Instant Guest Post Request plugin.
 */
import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('igpr-guest-post-form');
  
  if (!form) {
    return;
  }
  
  // Handle image preview
  const imageInput = document.getElementById('featured_image');
  const imagePreview = document.getElementById('image-preview');
  const previewImg = document.getElementById('featured-image-preview');
  
  if (imageInput && imagePreview && previewImg) {
    imageInput.addEventListener('change', function() {
      if (this.files && this.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
          previewImg.src = e.target.result;
          imagePreview.classList.remove('hidden');
        };
        
        reader.readAsDataURL(this.files[0]);
      } else {
        imagePreview.classList.add('hidden');
      }
    });
  }
  
  // Handle form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Sync TinyMCE content before submission
    if (typeof tinyMCE !== 'undefined') {
      const editor = tinyMCE.get('post_content');
      if (editor && !editor.isHidden()) {
        // Update the textarea with the current editor content
        editor.save();
      }
    }
    
    // Validate required fields
    const requiredFields = ['post_title', 'post_content', 'author_name', 'author_email'];
    let hasError = false;
    
    requiredFields.forEach(field => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input && !input.value.trim()) {
        hasError = true;
        // Show error for this field
        const errorEl = document.querySelector('.igpr-error');
        errorEl.textContent = `${field.replace('_', ' ')} is required.`;
        errorEl.classList.remove('hidden');
        document.querySelector('.igpr-form-messages').classList.remove('hidden');
      }
    });
    
    if (hasError) {
      return;
    }
    
    // Show spinner
    document.getElementById('igpr-spinner').classList.remove('hidden');
    document.getElementById('igpr-submit-button').disabled = true;
    
    // Hide previous messages
    document.querySelectorAll('.igpr-success, .igpr-error').forEach(el => {
      el.classList.add('hidden');
    });
    
    // Create FormData object for file uploads
    const formData = new FormData(this);
    formData.append('action', 'igpr_submit_guest_post');
    formData.append('nonce', igpr_params.nonce);
    
    // Submit form via fetch API
    fetch(igpr_params.ajax_url, {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(response => {
      // Hide spinner
      document.getElementById('igpr-spinner').classList.add('hidden');
      document.getElementById('igpr-submit-button').disabled = false;
      
      // Show messages container
      document.querySelector('.igpr-form-messages').classList.remove('hidden');
      
      if (response.success) {
        // Show success message
        const successEl = document.querySelector('.igpr-success');
        successEl.textContent = response.data.message;
        successEl.classList.remove('hidden');
        
        // Reset form
        form.reset();
        
        // Reset TinyMCE if it exists
        if (typeof tinyMCE !== 'undefined' && tinyMCE.get('post_content')) {
          tinyMCE.get('post_content').setContent('');
        }
        
        // Hide image preview
        const imagePreview = document.getElementById('image-preview');
        if (imagePreview) {
          imagePreview.classList.add('hidden');
        }
        
        // Scroll to message
        window.scrollTo({
          top: document.querySelector('.igpr-form-messages').offsetTop - 100,
          behavior: 'smooth'
        });
      } else {
        // Show error message
        const errorEl = document.querySelector('.igpr-error');
        errorEl.textContent = response.data.message;
        errorEl.classList.remove('hidden');
      }
    })
    .catch(() => {
      // Hide spinner
      document.getElementById('igpr-spinner').classList.add('hidden');
      document.getElementById('igpr-submit-button').disabled = false;
      
      // Show error message
      document.querySelector('.igpr-form-messages').classList.remove('hidden');
      const errorEl = document.querySelector('.igpr-error');
      errorEl.textContent = igpr_params.i18n.submit_error;
      errorEl.classList.remove('hidden');
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
  document.getElementById('igpr-guest-post-form').setAttribute('aria-live', 'polite');
  document.querySelector('.igpr-success').setAttribute('role', 'status');
  document.querySelector('.igpr-error').setAttribute('role', 'alert');
  
  // Add focus handling for error messages
  document.getElementById('igpr-submit-button').addEventListener('click', function() {
    setTimeout(function() {
      if (!document.querySelector('.igpr-error').classList.contains('hidden')) {
        document.querySelector('.igpr-error').focus();
      }
    }, 1000);
  });
  
  // Ensure form is keyboard navigable
  const formElements = document.querySelectorAll('#igpr-guest-post-form input, #igpr-guest-post-form textarea, #igpr-guest-post-form button');
  formElements.forEach(el => {
    el.addEventListener('keydown', function(e) {
      // If Enter key is pressed on any element except the submit button or textarea
      if (e.keyCode === 13 && !this.matches('button, textarea')) {
        e.preventDefault();
        this.blur();
        
        // Find the next focusable element
        const focusable = Array.from(formElements).filter(el => el.offsetParent !== null);
        const currentIndex = focusable.indexOf(this);
        const nextElement = focusable[currentIndex + 1];
        
        if (nextElement) {
          nextElement.focus();
        } else {
          document.getElementById('igpr-submit-button').focus();
        }
      }
    });
  });
}