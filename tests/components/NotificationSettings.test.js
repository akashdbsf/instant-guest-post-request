import React from 'react';
import { render, screen } from '@testing-library/react';
import NotificationSettings from '../../src/admin/components/NotificationSettings';

describe('NotificationSettings component', () => {
  test('shows template textarea when notifications enabled', () => {
    const settings = { email_notification: true, email_template: 'Hi' };
    render(
      <NotificationSettings
        settings={settings}
        onChange={() => {}}
        onSave={() => {}}
        isSaving={false}
      />
    );
    expect(screen.getByLabelText(/email template/i)).toBeInTheDocument();
    expect(console).not.toHaveErrored();
  });

  test('hides template textarea when notifications disabled', () => {
    const settings = { email_notification: false, email_template: '' };
    render(
      <NotificationSettings
        settings={settings}
        onChange={() => {}}
        onSave={() => {}}
        isSaving={false}
      />
    );
    expect(screen.queryByLabelText(/email template/i)).toBeNull();
    expect(console).not.toHaveErrored();
  });
});
