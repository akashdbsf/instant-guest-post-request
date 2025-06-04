/**
 * Main Admin App Component
 */
import { useState, useEffect } from '@wordpress/element';
import { TabPanel, Button, Spinner, Notice } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

// Import sub-components
import GeneralSettings from './GeneralSettings';
import NotificationSettings from './NotificationSettings';
import FormStyleSettings from './FormStyleSettings';
import PendingSubmissions from './PendingSubmissions';

const App = () => {
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
        method: 'GET'
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
        method: 'GET'
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
        data: settings
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
  
  /**
   * Handle post approval
   */
  const approvePost = async (postId) => {
    try {
      await apiFetch({ 
        path: `igpr/v1/post/${postId}/approve`,
        method: 'POST'
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
        method: 'POST'
      });
      
      showNotice(igprData.i18n.rejectSuccess, 'success');
      fetchPendingPosts();
    } catch (error) {
      console.error('Error rejecting post:', error);
      showNotice(igprData.i18n.actionError, 'error');
    }
  };
  
  // If still loading, show spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Spinner />
        <p className="mt-4">{__('Loading settings...', 'instant-guest-post-request')}</p>
      </div>
    );
  }
  
  return (
    <div className="my-5">
      {notice.show && (
        <Notice status={notice.status} isDismissible={true} onRemove={() => setNotice({ show: false })}>
          {notice.message}
        </Notice>
      )}
      
      <TabPanel
        className="mb-6"
        activeClass="border-b-2 border-blue-600 text-blue-600"
        tabs={[
          { name: 'general', title: __('General Settings', 'instant-guest-post-request') },
          { name: 'notification', title: __('Notification Settings', 'instant-guest-post-request') },
          { name: 'form', title: __('Form Style', 'instant-guest-post-request') },
          { name: 'submissions', title: __('Pending Submissions', 'instant-guest-post-request') }
        ]}
      >
        {(tab) => {
          if (tab.name === 'general') {
            return (
              <GeneralSettings 
                settings={settings}
                categories={categories}
                onChange={handleSettingChange}
                onSave={saveSettings}
                isSaving={isSaving}
              />
            );
          }
          
          if (tab.name === 'notification') {
            return (
              <NotificationSettings 
                settings={settings}
                onChange={handleSettingChange}
                onSave={saveSettings}
                isSaving={isSaving}
              />
            );
          }
          
          if (tab.name === 'form') {
            return (
              <FormStyleSettings 
                settings={settings}
                onChange={handleSettingChange}
                onSave={saveSettings}
                isSaving={isSaving}
              />
            );
          }
          
          if (tab.name === 'submissions') {
            return (
              <PendingSubmissions 
                posts={pendingPosts}
                count={pendingCount}
                onRefresh={fetchPendingPosts}
                onApprove={approvePost}
                onReject={rejectPost}
              />
            );
          }
        }}
      </TabPanel>
    </div>
  );
};

export default App;