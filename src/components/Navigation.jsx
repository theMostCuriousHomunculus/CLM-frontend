import React, { useState } from 'react';
import {
  AppBar as MUIAppBar,
  Drawer as MUIDrawer,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemIcon as MUIListItemIcon,
  ListItemText as MUIListItemText,
  Toolbar as MUIToolbar,
  Typography as MUITypography
} from '@material-ui/core';
import { 
  AccountCircle as MUIAccountCircle,
  AllInclusive as MUIAllInclusive,
  ExitToApp as MUIExitToApp,
  Home as MUIHome,
  Menu as MUIMenu,
  Search as MUISearchIcon
} from '@material-ui/icons';
import { fade, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import theme from '../theme';

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  drawer: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.primary.main
    }
  },
  headline: {
    flexGrow: 1
  },
  input: {
    backgroundColor: 'inherit',
    border: 'none',
    color: 'inherit',
    fontFamily: 'Ubuntu, Roboto, Arial, sans-serif',
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '30ch',
      '&:focus': {
        width: '40ch',
      },
    },
    '&:focus': {
      outline: 'none'
    }
  },
  item: {
    color: theme.palette.secondary.main,
    '& span, & svg': {
      fontSize: '3rem'
    }
  },
  list: {
    width: 350
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
    width: '100%',
    [theme.breakpoints.up('sm')]: {
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

function Navigation (props) {

  const [userSearchResults, setUserSearchResults] = useState([]);
  const authentication = React.useContext(AuthenticationContext);
  const { history } = props;
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  function goToUserProfilePage (event) {
    const chosenOption = document.getElementById('user-search-results').options.namedItem(event.target.value);
    if (chosenOption) {
      history.push('/account/' + chosenOption.getAttribute('data-id'));
      event.target.value = '';
    }
  }

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
        icon: <MUIAllInclusive />,
        name: "Resources",
        onClick: () => history.push('/resources')
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
        icon: <MUIAllInclusive />,
        name: "Resources",
        onClick: () => history.push('/resources')
      },
      {
        icon: <MUIExitToApp />,
        name: "Login / Register",
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

  async function searchForUsers (event) {
    try {
      const matchingUsers = await sendRequest('http://localhost:5000/api/account?name=' + event.target.value,
        'GET',
        null,
        {}
      );
      setUserSearchResults(matchingUsers.map(function (match, index) {
        return (
          <option data-id={match._id} key={index} name={match.name} value={match.name}>
            {match.name}
          </option>
        );
      }));
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <MUIAppBar position="static">
      <MUIToolbar className={classes.toolbar}>
        <MUIMenu className={classes.menuIcon} color="secondary" onClick={toggleDrawer(true)} />
        <MUITypography className={classes.headline} color="secondary" variant="h1">Cube Level Midnight</MUITypography>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <MUISearchIcon />
          </div>
          <input
            className={classes.input}
            id="user-search-bar"
            list="user-search-results"
            onChange={goToUserProfilePage}
            onKeyUp={searchForUsers}
            placeholder="Search for other users!"
            type="text"
          />
          <datalist id="user-search-results">
            {userSearchResults}
          </datalist>
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