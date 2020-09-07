import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import lightGreen from '@material-ui/core/colors/lightGreen';

const defaultTheme = createMuiTheme();
const { breakpoints } = defaultTheme;

const theme = createMuiTheme({
  ...defaultTheme,
  overrides: {
    MuiButton: {
      root: {
        fontSize: '1rem',
        [breakpoints.down('sm')]: {
          fontSize: '0.7rem'
        }
      }
    },
    MuiCard: {
      root: {
        padding: 0,
        margin: 8
      }
    },
    MuiCardActions: {
      root: {
        display: 'flex',
        justifyContent: 'flex-end',
        padding: 8
      }
    },
    MuiCardContent: {
      root: {
        padding: 8,
        '&:last-child': {
          paddingBottom: 8
        }
      }
    },
    MuiCardHeader: {
      content: {
        width: 'calc(100% - 166px)',
        wordBreak: 'break-word'
      },
      root: {
        padding: 8
      }
    },
    MuiCardMedia: {
      root: {
        padding: '56.25% 0 0 0',
        width: '100%'
      }
    },
    MuiGrid: {
      container: {
        margin: 0,
        padding: 8
      },
      item: {
        margin: 0,
        padding: 0
      },
      "spacing-xs-2": {
        margin: 0,
        padding: 0,
        width: '100%'
      }
    },
    MuiTypography: {
      h1: {
        fontSize: '4rem',
        [breakpoints.down('sm')]: {
          fontSize: '2rem'
        }
      },
      h2: {
        fontSize: '3.5rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.75rem'
        }
      },
      h3: {
        fontSize: '3rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.5rem'
        }
      },
      h4: {
        fontSize: '2.5rem',
        [breakpoints.down('sm')]: {
          fontSize: '1.25rem'
        }
      },
      h5: {
        fontSize: '2rem',
        [breakpoints.down('sm')]: {
          fontSize: '1rem'
        }
      },
      body1: {
        fontSize: '1.5rem',
        [breakpoints.down('sm')]: {
          fontSize: '0.85rem'
        }
      },
      body2: {
        fontSize: '1rem',
        [breakpoints.down('sm')]: {
          fontSize: '0.7rem'
        }
      },
      subtitle1: {
        fontSize: '2rem',
        [breakpoints.down('sm')]: {
          fontSize: '1rem'
        }
      },
      subtitle2: {
        fontSize: '1.5rem',
        [breakpoints.down('sm')]: {
          fontSize: '0.85rem'
        }
      }
    },
    MuiTableCell: {
      body: {
        fontSize: '1.5rem',
        [breakpoints.down('sm')]: {
          fontSize: '0.85rem'
        }
      },
      head: {
        color: lightGreen['A400'],
        fontSize: '2rem',
        [breakpoints.down('sm')]: {
          fontSize: '1rem'
        }
      },
      stickyHeader: {
        backgroundColor: deepPurple[400]
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
    ].join(',')
  }
})

export default theme;