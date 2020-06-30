import React from 'react';
import {
  AppBar as MUIAppBar,
  Drawer as MUIDrawer,
  InputBase as MUIInputBase,
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
  Menu as MUIMenu,
  Search as MUISearchIcon
} from '@material-ui/icons';
import { fade, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import theme from '../theme';

const useStyles = makeStyles({
  drawer: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.primary.main
    }
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
  item: {
    color: theme.palette.secondary.main,
    '& span, & svg': {
      fontSize: '3rem'
    }
  },
  list: {
    width: 250
  },
  menuIcon: {
    border: '1px solid',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '6.4rem',
    marginRight: '1rem'
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbar: {
    padding: '1rem'
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
                <MUIListItem button key={page.name} onClick={page.onClick}>
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
    <MUIAppBar position="static">
      <MUIToolbar className={classes.toolbar}>
        <MUIMenu className={classes.menuIcon} color="secondary" onClick={toggleDrawer(true)} />
        <MUITypography color="secondary" variant="h1">Cube Level Midnight</MUITypography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <MUISearchIcon />
          </div>
          <MUIInputBase
            placeholder="Search for other users!"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
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
        {NavLinks()}
      </MUIDrawer>
    </MUIAppBar>
  );
}

export default withRouter(Navigation);