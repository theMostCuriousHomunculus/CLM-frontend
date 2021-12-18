import React, { useContext, useState } from 'react';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAppBar from '@mui/material/AppBar';
import MUIDrawer from '@mui/material/Drawer';
import MUIIconButton from '@mui/material/IconButton';
import MUIToolbar from '@mui/material/Toolbar';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUIMenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

import AuthenticateForm from './AuthenticateForm';
import NavigationLinks from './NavigationLinks';
import theme from '../../theme';
import UserSearchBar from './UserSearchBar';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  appBar: {
    background: `radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
  },
  drawer: {
    '& .MuiPaper-root': {
      background: `linear-gradient(to right, ${theme.palette.primary.light}, ${theme.palette.primary.dark})`
    }
  },
  leftContainer: {
    display: 'flex',
    flexGrow: 2
  },
  menuIcon: {
    border: '1px solid',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: '4rem',
    marginRight: 8
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8
  },
  rightContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  }
});

export default function Navigation() {
  const { isLoggedIn, userID } = useContext(AuthenticationContext);
  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] =
    useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();
  const navigate = useNavigate();

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
              onClick={() => setDrawerOpen(true)}
            />
            <MUITypography
              color="secondary"
              style={{ whiteSpace: 'nowrap' }}
              variant="h3"
            >
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.rightContainer}>
            <UserSearchBar orientation="top" setDrawerOpen={setDrawerOpen} />
            {isLoggedIn && (
              <MUITooltip title="My Profile">
                <MUIIconButton
                  color="secondary"
                  onClick={() => navigate(`/account/${userID}`)}
                  size="small"
                >
                  <MUIAccountCircleIcon />
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
          <UserSearchBar orientation="side" setDrawerOpen={setDrawerOpen} />
          <NavigationLinks
            setAuthenticateFormDisplayed={setAuthenticateFormDisplayed}
            toggleDrawer={toggleDrawer}
          />
        </MUIDrawer>
      </MUIAppBar>
    </React.Fragment>
  );
}
