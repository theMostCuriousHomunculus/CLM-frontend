import React, { useCallback, useContext, useEffect, useState } from 'react';
import MUIAccountCircleIcon from '@mui/icons-material/AccountCircle';
import MUIAppBar from '@mui/material/AppBar';
import MUIButton from '@mui/material/Button';
import MUIDownloadIcon from '@mui/icons-material/Download';
import MUIDrawer from '@mui/material/Drawer';
import MUIIconButton from '@mui/material/IconButton';
import MUINotificationsIcon from '@mui/icons-material/Notifications';
import MUINotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import MUIToolbar from '@mui/material/Toolbar';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUIMenuIcon from '@mui/icons-material/Menu';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import AuthenticateForm from './AuthenticateForm';
import Avatar from '../miscellaneous/Avatar';
import NavigationLinks from './NavigationLinks';
import SiteSearchBar from './SiteSearchBar';
import theme from '../../theme';
import useRequest from '../../hooks/request-hook';
import urlBase64ToUint8Array from '../../functions/url-base64-to-uint8-array';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

const useStyles = makeStyles({
  appBar: {
    background: `linear-gradient(to right, ${theme.palette.primary.main}, calc(2/3 * 100%), ${theme.palette.secondary.main})`
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
  const { isLoggedIn, avatar, userID, userName } = useContext(
    AuthenticationContext
  );
  const { setErrorMessages } = useContext(ErrorContext);
  const { sendRequest } = useRequest();
  const searchBarLocation = useMediaQuery(theme.breakpoints.up('md'))
    ? 'top'
    : 'side';
  const [authenticateFormDisplayed, setAuthenticateFormDisplayed] =
    useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const classes = useStyles();

  function toggleDrawer(event) {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen((prevState) => !prevState);
  }

  async function turnOnNotificationsAndSubscribeToPushMessaging() {
    setDrawerOpen(false);
    const decision = await Notification.requestPermission();
    if (decision === 'granted') {
      setNotificationsEnabled(true);

      const swreg = await navigator.serviceWorker.ready;
      const existingSubscription = await swreg.pushManager.getSubscription();
      if (!existingSubscription) {
        const newSubscription = await swreg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            process.env.REACT_APP_VAPID_PUBLIC_KEY
          ),
          userID
        });
        const parsedNewSubscription = JSON.parse(
          JSON.stringify(newSubscription)
        );
        sendRequest({
          operation: 'subscribeToPush',
          get body() {
            return {
              query: `
                mutation {
                  ${this.operation}(
                    push_subscription: {
                      endpoint: "${parsedNewSubscription.endpoint}",
                      keys: {
                        auth: "${parsedNewSubscription.keys.auth}",
                        p256dh: "${parsedNewSubscription.keys.p256dh}"
                      }
                    }
                  ) {
                    _id
                  }
                }
              `
            };
          }
        });
      }
    }
  }

  async function unsubscribeFromPushSubscription() {
    const swreg = await navigator.serviceWorker.ready;
    const existingSubscription = await swreg.pushManager.getSubscription();
    if (existingSubscription) {
      try {
        await sendRequest({
          operation: 'unsubscribeFromPush',
          get body() {
            return {
              query: `
                mutation {
                  ${this.operation}(
                    endpoint: "${existingSubscription.endpoint}"
                  ) {
                    _id
                  }
                }
              `
            };
          }
        });
        await existingSubscription.unsubscribe();
        setNotificationsEnabled(false);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    }
  }

  useEffect(() => {
    const storePrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
    };

    const nullifyPrompt = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', storePrompt);
    window.addEventListener('appinstalled', nullifyPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', storePrompt);
      window.removeEventListener('appinstalled', nullifyPrompt);
    };
  }, []);

  useEffect(() => {
    (async function () {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        setNotificationsSupported(true);
        const swreg = await navigator.serviceWorker.ready;
        const existingSubscription = await swreg.pushManager.getSubscription();
        if (Notification.permission === 'granted' && existingSubscription) {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
        }
      } else {
        setNotificationsSupported(false);
      }
    })();
  }, [Notification, navigator.serviceWorker]);

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
              onClick={() => setDrawerOpen(true)}
            />
            <MUITypography color="inherit" variant="h1">
              Cube Level Midnight
            </MUITypography>
          </div>
          <div className={classes.rightContainer}>
            {searchBarLocation === 'top' && (
              <SiteSearchBar setDrawerOpen={setDrawerOpen} color="primary" />
            )}
            {isLoggedIn ? (
              <Link to={`/account/${userID}`} style={{ marginLeft: 8 }}>
                <Avatar alt={userName} size="small" src={avatar} />
              </Link>
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
          onClose={() => setDrawerOpen(false)}
          open={drawerOpen}
        >
          {searchBarLocation === 'side' && (
            <SiteSearchBar setDrawerOpen={setDrawerOpen} color="secondary" />
          )}
          <NavigationLinks toggleDrawer={toggleDrawer} />
          {notificationsSupported && !notificationsEnabled && isLoggedIn && (
            <MUIButton
              fullWidth
              onClick={turnOnNotificationsAndSubscribeToPushMessaging}
              startIcon={<MUINotificationsIcon />}
              style={{
                marginBottom: 8
              }}
            >
              Enable Notifications
            </MUIButton>
          )}
          {notificationsSupported && notificationsEnabled && isLoggedIn && (
            <MUIButton
              fullWidth
              onClick={unsubscribeFromPushSubscription}
              startIcon={<MUINotificationsOffIcon />}
              style={{
                marginBottom: 8
              }}
            >
              Disable Notifications
            </MUIButton>
          )}
          {deferredPrompt && (
            <MUIButton
              fullWidth
              onClick={async () => {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                setDeferredPrompt(null);
                setDrawerOpen(false);
              }}
              startIcon={<MUIDownloadIcon />}
            >
              Install the App!
            </MUIButton>
          )}
        </MUIDrawer>
      </MUIAppBar>
    </React.Fragment>
  );
}
