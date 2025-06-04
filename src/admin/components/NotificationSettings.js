/**
 * Notification Settings Component
 */
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Button, 
  Panel, 
  PanelBody, 
  PanelRow, 
  ToggleControl, 
  TextareaControl 
} from '@wordpress/components';

const NotificationSettings = ({ settings, onChange, onSave, isSaving }) => {
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
                onChange={(value) => onChange('email_notification', value)}
                help="Send email notifications when new guest posts are submitted"
              />
            </PanelRow>
            
            {settings.email_notification && (
              <PanelRow>
                <TextareaControl
                  label="Email Template"
                  value={settings.email_template}
                  onChange={(value) => onChange('email_template', value)}
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
          onClick={onSave}
          isBusy={isSaving}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NotificationSettings;