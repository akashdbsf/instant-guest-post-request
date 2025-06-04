/**
 * General Settings Component
 */
import { __ } from '@wordpress/i18n';
import { 
  Button, 
  ToggleControl, 
  SelectControl, 
  RangeControl, 
  Panel, 
  PanelBody, 
  PanelRow 
} from '@wordpress/components';

const GeneralSettings = ({ settings, categories, onChange, onSave, isSaving }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">{__('General Settings', 'instant-guest-post-request')}</h2>
      </div>
      <div className="p-4">
        <Panel>
          <PanelBody title={__('Post Settings', 'instant-guest-post-request')} initialOpen={true}>
            <PanelRow>
              <SelectControl
                label={__('Default Category', 'instant-guest-post-request')}
                value={settings.default_category}
                options={[
                  { label: __('Select a category', 'instant-guest-post-request'), value: '' },
                  ...categories
                ]}
                onChange={(value) => onChange('default_category', value)}
                help={__('Select the default category for guest posts', 'instant-guest-post-request')}
              />
            </PanelRow>
            <PanelRow>
              <ToggleControl
                label={__('Enable Moderation', 'instant-guest-post-request')}
                checked={settings.moderation_enabled}
                onChange={(value) => onChange('moderation_enabled', value)}
                help={__('When enabled, guest posts will be saved as pending for review', 'instant-guest-post-request')}
              />
            </PanelRow>
          </PanelBody>
          
          <PanelBody title={__('Spam Protection', 'instant-guest-post-request')} initialOpen={true}>
            <PanelRow>
              <ToggleControl
                label={__('Enable Spam Protection', 'instant-guest-post-request')}
                checked={settings.spam_protection}
                onChange={(value) => onChange('spam_protection', value)}
                help={__('Enable honeypot and IP-based submission limits', 'instant-guest-post-request')}
              />
            </PanelRow>
            <PanelRow>
              <RangeControl
                label={__('Submission Limit per IP (24 hours)', 'instant-guest-post-request')}
                value={settings.submission_limit}
                onChange={(value) => onChange('submission_limit', value)}
                min={0}
                max={10}
                help={__('Set to 0 for unlimited submissions', 'instant-guest-post-request')}
              />
            </PanelRow>
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

export default GeneralSettings;