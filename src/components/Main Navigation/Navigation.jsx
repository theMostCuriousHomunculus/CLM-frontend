import React from 'react';
import MUIAppBar from '@material-ui/core/AppBar';
import MUIDrawer from '@material-ui/core/Drawer';
import MUIToolbar from '@material-ui/core/Toolbar';
import MUITypography from '@material-ui/core/Typography';
import MUIMenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import AuthenticateForm from './AuthenticateForm';
import NavigationLinks from './NavigationLinks';
import theme from '../../theme';
import UserSearchBar from './UserSearchBar';

const useStyles = makeStyles({
  appBar: {
    // background: `linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.dark})`
    background: `radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
  },
  drawer: {
    '& .MuiPaper-root': {
      background: /*theme.palette.primary.main*//*`radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`*/`linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`
    }
  },
  headlineContainer: {
    textAlign: 'left'
  },
  menuIcon: {
    border: '1px solid',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '4rem',
    marginRight: 8
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8
  },
  topBarContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  }
});

function Navigation (props) {

  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const classes = useStyles();
  const { history } = props;

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  return (
    <React.Fragment>
      <AuthenticateForm
        open={authenticateFormDisplayed}
        toggleOpen={() => setAuthenticateFormDisplayed(false)}
      />
      <MUIAppBar
        className={classes.appBar}
        position="static"
      >
        <MUIToolbar className={classes.toolbar}>
          <MUIMenuIcon
            className={classes.menuIcon}
            color="secondary"
            onClick={toggleDrawer(true)}
          />
          <div className={classes.headlineContainer}>
            <MUITypography
              color="secondary"
              variant="h2"
            >
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.topBarContainer}>
            <UserSearchBar
              history={history}
              orientation="top"
              setDrawerOpen={setDrawerOpen}
            />
          </div>
        </MUIToolbar>
        <MUIDrawer
          anchor="left"
          className={classes.drawer}
          id="side-navigation"
          onClose={toggleDrawer(false)}
          open={drawerOpen}
        >
          <UserSearchBar
            history={history}
            orientation="side"
            setDrawerOpen={setDrawerOpen}
          />
          <NavigationLinks
            history={history}
            setAuthenticateFormDisplayed={setAuthenticateFormDisplayed}
            toggleDrawer={toggleDrawer}
          />
        </MUIDrawer>
      </MUIAppBar>
    </React.Fragment>
  );
}

export default withRouter(Navigation);