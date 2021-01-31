import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Resources from './Resources';

describe('Resources', function () {
  test('renders Resources component', function () {
    render(<Resources />);

    expect(screen.getByText('Path to Cube')).toBeInTheDocument();
  });
});