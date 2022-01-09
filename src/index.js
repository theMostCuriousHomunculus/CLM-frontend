import React from 'react';
import { render } from 'react-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';

import App from './App';
import theme from './theme';
import { AuthenticationProvider } from './contexts/Authentication';
import { CardCacheProvider } from './contexts/CardCache';
import { ErrorProvider } from './contexts/Error';
// import * as serviceWorker from '/service-worker.js';

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

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then(function () {
    console.log('Service worker registered!  Yee Haw!');
  });
}

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', function (event) {
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

export { deferredPrompt };
