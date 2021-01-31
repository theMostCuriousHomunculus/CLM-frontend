import React from 'react';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Account from './Account';
import { AuthenticationContext } from '../contexts/authentication-context';

describe('Account', function () {

  const customRender = (ui, { providerProps, ...renderOptions }) => {
    return render(
      <AuthenticationContext.Provider {...providerProps}>{ui}</AuthenticationContext.Provider>,
      renderOptions
    )
  };

  test('renders Account component', async function () {

    const history = createMemoryHistory();
    const route = '/account/5ee95d10eba5514fdcd8624a';
    history.push(route);

    const providerProps = {
      value: {
        isAdmin: false,
        isLoggedIn: true,
        login: () => {},
        logout: () => {},
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZWU5NWQxMGViYTU1MTRmZGNkODYyNGEiLCJpYXQiOjE2MDc4MzQ1OTZ9.UR-IugZ-KuePy4qmANqpukviM1fKowc3BervDzvgyjY',
        userId: '5ee95d10eba5514fdcd8624a'
      }
    };

    customRender(
      <Router history={history}>
        <Route path="/account/:accountId">
          <Account />
        </Route>
      </Router>,
      { providerProps }
    );

    expect(screen.queryByText('Testamundo')).toBeNull();
    expect(screen.queryByText('Create a Cube')).toBeNull();
    expect(await screen.findByText('Testamundo')).toBeInTheDocument();
    expect(screen.queryByText('Create a Cube')).not.toBeNull();
  });
});