import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { deepPurple, deepOrange, green, yellow } from '@mui/material/colors';

const backgroundColor = '#efefef';
const primaryColor = deepPurple;
const secondaryColor = deepOrange;

let theme = createTheme({
  components: {
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          '&.Mui-expanded': {
            margin: 4
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
          columnGap: 8,
          justifyContent: 'space-between',
          padding: 8,
          '& >:not(:first-of-type)': {
            marginLeft: 0
          }
        }
      }
      // spacing: {

      // }
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
          flex: '0 1 auto',
          flexDirection: 'column',
          margin: 0
        },
        avatar: {
          alignItems: 'flex-start',
          alignSelf: 'stretch',
          margin: 0
        },
        content: {
          wordBreak: 'break-word'
        },
        root: {
          columnGap: 8,
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
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px !important'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: 8
        }
      }
    },
    // MuiFormControl: {
    //   defaultProps: {
    //     margin: 'normal'
    //   }
    // },
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
          color: '#fff'
        },
        root: {
          padding: '4px 8px 4px 8px'
        },
        stickyHeader: {
          backgroundColor: primaryColor['A700']
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#fff'
          }
          // '&:hover': {
          //   backgroundColor: primaryColor['A100']
          // }
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderRadius: 4
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        // margin: 'normal',
        size: 'small'
      }
    }
  },
  palette: {
    primary: {
      main: primaryColor['A700']
    },
    secondary: secondaryColor,
    success: {
      main: green['600']
    },
    warning: {
      main: yellow['600']
    }
  },
  typography: {
    fontFamily: ['Ubuntu', 'Roboto', 'Arial', 'sans-serif'].join(','),
    h1: {
      fontSize: '3rem'
    },
    h2: {
      fontSize: '2.5rem'
    },
    h3: {
      fontSize: '2rem'
    },
    h4: {
      fontSize: '1.5rem'
    },
    h5: {
      fontSize: '1rem'
    }
  }
});

theme = responsiveFontSizes(theme);

export { backgroundColor, primaryColor, secondaryColor, theme as default };
