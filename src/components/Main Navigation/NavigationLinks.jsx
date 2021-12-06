import React from 'react';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAllInclusiveIcon from '@mui/icons-material/AllInclusive';
import MUIChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MUIExitToAppIcon from '@mui/icons-material/ExitToApp';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIHomeIcon from '@mui/icons-material/Home';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  item: {
    color: theme.palette.secondary.main,
    '& span, & svg': {
      fontSize: '1.6rem'
    }
  },
  list: {
    width: 350
  }
});

export default function NavigationLinks({
  setAuthenticateFormDisplayed,
  toggleDrawer
}) {
  const { isLoggedIn, logout, userID } = React.useContext(
    AuthenticationContext
  );
  const classes = useStyles();
  const navigate = useNavigate();

  const loggedInOptions = [
    {
      icon: <MUIHomeIcon />,
      name: 'Home',
      onClick: () => navigate('/')
    },
    {
      icon: <MUIAccountCircleIcon />,
      name: 'My Profile',
      onClick: () => navigate(`/account/${userID}`)
    },
    {
      icon: <MUIChatOutlinedIcon />,
      name: 'Blog',
      onClick: () => navigate('/blog')
    },
    {
      icon: <MUIHelpOutlineIcon />,
      name: "What's Classy?",
      onClick: () => navigate('/classy')
    },
    {
      icon: <MUIAllInclusiveIcon />,
      name: 'Resources',
      onClick: () => navigate('/resources')
    },
    {
      icon: <MUIExitToAppIcon />,
      name: 'Logout',
      onClick: logout
    }
  ];

  const loggedOutOptions = [
    {
      icon: <MUIHomeIcon />,
      name: 'Home',
      onClick: () => navigate('/')
    },
    {
      icon: <MUIChatOutlinedIcon />,
      name: 'Blog',
      onClick: () => navigate('/blog')
    },
    {
      icon: <MUIHelpOutlineIcon />,
      name: "What's Classy?",
      onClick: () => navigate('/classy')
    },
    {
      icon: <MUIAllInclusiveIcon />,
      name: 'Resources',
      onClick: () => navigate('/resources')
    },
    {
      icon: <MUIExitToAppIcon />,
      name: 'Login / Register',
      onClick: () => setAuthenticateFormDisplayed(true)
    }
  ];

  return (
    <MUIList
      className={classes.list}
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {(isLoggedIn ? loggedInOptions : loggedOutOptions).map(function (option) {
        return (
          <MUIListItem button key={option.name} onClick={option.onClick}>
            <MUIListItemIcon className={classes.item}>
              {option.icon}
            </MUIListItemIcon>
            <MUIListItemText className={classes.item} primary={option.name} />
          </MUIListItem>
        );
      })}
    </MUIList>
  );
}
