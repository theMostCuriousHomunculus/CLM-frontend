import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import lightGreen from '@material-ui/core/colors/lightGreen';

const defaultTheme = createMuiTheme();
const { breakpoints } = defaultTheme;

const theme = createMuiTheme({
  ...defaultTheme,
  overrides: {
    MuiCard: {
      root: {
        padding: 8,
        margin: '1rem',
        maxWidth: 'calc(100vw - 2rem)'
      }
    },
    MuiCardActions: {
      root: {
        padding: 0
      }
    },
    MuiCardContent: {
      root: {
        padding: 0,
        '&:last-child': {
          paddingBottom: 0
        }
      }
    },
    MuiCardHeader: {
      content: {
        width: 'calc(100% - 166px)',
        wordBreak: 'break-word'
      },
      root: {
        padding: '0 0 16px 0'
      }
    },
    MuiTypography: {
      h1: {
        fontSize: '6rem',
        [breakpoints.down('sm')]: {
          fontSize: '4rem'
        }
      },
      h2: {
        fontSize: '3.75rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '2.5rem'
        // }
      },
      h3: {
        fontSize: '3rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '2rem'
        // }
      },
      h4: {
        fontSize: '2.4rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '1.6rem'
        // }
      },
      h5: {
        fontSize: '2rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '1.4rem'
        // }
      },
      body1: {
        fontSize: '1.6rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '1.2rem'
        // }
      },
      body2: {
        fontSize: '1.2rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '1rem'
        // }
      },
      button: {
        fontSize: '1.6rem',
        // [breakpoints.down('sm')]: {
        //   fontSize: '1.2rem'
        // }
      }
    }    
  },
  palette: {
    primary: {
      main: deepPurple[400]
    },
    secondary: {
      main: lightGreen['A400']
    },
    warning: {
      dark: '#df5f00',
      light: '#ff9f3f',
      main: '#ff7f1f'
    }
  },
  typography: {
    fontFamily: [
      'Ubuntu',
      'Roboto',
      'Arial',
      'sans-serif'
    ].join(','),
    htmlFontSize: 10
  }
})

export default theme;