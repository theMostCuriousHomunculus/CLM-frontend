import React from 'react';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUISearchIcon from '@mui/icons-material/Search';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import Avatar from '../miscellaneous/Avatar';

const useStyles = makeStyles({
  input: {
    margin: '8px 8px 8px 56px',
    '& input[type=text]': {
      color: '#ffffff'
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
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    position: 'relative',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
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

export default function UserSearchBar({ history, orientation, setDrawerOpen }) {
  const { loading, sendRequest } = useRequest();
  // const [open, setOpen] = React.useState(false);
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const classes = useStyles();

  async function searchAccounts(event) {
    if (event.target.value.length > 2) {
      await sendRequest({
        callback: (data) => {
          setUserSearchResults(data);
        },
        load: true,
        operation: 'searchAccounts',
        get body() {
          return {
            query: `
                query {
                  ${this.operation}(name: "${event.target.value}") {
                    _id
                    avatar
                    name
                  }
                }
              `
          };
        }
      });
    } else {
      setUserSearchResults([]);
    }
  }

  return (
    <div
      className={
        (orientation === 'side' ? classes.sideBar : classes.topBar) +
        ' ' +
        classes.search
      }
    >
      <div className={classes.searchIcon}>
        <MUISearchIcon />
      </div>
      <MUIAutocomplete
        clearOnBlur={false}
        clearOnEscape={true}
        getOptionLabel={(option) => option.name}
        loading={loading}
        onChange={function (event, value, reason) {
          if (reason === 'selectOption') {
            history.push(`/account/${value._id}`);
            setUserSearchResults([]);
            setDrawerOpen(false);
          }
        }}
        options={userSearchResults}
        renderInput={(params) => (
          <MUITextField
            {...params}
            className={classes.input}
            color="secondary"
            label="Search for Other Users!"
            onKeyUp={searchAccounts}
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
        renderOption={(props, option) => {
          return (
            <li className={classes.option} {...props}>
              <Avatar alt={option.name} size="small" src={option.avatar} />
              <MUITypography variant="body1">{option.name}</MUITypography>
            </li>
          );
        }}
      />
    </div>
  );
}
