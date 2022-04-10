import React, { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAppBar from '@mui/material/AppBar';
import MUIBadge from '@mui/material/Badge';
import MUIChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MUIIconButton from '@mui/material/IconButton';
import MUIToolbar from '@mui/material/Toolbar';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUILogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import MUIMenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import AuthenticateForm from './AuthenticateForm';
import Avatar from '../miscellaneous/Avatar';
import ChatDialog from './ChatDialog';
import ChatDrawer from './ChatDrawer';
import NavigationDrawer from './NavigationDrawer';
import SiteSearchBar from './SiteSearchBar';
import logoutSingleDevice from '../../graphql/mutations/account/logout-single-device';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

const useStyles = makeStyles({
  appBar: {
    background: `linear-gradient(to right, ${theme.palette.primary.main}, calc(2/3 * 100%), ${theme.palette.secondary.main})`
  },
  badge: {
    '& > .MuiBadge-badge': {
      border: '2px solid white',
      borderRadius: '100%',
      color: 'white',
      cursor: 'pointer',
      height: 38,
      padding: 8,
      width: 38
    }
  },
  badgeIcon: {
    height: 26,
    width: 26
  },
  leftContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 2
  },
  menuIcon: {
    border: '4px solid',
    borderRadius: 4,
    color: '#fff',
    cursor: 'pointer',
    fontSize: '3rem',
    marginRight: 8
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8
  },
  rightContainer: {
    alignItems: 'center',
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end'
  }
});

export default function Navigation() {
  const {
    abortControllerRef,
    avatar,
    conversations,
    isLoggedIn,
    setLoading,
    setUserInfo,
    userID,
    userName
  } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const searchBarLocation = useMediaQuery(theme.breakpoints.up('md')) ? 'top' : 'side';
  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [navigationDrawerOpen, setNavigationDrawerOpen] = useState(false);
  const [newConversationParticipants, setNewConversationParticipants] = useState();
  const [selectedConversationID, setSelectedConversationID] = useState();
  const classes = useStyles();

  return (
    <React.Fragment>
      <AuthenticateForm
        open={authenticateFormDisplayed}
        toggleOpen={() => setAuthenticateFormDisplayed(false)}
      />

      <ChatDialog
        close={() => {
          setNewConversationParticipants(null);
          setSelectedConversationID(null);
        }}
        conversation={
          newConversationParticipants
            ? { messages: [], participants: newConversationParticipants }
            : conversations?.find((conversation) => conversation._id === selectedConversationID)
        }
        open={!!selectedConversationID || !!newConversationParticipants}
        setNewConversationParticipants={setNewConversationParticipants}
        setSelectedConversationID={setSelectedConversationID}
      />

      <MUIAppBar className={classes.appBar} id="app-bar" position="static">
        <MUIToolbar className={classes.toolbar}>
          <div className={classes.leftContainer}>
            <MUIMenuIcon
              className={classes.menuIcon}
              color="secondary"
              onClick={() => setNavigationDrawerOpen(true)}
            />
            <MUITypography color="inherit" variant="h1">
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.rightContainer}>
            {searchBarLocation === 'top' && (
              <SiteSearchBar setNavigationDrawerOpen={setNavigationDrawerOpen} color="primary" />
            )}
            {isLoggedIn ? (
              <div style={{ padding: 8 }}>
                <MUIBadge
                  anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom'
                  }}
                  badgeContent={<MUIChatOutlinedIcon className={classes.badgeIcon} />}
                  className={classes.badge}
                  color="primary"
                  onClick={(event) => {
                    if (event.target.closest('span').classList.contains('MuiBadge-colorPrimary')) {
                      setChatDrawerOpen(true);
                    }
                  }}
                  overlap="circular"
                >
                  <MUIBadge
                    anchorOrigin={{
                      horizontal: 'right',
                      vertical: 'top'
                    }}
                    badgeContent={<MUILogoutOutlinedIcon className={classes.badgeIcon} />}
                    className={classes.badge}
                    color="secondary"
                    onClick={async (event) => {
                      event.persist();
                      if (
                        event.target.closest('span').classList.contains('MuiBadge-colorSecondary')
                      ) {
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
                    }}
                    overlap="circular"
                  >
                    <Link
                      to={`/account/${userID}`}
                      style={{
                        border: '2px solid white',
                        borderRadius: '100%',
                        margin: 8
                      }}
                    >
                      <Avatar profile={{ avatar, name: userName }} size="medium" />
                    </Link>
                  </MUIBadge>
                </MUIBadge>
              </div>
            ) : (
              <MUITooltip title="Login / Register">
                <MUIIconButton
                  color="inherit"
                  onClick={() => setAuthenticateFormDisplayed(true)}
                  size="large"
                >
                  <MUIAccountCircleIcon fontSize="large" />
                </MUIIconButton>
              </MUITooltip>
            )}
          </div>
        </MUIToolbar>

        <NavigationDrawer
          navigationDrawerOpen={navigationDrawerOpen}
          setNavigationDrawerOpen={setNavigationDrawerOpen}
        />

        <ChatDrawer
          chatDrawerOpen={chatDrawerOpen}
          setChatDrawerOpen={setChatDrawerOpen}
          setNewConversationParticipants={setNewConversationParticipants}
          setSelectedConversationID={setSelectedConversationID}
        />
      </MUIAppBar>
    </React.Fragment>
  );
}
