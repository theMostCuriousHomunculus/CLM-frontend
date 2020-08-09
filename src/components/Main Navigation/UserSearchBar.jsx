import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUITextField from '@material-ui/core/TextField';
import MUISearchIcon from '@material-ui/icons/Search';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';
import { fade, makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  input: {
    margin: '0.75rem 0.75rem 0.75rem 5.5rem',
    '& input[type=text]': {
      color: '#ffffff',
    }
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
  topBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    },
    width: '42rem'
  }
});

function UserSearchBar (props) {

  const [open, setOpen] = React.useState(false);
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const classes = useStyles();
  const { history } = props;
  const { loading, sendRequest } = useRequest();

  function goToUserProfilePage (user_id, props) {
    history.push(`/account/${user_id}`);
    setUserSearchResults([]);
    if (props === 'side') {
      props.setDrawerOpen(false);
    } else {
      // not a great way to clear the search text; using setTimeout because of asynchronous javascript
      setTimeout(function () {
        document.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
      }, 0);
    }
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
    <div className={(props.orientation === 'side' ? classes.sideBar : classes.topBar) + ' ' + classes.search}>
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
            color="secondary"
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

export default UserSearchBar;