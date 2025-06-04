# Instant Guest Post Request - Architecture

This document outlines the architecture and file structure of the Instant Guest Post Request WordPress plugin.

## Directory Structure

```
instant-guest-post-request/
├── admin/
│   ├── css/
│   │   └── admin.css
│   ├── js/
│   │   └── admin.js
│   └── class-igpr-admin.php
├── assets/
│   ├── css/
│   │   └── frontend.css
│   └── js/
│   │   └── frontend.js
├── includes/
│   ├── class-igpr-api.php
│   ├── class-igpr-email-handler.php
│   ├── class-igpr-form-handler.php
│   ├── class-igpr-post-handler.php
│   └── class-igpr-shortcodes.php
├── templates/
│   └── guest-post-form.php
├── instant-guest-post-request.php
├── README.md
├── architecture.md
└── prd.md
```

## Core Components

### Main Plugin File

- **instant-guest-post-request.php**: The main plugin file that initializes the plugin, defines constants, and loads required files.

### Admin Components

- **class-igpr-admin.php**: Handles admin menu, settings page, and dashboard widget.
- **admin/js/admin.js**: React-based admin interface for the settings page.
- **admin/css/admin.css**: Styles for the admin interface.

### Frontend Components

- **assets/js/frontend.js**: JavaScript for the frontend form submission.
- **assets/css/frontend.css**: TailwindCSS styles for the frontend form.
- **templates/guest-post-form.php**: Template for the guest post submission form.

### Core Functionality

- **class-igpr-shortcodes.php**: Registers and handles the `[guest_post_form]` shortcode.
- **class-igpr-form-handler.php**: Processes form submissions and validates input.
- **class-igpr-post-handler.php**: Handles post creation, approval, and rejection.
- **class-igpr-email-handler.php**: Manages email notifications.
- **class-igpr-api.php**: Provides REST API endpoints for the React admin interface.

## Data Flow

1. **Form Submission**:
   - User submits the form on the frontend
   - `frontend.js` sends AJAX request to WordPress
   - `class-igpr-form-handler.php` processes the submission
   - Post is created as pending via `wp_insert_post()`
   - Email notification is sent via `class-igpr-email-handler.php`

2. **Admin Approval/Rejection**:
   - Admin receives email with approval/rejection links
   - Clicking links triggers `class-igpr-post-handler.php`
   - Post status is updated accordingly

3. **Settings Management**:
   - Admin interacts with React-based settings page
   - `admin.js` sends requests to REST API endpoints
   - `class-igpr-api.php` processes requests and updates settings

## Technologies Used

- **PHP**: Core plugin functionality
- **WordPress APIs**: Post, Meta, REST API, Shortcodes
- **ReactJS**: Admin interface
- **TailwindCSS**: Frontend styling
- **ForceUI Components**: Admin UI components

## Database Structure

The plugin uses the following database elements:

1. **WordPress Posts Table**:
   - Stores guest post submissions as regular posts with 'pending' status

2. **WordPress Postmeta Table**:
   - `_igpr_author_name`: Guest author name
   - `_igpr_author_email`: Guest author email
   - `_igpr_author_bio`: Guest author bio

3. **WordPress Options Table**:
   - `igpr_settings`: Plugin settings (serialized array)

4. **WordPress Transients**:
   - `igpr_submissions_{hash}`: Tracks IP-based submission limits

## Hooks and Filters

The plugin provides the following hooks for developers:

1. **Actions**:
   - `igpr_before_form_submission`: Before processing form submission
   - `igpr_after_form_submission`: After successful form submission
   - `igpr_post_approved`: When a post is approved
   - `igpr_post_rejected`: When a post is rejected

2. **Filters**:
   - `igpr_form_fields`: Modify form fields
   - `igpr_email_template`: Modify email template
   - `igpr_post_data`: Modify post data before insertion

## Security Considerations

- Input sanitization using WordPress functions (`sanitize_text_field`, etc.)
- Nonce verification for all form submissions and API requests
- Capability checks for admin actions
- Honeypot fields and IP-based rate limiting for spam protection