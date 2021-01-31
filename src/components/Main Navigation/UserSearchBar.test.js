import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

import UserSearchBar from './UserSearchBar';

// according to MUI, this workaround is not needed with jest 26+
// global.document.createRange = () => ({
//   setStart: () => {},
//   setEnd: () => {},
//   commonAncestorContainer: {
//     nodeName: 'BODY',
//     ownerDocument: document,
//   },
// });

describe('UserSearchBar', function () {
  test('renders UserSearchBar component', async function () {

    render(<UserSearchBar />);

    await userEvent.type(screen.getByRole('textbox'), 'Curious');
    expect(await screen.findByText('The Most Curious Homunculus')).toBeInTheDocument();
    screen.debug();
  });
});