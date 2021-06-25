import { createMuiTheme } from '@material-ui/core/styles';
import deepPurple from '@material-ui/core/colors/deepPurple';
import orange from '@material-ui/core/colors/orange';
import yellow from '@material-ui/core/colors/yellow';

const defaultTheme = createMuiTheme();
const backgroundColor = `#f7f7f7`;

const theme = createMuiTheme({
  ...defaultTheme,
  overrides: {
    MuiAppBar: {
      root: {
        margin: 0,
        padding: 0
      }
    },
    MuiCard: {
      root: {
        padding: 0
      }
    },
    MuiCardActions: {
      root: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        padding: 8
      },
      spacing: {
        '& > :not(:first-child)': {
          marginLeft: 0
        }
      }
    },
    MuiCardContent: {
      root: {
        padding: 8
      }
    },
    MuiCardHeader: {
      content: {
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
    MuiDialogActions: {
      root: {
        flexDirection: 'row-reverse',
        justifyContent: 'space-between',
        padding: 8
      },
      spacing: {
        '& > :not(:first-child)': {
          marginLeft: 0
        }
      }
    },
    MuiGrid: {
      container: {
        margin: '0 !important',
        width: '100% !important'
      },
      item: {
        margin: 0,
        padding: 0
      }
    },
    MuiPaper: {
      root: {
        backgroundColor: backgroundColor,
        margin: 4,
        padding: 8
      }
    },
    MuiTableCell: {
      head: {
        color: orange[500],
      },
      root: {
        padding: '4px 8px 4px 8px'
      },
      stickyHeader: {
        backgroundColor: deepPurple[500]
      }
    },
    MuiTabs: {
      root: {
        backgroundColor: orange,
        borderRadius: 4
      }
    }
  },
  palette: {
    primary: deepPurple,
    secondary: orange,
    warning: {
      dark: '#b2a429',
      light: '#ffef62',
      main: yellow['A400']
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
});

export {
  backgroundColor,
  theme as default
};