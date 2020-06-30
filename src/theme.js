import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import lightGreen from '@material-ui/core/colors/lightGreen';

// const primaryColor = '#0088ff';
// const secondaryColor = '#ffc654';
const warningColor = '#ff0000';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: deepPurple[400]
    },
    secondary: {
      main: lightGreen['A400']
    },
    warning: {
      main: warningColor
    }
  },
  typography: {
    fontFamily: [
      'Ubuntu',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),

    htmlFontSize: 10,
    h1: {
      fontSize: '6rem'
    },
    h2: {
      fontSize: '3.75rem'
    },
    h3: {
      fontSize: '3rem'
    },
    h4: {
      fontSize: '2.4rem'
    },
    subtitle1: {
      
    },
    subtitle2: {

    },
    body1: {
      fontSize: '1.6rem',
    },
    body2: {
      fontSize: '1.2rem',
    },
    button: {
      fontSize: '1.6rem',
    }
  }
})

export default theme;