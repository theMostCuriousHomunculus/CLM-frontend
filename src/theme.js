import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import lightGreen from '@material-ui/core/colors/lightGreen';

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  ...defaultTheme,
  overrides: {
    MuiCard: {
      root: {
        background: '#f7f7f7',
        margin: 8,
        padding: 0
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
        padding: 0,
        '& .MuiCard-root': {
          margin: 0
        }
      },
      "spacing-xs-2": {
        margin: 0,
        padding: 0,
        width: '100%'
      }
    },
    MuiTableCell: {
      head: {
        color: lightGreen['A400'],
      },
      root: {
        padding: '4px 8px 4px 8px'
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