import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUISearchIcon from '@material-ui/icons/Search';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';
import { fade, makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import SmallAvatar from '../miscellaneous/SmallAvatar';

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
  option: {
    alignItems: 'flex-end',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'space-between'
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

export default function UserSearchBar ({
  history,
  orientation,
  setDrawerOpen
}) {

  const { loading, sendRequest } = useRequest();
  const [open, setOpen] = React.useState(false);
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const classes = useStyles();

  async function searchAccounts (event) {
    if (event.target.value.length > 2) {
      try {
        const operation = 'searchAccounts';
        const matchingUsers = await sendRequest({
          operation,
          body: {
            query: `
              query {
                searchAccounts(name: "${event.target.value}") {
                  _id
                  avatar
                  name
                }
              }
            `
          }
        })
        setUserSearchResults(matchingUsers);
      } catch (error) {
        
      }
    } else {
      setUserSearchResults([]);
    }
  }

  return (
    <div className={(orientation === 'side' ? classes.sideBar : classes.topBar) + ' ' + classes.search}>
      <div className={classes.searchIcon}>
        <MUISearchIcon />
      </div>
      <MUIAutocomplete
        clearOnBlur={false}
        clearOnEscape={true}
        getOptionLabel={(option) => option.name}
        getOptionSelected={(option, value) => option.name === value.name}
        loading={loading}
        onChange={function (event, value, reason) {
          if (reason === 'select-option') {
            history.push(`/account/${value._id}`);
            setUserSearchResults([]);
            setDrawerOpen(false);
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
            onKeyUp={searchAccounts}
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
            <div className={classes.option}>
              <SmallAvatar alt={option.name} src={option.avatar} />
              <MUITypography variant="body1">{option.name}</MUITypography>
            </div>
          );
        }}
      />
    </div>
  );
};