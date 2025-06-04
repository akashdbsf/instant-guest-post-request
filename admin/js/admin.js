/**
 * Admin JavaScript for Instant Guest Post Request plugin.
 * Uses React, WordPress Components, and ForceUI.
 */

const { useState, useEffect } = wp.element;
const { TabPanel, Button, ToggleControl, TextareaControl, SelectControl, Spinner, Notice, Card, CardHeader, CardBody, CardFooter, Panel, PanelBody, PanelRow, RangeControl } = wp.components;
const { apiFetch } = wp;

/**
 * Main Admin App Component
 */
const IGPRAdminApp = () => {
    // State for settings
    const [settings, setSettings] = useState({
        default_category: '',
        moderation_enabled: true,
        email_notification: true,
        email_template: '',
        form_style: 'light',
        submission_limit: 3,
        spam_protection: true,
    });
    
    // State for UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [notice, setNotice] = useState({ show: false, message: '', status: 'info' });
    const [categories, setCategories] = useState([]);
    const [pendingPosts, setPendingPosts] = useState([]);
    const [pendingCount, setPendingCount] = useState(0);
    
    // Fetch settings on component mount
    useEffect(() => {
        fetchSettings();
        fetchPendingPosts();
    }, []);
    
    /**
     * Fetch settings from API
     */
    const fetchSettings = async () => {
        try {
            const response = await apiFetch({ 
                path: 'igpr/v1/settings',
                method: 'GET',
                headers: {
                    'X-WP-Nonce': igprData.nonce
                }
            });
            
            setSettings(response.settings);
            setCategories(response.categories);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching settings:', error);
            setIsLoading(false);
            showNotice(igprData.i18n.saveError, 'error');
        }
    };
    
    /**
     * Fetch pending posts
     */
    const fetchPendingPosts = async () => {
        try {
            const response = await apiFetch({ 
                path: 'igpr/v1/pending-posts',
                method: 'GET',
                headers: {
                    'X-WP-Nonce': igprData.nonce
                }
            });
            
            setPendingPosts(response.posts);
            setPendingCount(response.total);
        } catch (error) {
            console.error('Error fetching pending posts:', error);
        }
    };
    
    /**
     * Save settings to API
     */
    const saveSettings = async () => {
        setIsSaving(true);
        
        try {
            const response = await apiFetch({ 
                path: 'igpr/v1/settings',
                method: 'POST',
                data: settings,
                headers: {
                    'X-WP-Nonce': igprData.nonce
                }
            });
            
            setSettings(response.settings);
            showNotice(igprData.i18n.saveSuccess, 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            showNotice(igprData.i18n.saveError, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    /**
     * Handle post approval
     */
    const approvePost = async (postId) => {
        try {
            await apiFetch({ 
                path: `igpr/v1/post/${postId}/approve`,
                method: 'POST',
                headers: {
                    'X-WP-Nonce': igprData.nonce
                }
            });
            
            showNotice(igprData.i18n.approveSuccess, 'success');
            fetchPendingPosts();
        } catch (error) {
            console.error('Error approving post:', error);
            showNotice(igprData.i18n.actionError, 'error');
        }
    };
    
    /**
     * Handle post rejection
     */
    const rejectPost = async (postId) => {
        try {
            await apiFetch({ 
                path: `igpr/v1/post/${postId}/reject`,
                method: 'POST',
                headers: {
                    'X-WP-Nonce': igprData.nonce
                }
            });
            
            showNotice(igprData.i18n.rejectSuccess, 'success');
            fetchPendingPosts();
        } catch (error) {
            console.error('Error rejecting post:', error);
            showNotice(igprData.i18n.actionError, 'error');
        }
    };
    
    /**
     * Show notification
     */
    const showNotice = (message, status = 'info') => {
        setNotice({ show: true, message, status });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            setNotice({ show: false, message: '', status: 'info' });
        }, 5000);
    };
    
    /**
     * Handle setting changes
     */
    const handleSettingChange = (key, value) => {
        setSettings({
            ...settings,
            [key]: value
        });
    };
    
    // If still loading, show spinner
    if (isLoading) {
        return (
            <div className="igpr-loading">
                <Spinner />
                <p>Loading settings...</p>
            </div>
        );
    }
    
    return (
        <div className="igpr-admin-container">
            {notice.show && (
                <Notice status={notice.status} isDismissible={true} onRemove={() => setNotice({ show: false })}>
                    {notice.message}
                </Notice>
            )}
            
            <TabPanel
                className="igpr-tabs"
                activeClass="active-tab"
                tabs={[
                    { name: 'general', title: 'General Settings' },
                    { name: 'notification', title: 'Notification Settings' },
                    { name: 'form', title: 'Form Style' },
                    { name: 'submissions', title: 'Pending Submissions' }
                ]}
            >
                {(tab) => {
                    if (tab.name === 'general') {
                        return (
                            <Card>
                                <CardHeader>
                                    <h2>General Settings</h2>
                                </CardHeader>
                                <CardBody>
                                    <Panel>
                                        <PanelBody title="Post Settings" initialOpen={true}>
                                            <PanelRow>
                                                <SelectControl
                                                    label="Default Category"
                                                    value={settings.default_category}
                                                    options={[
                                                        { label: 'Select a category', value: '' },
                                                        ...categories
                                                    ]}
                                                    onChange={(value) => handleSettingChange('default_category', value)}
                                                    help="Select the default category for guest posts"
                                                />
                                            </PanelRow>
                                            <PanelRow>
                                                <ToggleControl
                                                    label="Enable Moderation"
                                                    checked={settings.moderation_enabled}
                                                    onChange={(value) => handleSettingChange('moderation_enabled', value)}
                                                    help="When enabled, guest posts will be saved as pending for review"
                                                />
                                            </PanelRow>
                                        </PanelBody>
                                        
                                        <PanelBody title="Spam Protection" initialOpen={true}>
                                            <PanelRow>
                                                <ToggleControl
                                                    label="Enable Spam Protection"
                                                    checked={settings.spam_protection}
                                                    onChange={(value) => handleSettingChange('spam_protection', value)}
                                                    help="Enable honeypot and IP-based submission limits"
                                                />
                                            </PanelRow>
                                            <PanelRow>
                                                <RangeControl
                                                    label="Submission Limit per IP (24 hours)"
                                                    value={settings.submission_limit}
                                                    onChange={(value) => handleSettingChange('submission_limit', value)}
                                                    min={0}
                                                    max={10}
                                                    help="Set to 0 for unlimited submissions"
                                                />
                                            </PanelRow>
                                        </PanelBody>
                                    </Panel>
                                </CardBody>
                                <CardFooter>
                                    <Button 
                                        isPrimary 
                                        onClick={saveSettings}
                                        isBusy={isSaving}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                    
                    if (tab.name === 'notification') {
                        return (
                            <Card>
                                <CardHeader>
                                    <h2>Notification Settings</h2>
                                </CardHeader>
                                <CardBody>
                                    <Panel>
                                        <PanelBody title="Email Notifications" initialOpen={true}>
                                            <PanelRow>
                                                <ToggleControl
                                                    label="Enable Email Notifications"
                                                    checked={settings.email_notification}
                                                    onChange={(value) => handleSettingChange('email_notification', value)}
                                                    help="Send email notifications when new guest posts are submitted"
                                                />
                                            </PanelRow>
                                            
                                            {settings.email_notification && (
                                                <PanelRow>
                                                    <TextareaControl
                                                        label="Email Template"
                                                        value={settings.email_template}
                                                        onChange={(value) => handleSettingChange('email_template', value)}
                                                        help="Customize the email notification template. Available placeholders: {post_title}, {author_name}, {author_email}, {preview_link}, {approve_link}, {reject_link}, {admin_link}"
                                                        rows={10}
                                                    />
                                                </PanelRow>
                                            )}
                                        </PanelBody>
                                    </Panel>
                                </CardBody>
                                <CardFooter>
                                    <Button 
                                        isPrimary 
                                        onClick={saveSettings}
                                        isBusy={isSaving}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                    
                    if (tab.name === 'form') {
                        return (
                            <Card>
                                <CardHeader>
                                    <h2>Form Style Settings</h2>
                                </CardHeader>
                                <CardBody>
                                    <Panel>
                                        <PanelBody title="Form Appearance" initialOpen={true}>
                                            <PanelRow>
                                                <SelectControl
                                                    label="Form Style"
                                                    value={settings.form_style}
                                                    options={[
                                                        { label: 'Light Mode', value: 'light' },
                                                        { label: 'Dark Mode', value: 'dark' }
                                                    ]}
                                                    onChange={(value) => handleSettingChange('form_style', value)}
                                                    help="Select the style for the guest post submission form"
                                                />
                                            </PanelRow>
                                            
                                            <PanelRow>
                                                <div className="igpr-form-preview">
                                                    <h3>Form Preview</h3>
                                                    <div className={`igpr-preview-box ${settings.form_style === 'dark' ? 'igpr-dark-preview' : 'igpr-light-preview'}`}>
                                                        <div className="igpr-preview-content">
                                                            <div className="igpr-preview-title">Submit a Guest Post</div>
                                                            <div className="igpr-preview-field"></div>
                                                            <div className="igpr-preview-field"></div>
                                                            <div className="igpr-preview-field"></div>
                                                            <div className="igpr-preview-button"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </PanelRow>
                                            
                                            <PanelRow>
                                                <div className="igpr-shortcode-info">
                                                    <h3>Shortcode</h3>
                                                    <p>Use this shortcode to display the guest post form on any page or post:</p>
                                                    <code>[guest_post_form]</code>
                                                </div>
                                            </PanelRow>
                                        </PanelBody>
                                    </Panel>
                                </CardBody>
                                <CardFooter>
                                    <Button 
                                        isPrimary 
                                        onClick={saveSettings}
                                        isBusy={isSaving}
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Save Settings'}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                    
                    if (tab.name === 'submissions') {
                        return (
                            <Card>
                                <CardHeader>
                                    <h2>Pending Submissions ({pendingCount})</h2>
                                </CardHeader>
                                <CardBody>
                                    {pendingPosts.length > 0 ? (
                                        <table className="wp-list-table widefat fixed striped">
                                            <thead>
                                                <tr>
                                                    <th>Title</th>
                                                    <th>Author</th>
                                                    <th>Date</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingPosts.map(post => (
                                                    <tr key={post.id}>
                                                        <td>
                                                            <strong><a href={post.edit_url}>{post.title}</a></strong>
                                                        </td>
                                                        <td>
                                                            {post.author_name}<br />
                                                            <small>{post.author_email}</small>
                                                        </td>
                                                        <td>{post.date}</td>
                                                        <td>
                                                            <div className="igpr-action-buttons">
                                                                <Button 
                                                                    isSecondary
                                                                    isSmall
                                                                    href={post.preview_url}
                                                                    target="_blank"
                                                                >
                                                                    Preview
                                                                </Button>
                                                                <Button 
                                                                    isPrimary
                                                                    isSmall
                                                                    onClick={() => approvePost(post.id)}
                                                                >
                                                                    Approve
                                                                </Button>
                                                                <Button 
                                                                    isDanger
                                                                    isSmall
                                                                    onClick={() => rejectPost(post.id)}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <p>No pending guest post submissions.</p>
                                    )}
                                </CardBody>
                                <CardFooter>
                                    <Button 
                                        isSecondary
                                        onClick={fetchPendingPosts}
                                    >
                                        Refresh List
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    }
                }}
            </TabPanel>
        </div>
    );
};

// Render the app
wp.domReady(() => {
    const container = document.getElementById('igpr-admin-app');
    if (container) {
        wp.element.render(<IGPRAdminApp />, container);
    }
});