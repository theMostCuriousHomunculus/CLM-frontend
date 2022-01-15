import React, { useContext } from 'react';
import MUIAllInclusiveIcon from '@mui/icons-material/AllInclusive';
import MUIArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
// import MUIChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIHomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import MUILogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { makeStyles } from '@mui/styles';
import { useNavigate } from 'react-router-dom';

import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  item: {
    color: '#fff',
    '& span, & svg': {
      fontSize: '1.6rem'
    }
  },
  list: {
    flexGrow: 1,
    width: 300
  }
});

export default function NavigationLinks({ toggleDrawer }) {
  const { isLoggedIn, logout } = useContext(AuthenticationContext);
  const classes = useStyles();
  const navigate = useNavigate();

  const options = [
    {
      icon: <MUIHomeOutlinedIcon />,
      name: 'Home',
      onClick: () => navigate('/')
    },
    {
      icon: <MUIArticleOutlinedIcon />,
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
    }
  ];

  if (isLoggedIn) {
    options.push({
      icon: <MUILogoutOutlinedIcon />,
      name: 'Logout',
      onClick: logout
    });
  }

  return (
    <MUIList
      className={classes.list}
      onClick={toggleDrawer}
      onKeyDown={toggleDrawer}
    >
      {options.map(function (option) {
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
