import { createTheme } from '@mui/material/styles';
import { deepPurple, orange, yellow } from '@mui/material/colors';

const backgroundColor = `#efefef`;

const theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-expanded': {
            margin: 4,
          }
        }
      }
    },
    MuiAccordionActions: {
      styleOverrides: {
        root: {
          marginTop: 8,
          padding: 0
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        content: {
          margin: 0
        },
        root: {
          padding: '0 4px'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          margin: 0,
          padding: 0
        }
      }
    },
    MuiButton: {
      defaultProps: {
        size: 'small',
        variant: 'contained'
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiCardActions: {
      styleOverrides: {
        root: {
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          padding: 8
        }
      }
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 8
        }
      }
    },
    MuiCardHeader: {
      styleOverrides: {
        action: {
          display: 'flex',
          flexDirection: 'column',
          marginLeft: 8,
          marginRight: 0,
          marginTop: 0
        },
        content: {
          wordBreak: 'break-word'
        },
        root: {
          padding: 8
        }
      }
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          padding: '56.25% 0 0 0',
          width: '100%'
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          flexDirection: 'row-reverse',
          justifyContent: 'space-between',
          padding: 8
        },
        spacing: {
          '& > :not(:first-of-type)': {
            marginLeft: 0
          }
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        container: {
          margin: '0 !important',
          width: '100% !important'
        },
        item: {
          margin: 0,
          padding: 0
        }
      }
    },
    MuiListSubheader: {
      styleOverrides: {
        root: {
          backgroundColor
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: backgroundColor,
          margin: 4,
          padding: 8
        }
      }
    },
    MuiSelect: {
      defaultProps: {
        size: 'small'
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          color: orange[500],
        },
        root: {
          padding: '4px 8px 4px 8px'
        },
        stickyHeader: {
          backgroundColor: deepPurple[500]
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: orange,
          borderRadius: 4
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        size: 'small'
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