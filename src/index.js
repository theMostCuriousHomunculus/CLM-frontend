import React from 'react';
import { render } from 'react-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import App from './App';
import theme from './theme';
import { AuthenticationProvider } from './contexts/Authentication';
import { CardCacheProvider } from './contexts/CardCache';
import { ErrorProvider } from './contexts/Error';

render(
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <ErrorProvider>
        <AuthenticationProvider>
          <CardCacheProvider>
            <App />
          </CardCacheProvider>
        </AuthenticationProvider>
      </ErrorProvider>
    </StyledEngineProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
