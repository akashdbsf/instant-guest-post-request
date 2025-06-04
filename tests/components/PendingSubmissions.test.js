import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PendingSubmissions from '../../src/admin/components/PendingSubmissions';

describe('PendingSubmissions component', () => {
  test('renders empty state message', () => {
    render(
      <PendingSubmissions
        posts={[]}
        count={0}
        onRefresh={() => {}}
        onApprove={() => {}}
        onReject={() => {}}
      />
    );
    expect(screen.getByText(/no pending submissions/i)).toBeInTheDocument();
    expect(console).not.toHaveErrored();
  });

  test('calls approve and reject handlers', () => {
    const onApprove = jest.fn();
    const onReject = jest.fn();
    const post = {
      id: 1,
      title: 'Hello',
      author_name: 'Tester',
      author_email: 'test@example.com',
      date: 'Today',
      edit_url: '#',
      preview_url: '#'
    };

    render(
      <PendingSubmissions
        posts={[post]}
        count={1}
        onRefresh={() => {}}
        onApprove={onApprove}
        onReject={onReject}
      />
    );
    // React logs a warning for unknown props used by WordPress components
    expect(console).toHaveErrored();
    fireEvent.click(screen.getByText(/approve/i));
    fireEvent.click(screen.getByText(/reject/i));
    expect(onApprove).toHaveBeenCalledWith(1);
    expect(onReject).toHaveBeenCalledWith(1);
  });
});
