/**
 * Form Style Settings Component
 */
import { __ } from '@wordpress/i18n';
import {
  SelectControl,
  Panel,
  PanelBody,
  PanelRow
} from '@wordpress/components';
import { Button as ForceButton } from '@bsf/force-ui';

const FormStyleSettings = ({ settings, onChange, onSave, isSaving }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-medium">{__('Form Style Settings', 'instant-guest-post-request')}</h2>
      </div>
      <div className="p-4">
        <Panel>
          <PanelBody title={__('Form Appearance', 'instant-guest-post-request')} initialOpen={true}>
            <PanelRow>
              <SelectControl
                label={__('Form Style', 'instant-guest-post-request')}
                value={settings.form_style}
                options={[
                  { label: __('Light Mode', 'instant-guest-post-request'), value: 'light' },
                  { label: __('Dark Mode', 'instant-guest-post-request'), value: 'dark' }
                ]}
                onChange={(value) => onChange('form_style', value)}
                help={__('Select the style for the guest post submission form', 'instant-guest-post-request')}
              />
            </PanelRow>
            
            <PanelRow>
              <div className="my-5 w-full">
                <h3 className="text-base font-medium mb-2">{__('Form Preview', 'instant-guest-post-request')}</h3>
                <div className={`rounded-lg p-5 mt-2 shadow-sm ${settings.form_style === 'dark' ? 'bg-gray-800 text-white border border-gray-600' : 'bg-white border border-gray-200'}`}>
                  <div className="flex flex-col gap-4">
                    <div className="text-lg font-bold mb-2">{__('Submit a Guest Post', 'instant-guest-post-request')}</div>
                    <div className={`h-5 rounded ${settings.form_style === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}></div>
                    <div className={`h-5 rounded ${settings.form_style === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}></div>
                    <div className={`h-5 rounded ${settings.form_style === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}></div>
                    <div className={`w-32 h-8 rounded mt-2 ${settings.form_style === 'dark' ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                  </div>
                </div>
              </div>
            </PanelRow>
            
            <PanelRow>
              <div className="my-5 p-4 bg-gray-50 border-l-4 border-blue-600">
                <h3 className="text-base font-medium">{__('Shortcode', 'instant-guest-post-request')}</h3>
                <p className="mb-2">{__('Use this shortcode to display the guest post form on any page or post:', 'instant-guest-post-request')}</p>
                <code className="inline-block px-3 py-1 bg-white border border-gray-200 rounded text-sm">[guest_post_form]</code>
              </div>
            </PanelRow>
          </PanelBody>
        </Panel>
      </div>
      <div className="border-t border-gray-200 p-4 flex justify-end">
        <ForceButton
          variant="primary"
          size="sm"
          onClick={onSave}
          loading={isSaving}
          disabled={isSaving}
        >
          {isSaving ? __('Saving...', 'instant-guest-post-request') : __('Save Settings', 'instant-guest-post-request')}
        </ForceButton>
      </div>
    </div>
  );
};

export default FormStyleSettings;