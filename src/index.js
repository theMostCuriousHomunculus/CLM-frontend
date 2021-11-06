import React from 'react';
import ReactDOM from 'react-dom';
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import theme from './theme';

import App from './App';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <StyledEngineProvider injectFirst>
      <App />
    </StyledEngineProvider>
  </ThemeProvider>,
  document.getElementById('root')
);
