/**
 * General Settings Component
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
  SelectControl, 
  ToggleControl, 
  RangeControl 
} from '@wordpress/components';

const GeneralSettings = ({ settings, categories, onChange, onSave, isSaving }) => {
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
                onChange={(value) => onChange('default_category', value)}
                help="Select the default category for guest posts"
              />
            </PanelRow>
            <PanelRow>
              <ToggleControl
                label="Enable Moderation"
                checked={settings.moderation_enabled}
                onChange={(value) => onChange('moderation_enabled', value)}
                help="When enabled, guest posts will be saved as pending for review"
              />
            </PanelRow>
          </PanelBody>
          
          <PanelBody title="Spam Protection" initialOpen={true}>
            <PanelRow>
              <ToggleControl
                label="Enable Spam Protection"
                checked={settings.spam_protection}
                onChange={(value) => onChange('spam_protection', value)}
                help="Enable honeypot and IP-based submission limits"
              />
            </PanelRow>
            <PanelRow>
              <RangeControl
                label="Submission Limit per IP (24 hours)"
                value={settings.submission_limit}
                onChange={(value) => onChange('submission_limit', value)}
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

export default GeneralSettings;