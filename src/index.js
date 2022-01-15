import React from 'react';
import { render } from 'react-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import App from './App';
import theme from './theme';
import { AuthenticationProvider } from './contexts/Authentication';
import { PermissionsProvider } from './contexts/Permissions';
import { CardCacheProvider } from './contexts/CardCache';
import { ErrorProvider } from './contexts/Error';

render(
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <ErrorProvider>
        <AuthenticationProvider>
          <PermissionsProvider>
            <CardCacheProvider>
              <App />
            </CardCacheProvider>
          </PermissionsProvider>
        </AuthenticationProvider>
      </ErrorProvider>
    </StyledEngineProvider>
  </ThemeProvider>,
  document.getElementById('root')
);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js');
}
