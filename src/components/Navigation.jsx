import React from 'react';
import {
  AppBar as MUIAppBar,
  CircularProgress as MUICircularProgress,
  Drawer as MUIDrawer,
  List as MUIList,
  ListItem as MUIListItem,
  ListItemIcon as MUIListItemIcon,
  ListItemText as MUIListItemText,
  TextField as MUITextField,
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
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';

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
    margin: '0.75rem 0.75rem 0.75rem 5.5rem',
    width: '40rem',
    '& input[type=text]': {
      color: '#ffffff',
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
    fontSize: '7.1rem',
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

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const authentication = React.useContext(AuthenticationContext);
  const { history } = props;
  const classes = useStyles();

  const { loading, sendRequest } = useRequest();

  function goToUserProfilePage (user_id) {
    history.push(`/account/${user_id}`);
    setUserSearchResults([]);
    // not a great way to clear the search text; using setTimeout because of asynchronous javascript
    setTimeout(function () {
      document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
    }, 0);
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
    if (event.target.value.length > 2) {
      try {
        const matchingUsers = await sendRequest('http://localhost:5000/api/account?name=' + event.target.value,
          'GET',
          null,
          {}
        );
        setUserSearchResults(matchingUsers);
      } catch (error) {
        console.log({ 'Error': error.message });
      }
    } else {
      setUserSearchResults([]);
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
          <MUIAutocomplete
            clearOnBlur={false}
            clearOnEscape={true}
            getOptionLabel={(option) => option.name}
            getOptionSelected={function (option, value) {
              return option.name === value.name;
            }}
            id="user-search-bar"
            loading={loading}
            onChange={function (event, value, reason) {
              if (reason === 'select-option') {
                goToUserProfilePage(value._id);
              }
            }}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            options={userSearchResults}
            renderInput={(params) => (
              <MUITextField
                {...params}
                className={classes.input}
                label="Search for Other Users!"
                onKeyUp={searchForUsers}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loading ? <MUICircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  )
                }}
              />
            )}
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