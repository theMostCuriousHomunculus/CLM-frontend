import React, { useContext, useState } from 'react';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAppBar from '@mui/material/AppBar';
import MUIDrawer from '@mui/material/Drawer';
import MUIIconButton from '@mui/material/IconButton';
import MUIToolbar from '@mui/material/Toolbar';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUIMenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import AuthenticateForm from './AuthenticateForm';
import Avatar from '../miscellaneous/Avatar';
import NavigationLinks from './NavigationLinks';
import theme from '../../theme';
import SiteSearchBar from './SiteSearchBar';
import { deferredPrompt } from '../../index';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  appBar: {
    background: `linear-gradient(to right, ${theme.palette.primary.main}, calc(2/3 * 100%), ${theme.palette.secondary.main})`
  },
  drawer: {
    '& .MuiPaper-root': {
      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, calc(2/3 * 100%), ${theme.palette.secondary.main})`,
      margin: 0
    }
  },
  leftContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 2
  },
  menuIcon: {
    border: '4px solid',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    fontSize: '3rem',
    marginRight: 8
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8
  },
  rightContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  }
});

export default function Navigation() {
  const { isLoggedIn, avatar, userID, userName } = useContext(
    AuthenticationContext
  );
  const searchBarLocation = useMediaQuery(theme.breakpoints.up('md'))
    ? 'top'
    : 'side';
  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();

  function toggleDrawer(event) {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen((prevState) => !prevState);
  }

  return (
    <React.Fragment>
      <AuthenticateForm
        open={authenticateFormDisplayed}
        toggleOpen={() => setAuthenticateFormDisplayed(false)}
      />
      <MUIAppBar className={classes.appBar} id="app-bar" position="static">
        <MUIToolbar className={classes.toolbar}>
          <div className={classes.leftContainer}>
            <MUIMenuIcon
              className={classes.menuIcon}
              color="secondary"
              onClick={() => {
                if (deferredPrompt) {
                  deferredPrompt.prompt();

                  deferredPrompt.userChoice.then(function (choice) {
                    if (choice.outcome === 'dismissed') {
                      console.log(
                        `Sadness.  If you change your mind, you can always add it yourself later by using your browser's "Add to Home Screen" feature!`
                      );
                    } else {
                      console.log('Successfully added to your home screen!');
                    }

                    deferredPrompt === null;
                  });
                }

                setDrawerOpen(true);
              }}
            />
            <MUITypography color="inherit" variant="h1">
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.rightContainer}>
            {searchBarLocation === 'top' && (
              <SiteSearchBar setDrawerOpen={setDrawerOpen} color="primary" />
            )}
            {isLoggedIn ? (
              <Link to={`/account/${userID}`} style={{ marginLeft: 8 }}>
                <Avatar alt={userName} size="small" src={avatar} />
              </Link>
            ) : (
              <MUITooltip title="Login / Register">
                <MUIIconButton
                  color="inherit"
                  onClick={() => setAuthenticateFormDisplayed(true)}
                  size="large"
                >
                  <MUIAccountCircleIcon fontSize="large" />
                </MUIIconButton>
              </MUITooltip>
            )}
          </div>
        </MUIToolbar>
        <MUIDrawer
          anchor="left"
          className={classes.drawer}
          id="side-navigation"
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          {searchBarLocation === 'side' && (
            <SiteSearchBar setDrawerOpen={setDrawerOpen} color="secondary" />
          )}
          <NavigationLinks toggleDrawer={toggleDrawer} />
        </MUIDrawer>
      </MUIAppBar>
    </React.Fragment>
  );
}
