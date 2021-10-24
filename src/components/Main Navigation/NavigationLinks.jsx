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

import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';

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
  history,
  setAuthenticateFormDisplayed,
  toggleDrawer
}) {
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();

  const loggedInPages = [
    {
      icon: <MUIHomeIcon />,
      name: 'Home',
      onClick: () => history.push('/')
    },
    {
      icon: <MUIAccountCircleIcon />,
      name: 'My Profile',
      onClick: () => history.push(`/account/${authentication.userId}`)
    },
    {
      icon: <MUIChatOutlinedIcon />,
      name: 'Blog',
      onClick: () => history.push('/blog')
    },
    {
      icon: <MUIHelpOutlineIcon />,
      name: "What's Classy?",
      onClick: () => history.push('/classy')
    },
    {
      icon: <MUIAllInclusiveIcon />,
      name: 'Resources',
      onClick: () => history.push('/resources')
    },
    {
      icon: <MUIExitToAppIcon />,
      name: 'Logout',
      onClick: authentication.logout
    }
  ];

  const loggedOutPages = [
    {
      icon: <MUIHomeIcon />,
      name: 'Home',
      onClick: () => history.push('/')
    },
    {
      icon: <MUIChatOutlinedIcon />,
      name: 'Blog',
      onClick: () => history.push('/blog')
    },
    {
      icon: <MUIHelpOutlineIcon />,
      name: "What's Classy?",
      onClick: () => history.push('/classy')
    },
    {
      icon: <MUIAllInclusiveIcon />,
      name: 'Resources',
      onClick: () => history.push('/resources')
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
      {(authentication.isLoggedIn ? loggedInPages : loggedOutPages).map(
        function (page) {
          return (
            <MUIListItem button key={page.name} onClick={page.onClick}>
              <MUIListItemIcon className={classes.item}>
                {page.icon}
              </MUIListItemIcon>
              <MUIListItemText className={classes.item} primary={page.name} />
            </MUIListItem>
          );
        }
      )}
    </MUIList>
  );
}
