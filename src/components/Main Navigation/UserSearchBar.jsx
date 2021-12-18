import React from 'react';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUISearchIcon from '@mui/icons-material/Search';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router';

import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import Avatar from '../miscellaneous/Avatar';

const useStyles = makeStyles({
  input: {
    margin: 8,
    '& input[type=text]': {
      color: '#ffffff'
    },
    minWidth: 300,
    width: 'calc(100% - 16px)'
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
    }
  },
  sideBar: {
    [theme.breakpoints.up('md')]: {
      display: 'none'
    }
  },
  topBar: {
    [theme.breakpoints.down('md')]: {
      display: 'none'
    },
    flexGrow: 1
  }
});

export default function UserSearchBar({ orientation, setDrawerOpen }) {
  const { loading, sendRequest } = useRequest();
  const [userSearchResults, setUserSearchResults] = React.useState([]);
  const classes = useStyles();
  const navigate = useNavigate();

  async function searchAccounts(event) {
    if (event.target.value.length > 2) {
      await sendRequest({
        callback: setUserSearchResults,
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
    <MUIAutocomplete
      className={`${
        orientation === 'side' ? classes.sideBar : classes.topBar
      } ${classes.search}`}
      clearOnBlur={false}
      clearOnEscape={true}
      getOptionLabel={(option) => option.name}
      loading={loading}
      onChange={function (event, value, reason) {
        if (reason === 'selectOption') {
          navigate(`/account/${value._id}`);
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
            ),
            startAdornment: <MUISearchIcon style={{ color: 'white' }} />
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
  );
}
