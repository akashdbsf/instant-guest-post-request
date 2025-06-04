/**
 * Main Admin App Component
 */
import { useState, useEffect } from '@wordpress/element';
import { 
  TabPanel, 
  Button, 
  ToggleControl, 
  TextareaControl, 
  SelectControl, 
  Spinner, 
  Notice, 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Panel, 
  PanelBody, 
  PanelRow, 
  RangeControl 
} from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';

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
                onApprove={async (postId) => {
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
                }}
                onReject={async (postId) => {
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
                }}
              />
            );
          }
        }}
      </TabPanel>
    </div>
  );
};

export default App;