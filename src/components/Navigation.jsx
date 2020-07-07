import React from 'react';
import MUIAppBar from '@material-ui/core/AppBar';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIDrawer from '@material-ui/core/Drawer';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemIcon from '@material-ui/core/ListItemIcon';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUITextField from '@material-ui/core/TextField';
import MUIToolbar from '@material-ui/core/Toolbar';
import MUITypography from '@material-ui/core/Typography';
import MUIAccountCircleIcon from '@material-ui/icons/AccountCircle';
import MUIAllInclusiveIcon from '@material-ui/icons/AllInclusive';
import MUIExitToAppIcon from '@material-ui/icons/ExitToApp';
import MUIHomeIcon from '@material-ui/icons/Home';
import MUIMenuIcon from '@material-ui/icons/Menu';
import MUISearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { withRouter } from 'react-router-dom';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import theme from '../theme';

const useStyles = makeStyles({
  appBar: {
    // background: `linear-gradient(${theme.palette.primary.light}, ${theme.palette.primary.dark})`
    background: `radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
  },
  drawer: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.primary.main
    }
  },
  headlineContainer: {
    textAlign: 'left'
  },
  input: {
    margin: '0.75rem 0.75rem 0.75rem 5.5rem',
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
    '& .MuiAutocomplete-root': {
      [theme.breakpoints.down('sm')]: {
        width: 275
      },
      [theme.breakpoints.up('md')]: {
        width: '36rem'
      }
    }
  },
  searchIcon: {
    alignItems: 'center',
    color: '#ffffff',
    display: 'flex',
    height: '100%',
    justifyContent: 'center',
    padding: theme.spacing(0, 2),
    pointerEvents: 'none',
    position: 'absolute'
  },
  sideBar: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    },
    width: 350
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '1rem'
  },
  topBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    width: '42rem'
  },
  topBarContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
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

  function goToUserProfilePage (user_id, props) {
    history.push(`/account/${user_id}`);
    setUserSearchResults([]);
    if (props === 'side') {
      setDrawerOpen(false);
    } else {
      // not a great way to clear the search text; using setTimeout because of asynchronous javascript
      setTimeout(function () {
        document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
      }, 0);
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
        icon: <MUIHomeIcon />,
        name: "Home",
        onClick: () => history.push('/')
      },
      {
        icon: <MUIAccountCircleIcon />,
        name: "My Profile",
        onClick: () => history.push('/account/' + authentication.userId)
      },
      {
        icon: <MUIAllInclusiveIcon />,
        name: "Resources",
        onClick: () => history.push('/resources')
      },
      {
        icon: <MUIExitToAppIcon />,
        name: "Logout",
        onClick: authentication.logout
      }
    ];

    const loggedOutPages = [
      {
        icon: <MUIHomeIcon />,
        name: "Home",
        onClick: () => history.push('/')
      },
      {
        icon: <MUIAllInclusiveIcon />,
        name: "Resources",
        onClick: () => history.push('/resources')
      },
      {
        icon: <MUIExitToAppIcon />,
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

  function UserSearchBar (props) {
    return (
      <div className={(props === 'side' ? classes.sideBar : classes.topBar) + ' ' + classes.search}>
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
          loading={loading}
          onChange={function (event, value, reason) {
            if (reason === 'select-option') {
              goToUserProfilePage(value._id, props);
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
    );
  }

  async function searchForUsers (event) {
    if (event.target.value.length > 2) {
      try {
        const matchingUsers = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account?name=${event.target.value}`,
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
    <MUIAppBar className={classes.appBar} position="static">
      <MUIToolbar className={classes.toolbar}>
        <MUIMenuIcon className={classes.menuIcon} color="secondary" onClick={toggleDrawer(true)} />
        <div className={classes.headlineContainer}>
          <MUITypography color="secondary" variant="h1">Cube Level Midnight</MUITypography>
        </div>
        <div className={classes.topBarContainer}>
          {UserSearchBar('top')}
        </div>
      </MUIToolbar>
      <MUIDrawer
        anchor="left"
        className={classes.drawer}
        id="side-navigation"
        onClose={toggleDrawer(false)}
        open={drawerOpen}
      >
        {UserSearchBar('side')}
        {NavLinks()}
      </MUIDrawer>
    </MUIAppBar>
  );
}

export default withRouter(Navigation);