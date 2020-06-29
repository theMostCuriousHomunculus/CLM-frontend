import React from 'react';
import {
  AppBar as MUIAppBar,
  Drawer as MUIDrawer,
  IconButton as MUIIconButton,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemIcon as MUIListItemIcon,
  ListItemText as MUIListItemText,
  Toolbar as MUIToolbar,
  Typography as MUITypography
} from '@material-ui/core';
import { 
  AccountCircle as MUIAccountCircle,
  ExitToApp as MUIExitToApp,
  Home as MUIHome,
  Menu as MUIMenu
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import theme from '../theme';

const useStyles = makeStyles({
  item: {
    color: theme.palette.secondary.main
  },
  list: {
    width: 250
  }
});

function Navigation(props) {
  const authentication = React.useContext(AuthenticationContext);
  const { history } = props;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  function NavLinks () {
    const loggedInPages = [
      {
        icon: <MUIHome />,
        name: "Home",
        onClick: () => history.push('/')
      },
      {
        icon: <MUIAccountCircle />,
        name: "My Profile",
        onClick: () => history.push('/account/' + authentication.userId)
      },
      {
        icon: <MUIExitToApp />,
        name: "Logout",
        onClick: authentication.logout
      }
    ];
    const loggedOutPages = [
      {
        icon: <MUIHome />,
        name: "Home",
        onClick: () => history.push('/')
      },
      {
        icon: <MUIExitToApp />,
        name: "Login",
        onClick: () => history.push('/account/authenticate')
      }
    ];
    return (
      <div
        className={classes.list}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
      >
        <MUIList>
          {authentication.isLoggedIn &&
            loggedInPages.map(function (page) {
              return (
                <MUIListItem button key={page.name} onClick={page.onClick}>
                  <MUIListItemIcon className={classes.item}>{page.icon}</MUIListItemIcon>
                  <MUIListItemText className={classes.item} primary={page.name} />
                </MUIListItem>
              );
            })
          }
          {!authentication.isLoggedIn &&
            loggedOutPages.map(function (page) {
              return (
                <MUIListItem button className="menu-list-item" key={page.name} onClick={page.onClick}>
                  <MUIListItemIcon className={classes.item}>{page.icon}</MUIListItemIcon>
                  <MUIListItemText className={classes.item} primary={page.name} />
                </MUIListItem>
              );
            })
          }
        </MUIList>
      </div>
    );
  }

  return (
    <MUIAppBar id="top-navigation" position="static">
      <MUIToolbar id="navigation-toolbar">
        <MUIMenu color="secondary" id="menu-icon" onClick={toggleDrawer(true)} />
        <MUITypography color="secondary" variant="h1">Cube Level Midnight</MUITypography>
      </MUIToolbar>
      <MUIDrawer
        anchor="left"
        id="side-navigation"
        onClose={toggleDrawer(false)}
        open={drawerOpen}
      >
        {NavLinks()}
      </MUIDrawer>
    </MUIAppBar>
  );
}

export default withRouter(Navigation);