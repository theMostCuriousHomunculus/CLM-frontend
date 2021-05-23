import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUISearchIcon from '@material-ui/icons/Search';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';
import { fade, makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import { searchAccounts } from '../../requests/GraphQL/account-requests';

const useStyles = makeStyles({
  input: {
    margin: '8px 8px 8px 56px',
    '& input[type=text]': {
      color: '#ffffff',
    },
    '& .MuiInputBase-root': {
      padding: '8px 40px 8px 8px !important'
    }
  },
  search: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    position: 'relative',
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    '& .MuiAutocomplete-root': {
      [theme.breakpoints.down('sm')]: {
        width: 286
      },
      [theme.breakpoints.up('md')]: {
        width: 576
      }
    },
    '& .MuiFormControl-root': {
      marginLeft: 56
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
    width: 640
  }
});

function UserSearchBar (props) {

  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const classes = useStyles();
  const { history } = props;

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
        setLoading(true);
        const matchingUsers = await searchAccounts(event.target.value);
        setUserSearchResults(matchingUsers);
      } catch (error) {
        console.log({ 'Error': error.message });
      } finally {
        setLoading(false);
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
            margin="dense"
            onKeyUp={searchForUsers}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading && <MUICircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
        renderOption={(option) => {
          return (
            <div style={{ alignItems: "center", display: "flex", flexGrow: 1, justifyContent: "space-between" }}>
              <MUIAvatar alt={option.name} src={option.avatar} />
              <MUITypography variant="body1">{option.name}</MUITypography>
            </div>
          );
        }}
      />
    </div>
  );
}

export default UserSearchBar;