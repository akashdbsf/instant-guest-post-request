/**
 * Notification Settings Component
 */
import { __ } from '@wordpress/i18n';
import { 
  Button, 
  ToggleControl, 
  TextareaControl, 
  Panel, 
  PanelBody, 
  PanelRow 
} from '@wordpress/components';

const NotificationSettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">{__('Notification Settings', 'instant-guest-post-request')}</h2>
      </div>
      <div className="p-4">
        <Panel>
          <PanelBody title={__('Email Notifications', 'instant-guest-post-request')} initialOpen={true}>
            <PanelRow>
              <ToggleControl
                label={__('Enable Email Notifications', 'instant-guest-post-request')}
                checked={settings.email_notification}
                onChange={(value) => onChange('email_notification', value)}
                help={__('Send email notifications when new guest posts are submitted', 'instant-guest-post-request')}
              />
            </PanelRow>
            
            {settings.email_notification && (
              <PanelRow>
                <TextareaControl
                  label={__('Email Template', 'instant-guest-post-request')}
                  value={settings.email_template}
                  onChange={(value) => onChange('email_template', value)}
                  help={__('Customize the email notification template. Available placeholders: {post_title}, {author_name}, {author_email}, {preview_link}, {approve_link}, {reject_link}, {admin_link}', 'instant-guest-post-request')}
                  rows={10}
                  className="w-full"
                />
              </PanelRow>
            )}
          </PanelBody>
        </Panel>
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end">
        <Button 
          isPrimary 
          onClick={onSave}
          isBusy={isSaving}
          disabled={isSaving}
        >
          {isSaving ? __('Saving...', 'instant-guest-post-request') : __('Save Settings', 'instant-guest-post-request')}
        </Button>
      </div>
    </div>
  );
};

export default NotificationSettings;