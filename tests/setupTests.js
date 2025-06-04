import '@testing-library/jest-dom';
import React from 'react';

jest.mock('@bsf/force-ui', () => ({
  Button: ({ loading, ...props }) => <button {...props} />,
}));
