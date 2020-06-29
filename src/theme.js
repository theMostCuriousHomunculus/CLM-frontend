import { createMuiTheme, hexToRgb } from '@material-ui/core/styles';

const primaryColor = '#0088ff';
const secondaryColor = '#ffc654';
const warningColor = '#ff0000';

const theme = createMuiTheme({
  overrides: {
    MuiDrawer: {
      paper: {
        backgroundColor: primaryColor
      }
    }
  },
  palette: {
    primary: {
      main: primaryColor
    },
    secondary: {
      main: secondaryColor
    },
    warning: {
      main: warningColor
    }
  }
})

export default theme;