# Instant Guest Post Request - Architecture

This document outlines the architecture and file structure of the Instant Guest Post Request WordPress plugin.

## Directory Structure

```
instant-guest-post-request/
├── src/
│   ├── admin/
│   │   ├── components/
│   │   ├── class-igpr-admin.php
│   │   ├── index.js
│   │   └── style.css
│   └── frontend/
│       ├── index.js
│       └── style.css
├── includes/
│   ├── class-igpr-api.php
│   ├── class-igpr-approval-handler.php
│   ├── class-igpr-email-handler.php
│   ├── class-igpr-form-handler.php
│   ├── class-igpr-post-handler.php
│   └── class-igpr-shortcodes.php
├── templates/
│   └── guest-post-form.php
├── tests/
│   ├── components/
│   ├── e2e/
│   ├── ApprovalHandlerTest.php
│   ├── EmailHandlerTest.php
│   ├── FormHandlerTest.php
│   ├── PostHandlerTest.php
│   ├── RateLimitTest.php
│   └── setupTests.js
├── vendor/
├── instant-guest-post-request.php
├── composer.json
├── package.json
├── webpack.config.js
├── tailwind.config.js
├── phpunit.xml
├── README.md
├── architecture.md
└── prd.md
```

## Core Components

### Main Plugin File

- **instant-guest-post-request.php**: The main plugin file that initializes the plugin, defines constants, and loads required files.

### Admin Components

- **src/admin/class-igpr-admin.php**: Handles admin menu, settings page, and dashboard widget.
- **src/admin/index.js**: React-based admin interface for the settings page.
- **src/admin/style.css**: Styles for the admin interface.
- **src/admin/components/**: React components for the admin interface.

### Frontend Components

- **src/frontend/index.js**: JavaScript for the frontend form submission.
- **src/frontend/style.css**: TailwindCSS styles for the frontend form.
- **templates/guest-post-form.php**: Template for the guest post submission form.

### Core Functionality

- **includes/class-igpr-shortcodes.php**: Registers and handles the `[guest_post_form]` shortcode.
- **includes/class-igpr-form-handler.php**: Processes form submissions and validates input.
- **includes/class-igpr-post-handler.php**: Handles post creation, approval, and rejection.
- **includes/class-igpr-approval-handler.php**: Manages the approval workflow for guest posts.
- **includes/class-igpr-email-handler.php**: Manages email notifications.
- **includes/class-igpr-api.php**: Provides REST API endpoints for the React admin interface.

## Data Flow

1. **Form Submission**:

   - User submits the form on the frontend
   - `src/frontend/index.js` sends AJAX request to WordPress
   - `includes/class-igpr-form-handler.php` processes the submission
   - Rate limiting is checked before processing
   - Post is created as pending via `wp_insert_post()`
   - Secure approval token is generated and stored
   - Email notification is sent via `includes/class-igpr-email-handler.php`

2. **Admin Approval/Rejection**:

   - Admin receives email with approval/rejection links containing secure tokens
   - Clicking links triggers `includes/class-igpr-approval-handler.php`
   - Token validity and expiration are verified
   - Post status is updated via `includes/class-igpr-post-handler.php`
   - Notification email is sent to the author

3. **Settings Management**:
   - Admin interacts with React-based settings page
   - `src/admin/index.js` sends requests to REST API endpoints
   - `includes/class-igpr-api.php` processes requests and updates settings
   - Settings are validated before saving

## Technologies Used

- **PHP**: Core plugin functionality
- **WordPress APIs**: Post, Meta, REST API, Shortcodes
- **ReactJS**: Admin interface
- **TailwindCSS**: Frontend styling
- **ForceUI Components**: Admin UI components
- **Webpack**: Asset bundling
- **Jest/PHPUnit**: Testing frameworks

## Database Structure

The plugin uses the following database elements:

1. **WordPress Posts Table**:

   - Stores guest post submissions as regular posts with 'pending' status

2. **WordPress Postmeta Table**:

   - `_igpr_author_name`: Guest author name
   - `_igpr_author_email`: Guest author email
   - `_igpr_author_bio`: Guest author bio
   - `_igpr_approval_token`: Secure token for post approval
   - `_igpr_submission_ip`: Hashed IP address of submitter
   - `_igpr_approval_expiry`: Timestamp for token expiration

3. **WordPress Options Table**:

   - `igpr_settings`: Plugin settings (serialized array)
   - `igpr_version`: Plugin version for database migrations

4. **WordPress Transients**:
   - `igpr_submissions_{hash}`: Tracks IP-based submission limits
   - `igpr_rate_limit_{hash}`: Enhanced rate limiting data

## Hooks and Filters

The plugin provides the following hooks for developers:

1. **Actions**:

   - `igpr_before_form_submission`: Before processing form submission
   - `igpr_after_form_submission`: After successful form submission
   - `igpr_post_approved`: When a post is approved
   - `igpr_post_rejected`: When a post is rejected
   - `igpr_before_approval_email`: Before sending approval email
   - `igpr_after_approval_email`: After sending approval email

2. **Filters**:
   - `igpr_form_fields`: Modify form fields
   - `igpr_email_template`: Modify email template
   - `igpr_post_data`: Modify post data before insertion
   - `igpr_approval_url`: Modify approval URL
   - `igpr_rejection_url`: Modify rejection URL
   - `igpr_rate_limit`: Modify rate limiting parameters

## Security Considerations

- Input sanitization using WordPress functions (`sanitize_text_field`, etc.)
- Nonce verification for all form submissions and API requests
- Capability checks for admin actions
- Honeypot fields and IP-based rate limiting for spam protection
- Secure approval links with time-limited tokens
- Content filtering for potentially malicious submissions
- CSRF protection for all admin actions

## Testing Strategy

The plugin includes comprehensive testing:

1. **Unit Tests**:
   - PHPUnit tests for PHP classes in the `tests/` directory
   - Tests for form handling, post processing, email sending, and rate limiting

2. **Component Tests**:
   - Jest tests for React components in `tests/components/`
   - Testing UI interactions and state management

3. **End-to-End Tests**:
   - E2E tests in `tests/e2e/` directory
   - Testing complete user flows from form submission to approval

4. **CI/CD Pipeline**:
   - Automated testing via GitHub Actions
   - Code quality checks and test coverage reports

## Build Process

The plugin uses modern build tools:

1. **Webpack**:
   - Bundles JavaScript and CSS assets
   - Configured in `webpack.config.js`

2. **TailwindCSS**:
   - Configured in `tailwind.config.js`
   - PostCSS processing via `postcss.config.js`

3. **Composer**:
   - PHP dependency management
   - Configured in `composer.json`

4. **NPM**:
   - JavaScript dependency management
   - Configured in `package.json`