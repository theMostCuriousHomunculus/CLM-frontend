import React, { useContext } from 'react';
import Cookies from 'js-cookie';
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

import logoutSingleDevice from '../../graphql/mutations/account/logout-single-device';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

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
  const { abortControllerRef, isLoggedIn, setLoading, setUserInfo } =
    useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
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
      onClick: async () => {
        try {
          setLoading(true);
          await logoutSingleDevice({ signal: abortControllerRef.current.signal });
          Cookies.remove('authentication_token');
          setUserInfo({
            admin: false,
            avatar: {
              card_faces: [],
              image_uris: null
            },
            measurement_system: 'imperial',
            radius: 10,
            userID: null,
            userName: null
          });
        } catch (error) {
          setErrorMessages((prevState) => [...prevState, error.message]);
        } finally {
          setLoading(false);
        }
      }
    });
  }

  return (
    <MUIList className={classes.list} onClick={toggleDrawer} onKeyDown={toggleDrawer}>
      {options.map(function (option) {
        return (
          <MUIListItem button key={option.name} onClick={option.onClick}>
            <MUIListItemIcon className={classes.item}>{option.icon}</MUIListItemIcon>
            <MUIListItemText className={classes.item} primary={option.name} />
          </MUIListItem>
        );
      })}
    </MUIList>
  );
}
