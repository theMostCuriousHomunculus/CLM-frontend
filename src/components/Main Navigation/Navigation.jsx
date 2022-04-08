import React, { useContext, useState } from 'react';
import Cookies from 'js-cookie';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAppBar from '@mui/material/AppBar';
import MUIBadge from '@mui/material/Badge';
import MUIButton from '@mui/material/Button';
import MUIChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import MUIDownloadIcon from '@mui/icons-material/Download';
import MUIDrawer from '@mui/material/Drawer';
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
import NavigationLinks from './NavigationLinks';
import SiteSearchBar from './SiteSearchBar';
import createConversationMessage from '../../graphql/mutations/conversation/create-conversation-message';
import logoutSingleDevice from '../../graphql/mutations/account/logout-single-device';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';
import { PermissionsContext } from '../../contexts/Permissions';

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
  drawer: {
    '& .MuiPaper-root': {
      background: `linear-gradient(to bottom, ${theme.palette.primary.main}, calc(2/3 * 100%), ${theme.palette.secondary.main})`,
      margin: 0
    }
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
    buds,
    conversations,
    isLoggedIn,
    setLoading,
    setUserInfo,
    userID,
    userName
  } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const { deferredPrompt, setDeferredPrompt } = useContext(PermissionsContext);
  const searchBarLocation = useMediaQuery(theme.breakpoints.up('md')) ? 'top' : 'side';
  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] = useState(false);
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const classes = useStyles();

  function toggleDrawer(event) {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setMenuDrawerOpen((prevState) => !prevState);
  }

  return (
    <React.Fragment>
      <AuthenticateForm
        open={authenticateFormDisplayed}
        toggleOpen={() => setAuthenticateFormDisplayed(false)}
      />
      <MUIAppBar className={classes.appBar} id="app-bar" position="static">
        <MUIToolbar className={classes.toolbar}>
          <div className={classes.leftContainer}>
            <MUIMenuIcon
              className={classes.menuIcon}
              color="secondary"
              onClick={() => setMenuDrawerOpen(true)}
            />
            <MUITypography color="inherit" variant="h1">
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.rightContainer}>
            {searchBarLocation === 'top' && (
              <SiteSearchBar setMenuDrawerOpen={setMenuDrawerOpen} color="primary" />
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

        <MUIDrawer
          anchor="left"
          className={classes.drawer}
          id="side-navigation"
          onClose={() => setMenuDrawerOpen(false)}
          open={menuDrawerOpen}
        >
          {searchBarLocation === 'side' && (
            <SiteSearchBar setMenuDrawerOpen={setMenuDrawerOpen} color="secondary" />
          )}
          <NavigationLinks toggleDrawer={toggleDrawer} />
          {deferredPrompt && (
            <MUIButton
              fullWidth
              onClick={async () => {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setDeferredPrompt(null);
                setMenuDrawerOpen(false);
              }}
              startIcon={<MUIDownloadIcon />}
            >
              Install the App!
            </MUIButton>
          )}
        </MUIDrawer>

        <MUIDrawer
          anchor="right"
          className={classes.drawer}
          id="side-navigation"
          onClose={() => setChatDrawerOpen(false)}
          open={chatDrawerOpen}
        >
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 8,
              // maxHeight: 158,
              maxWidth: 267,
              overflowY: 'auto'
            }}
          >
            {buds.map((bud) => (
              <Avatar
                key={bud._id}
                // onClick={async () => {
                //   const response = await createConversationMessage({
                //     queryString: `{\n_id\n}`,
                //     signal: abortControllerRef.current.signal,
                //     variables: {
                //       body: `What's up, turd?`,
                //       participants: [userID, bud._id]
                //     }
                //   });
                // }}
                profile={{ avatar: bud.avatar, name: bud.name }}
                size="medium"
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          {conversations.length > 0 ? (
            <React.Fragment>
              {conversations.map((conversation) => (
                <div key={conversation._id}>
                  <MUITypography color="white" variant="h3">
                    {conversation.participants.map((participant) => participant.name).join()}
                  </MUITypography>
                  <MUITypography color="white" variant="body1">
                    {conversation.messages[conversation.messages.length - 1].body}
                  </MUITypography>
                </div>
              ))}
            </React.Fragment>
          ) : (
            <MUITypography color="white" variant="body1">
              No Conversations Yet...
            </MUITypography>
          )}
        </MUIDrawer>
      </MUIAppBar>
    </React.Fragment>
  );
}
