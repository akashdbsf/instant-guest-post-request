# Instant Guest Post Request

A WordPress plugin that allows visitors to submit guest posts via a frontend form without requiring login.

## Description

Instant Guest Post Request is a powerful WordPress plugin that enables website owners to accept guest post submissions directly from the frontend. The plugin provides a clean, responsive form that can be embedded anywhere using a shortcode. Submissions are saved as pending posts for admin review, with email notifications and one-click approval/rejection links.

## Features

- **Frontend Submission Form**: Clean, responsive form with TailwindCSS styling
- **No Login Required**: Allow anonymous submissions
- **Rich Text Editor**: For post content
- **Featured Image Upload**: Allow users to upload images
- **Admin Notifications**: Email alerts with approval/rejection links
- **Spam Protection**: Honeypot fields and IP-based submission limits
- **Dashboard Widget**: Quick access to pending submissions
- **React Admin Interface**: Modern settings page with tabs
- **Light/Dark Mode**: Form styling options
- **Fully Accessible**: ARIA attributes and keyboard navigation

## Installation

1. Upload the `instant-guest-post-request` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to 'Guest Posts' in the admin menu to configure settings
4. Add the `[guest_post_form]` shortcode to any page or post where you want the submission form to appear

## Usage

### Shortcode

Add the following shortcode to any page or post:

```
[guest_post_form]
```

### Settings

The plugin settings are divided into tabs:

1. **General Settings**
   - Default category for submissions
   - Moderation options
   - Spam protection settings

2. **Notification Settings**
   - Enable/disable email notifications
   - Customize email templates

3. **Form Style**
   - Choose between light and dark mode
   - Preview form appearance

4. **Pending Submissions**
   - View and manage pending guest posts
   - Approve or reject submissions

## Email Template Placeholders

The following placeholders can be used in email templates:

- `{post_title}` - The title of the submitted post
- `{author_name}` - The name of the guest author
- `{author_email}` - The email of the guest author
- `{preview_link}` - Link to preview the post
- `{approve_link}` - Link to approve the post
- `{reject_link}` - Link to reject the post
- `{admin_link}` - Link to edit the post in admin

## Requirements

- WordPress 5.8 or higher
- PHP 7.4 or higher

## Frequently Asked Questions

### Can I customize the form fields?

Currently, the form includes standard fields for post title, content, author name, email, bio, and featured image. Custom fields may be added in future updates.

### How are spam submissions handled?

The plugin includes honeypot fields and IP-based submission limits to prevent spam. You can configure the submission limit per IP address in the settings.

### Can I change the form styling?

Yes, you can choose between light and dark mode for the form. The form uses TailwindCSS for styling and is fully responsive.

## Development Setup

1. Install PHP and Node.js dependencies:

```bash
npm install
composer install
```

2. Build the assets during development:

```bash
npm run build
```

## Changelog

### 1.0.0
- Initial release

## Credits

- Built with React, TailwindCSS, and ForceUI components
- Developed by WordPress Developer

## License

This plugin is licensed under the GPL v2 or later.