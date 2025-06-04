# Instant Guest Post Request - Product Requirements Document

## Overview

Instant Guest Post Request is a WordPress plugin that allows website visitors to submit guest posts through a frontend form without requiring login. The plugin saves submissions as pending posts for admin review and provides email notifications with approval/rejection links.

## Target Audience

- Blog owners who accept guest posts
- Multi-author websites
- Content-focused websites looking to increase user engagement
- WordPress site owners who want to streamline content submission

## User Stories

### As a Website Visitor

1. I want to submit a guest post without creating an account
2. I want to include my author information with my submission
3. I want to format my post content with a rich text editor
4. I want to upload an image to accompany my post
5. I want to receive confirmation that my submission was successful

### As a Website Administrator

1. I want to receive notifications when new guest posts are submitted
2. I want to quickly approve or reject submissions from my email
3. I want to customize the default category for submissions
4. I want to protect my site from spam submissions
5. I want to customize the appearance of the submission form
6. I want to see pending submissions in my dashboard

## Features and Requirements

### Core Features

#### Frontend Guest Post Form

- **Priority**: High
- **Description**: A frontend form accessible via shortcode `[guest_post_form]`
- **Requirements**:
  - Form fields: Post Title, Post Content (Rich Editor), Author Name, Email, Bio, Upload Image
  - TailwindCSS styling for responsive design
  - Accessible design with ARIA attributes and keyboard navigation
  - Client-side validation
  - AJAX submission without page reload
  - Success/error messages

#### Post Creation

- **Priority**: High
- **Description**: Save submissions as pending posts
- **Requirements**:
  - Save as post type 'post' with status 'pending'
  - Attach uploaded image as featured image
  - Save author details as post meta
  - Apply default category from settings

#### Admin Notification

- **Priority**: High
- **Description**: Email notification system for new submissions
- **Requirements**:
  - Send email to admin on new submission
  - Include post details and author information
  - Include links for preview, approval, and rejection
  - Use customizable email template from settings

#### Settings Page

- **Priority**: Medium
- **Description**: Admin interface for plugin configuration
- **Requirements**:
  - React-based interface with tabs
  - Settings sections: General, Notification, Form Style
  - Option to set default category
  - Email template customization
  - IP submission limits configuration
  - Toggle for moderation
  - Light/Dark mode selection for form UI

#### Spam Protection

- **Priority**: Medium
- **Description**: Measures to prevent spam submissions
- **Requirements**:
  - Honeypot fields
  - IP-based submission limits
  - Option to enable/disable protection

#### Admin Dashboard Widget

- **Priority**: Low
- **Description**: Widget showing pending submissions
- **Requirements**:
  - List of recent pending submissions
  - Quick links to preview, approve, or reject
  - Link to view all pending submissions

### Optional Features

#### Newsletter Integration

- **Priority**: Low
- **Description**: Option for submitters to join a newsletter
- **Requirements**:
  - Opt-in checkbox on the form
  - Integration with popular email services

## Technical Requirements

- WordPress 5.8+
- PHP 7.4+
- JavaScript (ES6+)
- ReactJS for admin UI
- TailwindCSS for frontend styling
- ForceUI components for admin interface
- REST API for admin interface communication

## User Interface

### Frontend Form

- Clean, minimalist design
- Responsive layout
- Light and dark mode options
- Clear error and success messages
- Accessible form controls

### Admin Interface

- Tab-based settings page
- Form style preview
- Pending submissions table
- Dashboard widget

## Performance Requirements

- Form submission should complete within 3 seconds
- Admin interface should load within 2 seconds
- Plugin should have minimal impact on page load time

## Security Requirements

- Input sanitization for all form fields
- Nonce verification for all form submissions
- Capability checks for admin actions
- Rate limiting for submissions
- Honeypot fields for spam detection

## Compatibility Requirements

- Compatible with major WordPress themes
- Compatible with popular page builders
- Compatible with Gutenberg editor
- Compatible with classic editor

## Testing Requirements

- Unit tests for core functionality
- E2E tests for form submission
- Cross-browser testing
- Mobile responsiveness testing
- Accessibility testing

## Deployment Requirements

- Plugin should be installable via WordPress admin
- Plugin should be activatable without errors
- Plugin should not conflict with common plugins
- Plugin should provide clear documentation

## Success Metrics

- Number of successful submissions
- Spam detection rate
- Admin time saved in content moderation
- User satisfaction with submission process