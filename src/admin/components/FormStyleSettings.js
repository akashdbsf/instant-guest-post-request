/**
 * Form Style Settings Component
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
  SelectControl 
} from '@wordpress/components';

const FormStyleSettings = ({ settings, onChange, onSave, isSaving }) => {
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
                onChange={(value) => onChange('form_style', value)}
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

export default FormStyleSettings;