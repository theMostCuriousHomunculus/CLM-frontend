import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

import urlBase64ToUint8Array from '../functions/url-base64-to-uint8-array';
import useRequest from '../hooks/request-hook';
import { AuthenticationContext } from './Authentication';
import { ErrorContext } from './Error';

export const PermissionsContext = createContext({
  cameraEnabled: false,
  cameraSupported: false,
  clearAndDeleteLocation: () => {
    // don't return anything
  },
  deferredPrompt: null,
  finding: false,
  geolocationEnabled: false,
  geolocationSupported: false,
  location: {
    latitude: undefined,
    longitude: undefined
  },
  microphoneEnabled: false,
  microphoneSupported: false,
  notificationsEnabled: false,
  notificationsSupported: false,
  setCameraEnabled: () => {
    // don't return anything
  },
  setDeferredPrompt: () => {
    // don't return anything
  },
  setMicrophoneEnabled: () => {
    // don't return anything
  },
  turnOnNotificationsAndSubscribeToPushMessaging: () => {
    // don't return anything
  },
  unsubscribeFromPushSubscription: () => {
    // don't return anything
  },
  watchAndPostLocation: () => {
    // don't return anything
  }
});

export function PermissionsProvider({ children }) {
  const { sendRequest } = useRequest();
  const { isLoggedIn, userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const locationWatchID = useRef(null);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraPermission, setCameraPermission] = useState();
  const [cameraSupported, setCameraSupported] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState();
  const [finding, setFinding] = useState();
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [geolocationPermission, setGeolocationPermission] = useState();
  const geolocationSupported = 'geolocation' in navigator;
  const [location, setLocation] = useState({
    latitude: undefined,
    longitude: undefined
  });
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState();
  const [microphoneSupported, setMicrophoneSupported] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [notificationsPermission, setNotificationsPermission] = useState();
  const notificationsSupported = 'Notification' in window && 'serviceWorker' in navigator;

  async function turnOnNotificationsAndSubscribeToPushMessaging() {
    if (isLoggedIn) {
      if (notificationsSupported) {
        const deniedMessage =
          'You have blocked Cube Level Midnight from sending you notifications in your browser/device settings.  If you wish to receive notifications from us, you will need to grant Cube Level Midnight notifications permission in your browser/device settings, then notifications can be enabled from within the Cube Level Midnight application.';

        async function proceed() {
          setNotificationsEnabled(true);

          const swreg = await navigator.serviceWorker.ready;
          const existingSubscription = await swreg.pushManager.getSubscription();
          if (!existingSubscription) {
            const newSubscription = await swreg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(process.env.REACT_APP_VAPID_PUBLIC_KEY),
              userID
            });
            const parsedNewSubscription = JSON.parse(JSON.stringify(newSubscription));
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

        switch (notificationsPermission) {
          case 'denied':
            setErrorMessages((prevState) => [...prevState, deniedMessage]);
            break;
          case 'granted':
            proceed();
            break;
          default:
            // 'default' or 'prompt'
            const decision = await Notification.requestPermission();
            switch (decision) {
              case 'denied':
                setErrorMessages((prevState) => [...prevState, deniedMessage]);
                break;
              case 'granted':
                proceed();
                break;
              default:
              // user closed the browser/device prompt without making a decision
            }
            setNotificationsPermission(decision);
        }
      } else {
        setErrorMessages((prevState) => [
          ...prevState,
          'Notifications are not supported by your cave man browser and/or device.'
        ]);
      }
    } else {
      setErrorMessages((prevState) => [
        ...prevState,
        'You must log in to subscribe to notifications.'
      ]);
    }
  }

  async function unsubscribeFromPushSubscription() {
    if (notificationsSupported) {
      const swreg = await navigator.serviceWorker.ready;
      const existingSubscription = await swreg.pushManager.getSubscription();
      if (existingSubscription) {
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
        try {
          await existingSubscription.unsubscribe();
          setNotificationsEnabled(false);
        } catch (error) {
          setErrorMessages((prevState) => [...prevState, error.message]);
        }
      }
    }
  }

  function clearAndDeleteLocation() {
    if (geolocationSupported) {
      navigator.geolocation.clearWatch(locationWatchID.current);
      setGeolocationEnabled(false);
      setLocation({
        latitude: undefined,
        longitude: undefined
      });
      if (isLoggedIn) {
        sendRequest({
          operation: 'deleteLocation',
          get body() {
            return {
              query: `
              mutation {
                ${this.operation} {
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

  function watchAndPostLocation() {
    if (isLoggedIn) {
      if (geolocationSupported) {
        const deniedMessage =
          'You have blocked Cube Level Midnight from accessing your location in your browser/device settings.  If you wish to utilize our location based services, you will need to grant Cube Level Midnight location permission in your browser/device settings, then location services can be enabled from within the Cube Level Midnight application.';

        function proceed() {
          const failureCallback = (error) => {
            setFinding(false);
            if (error.code === 1) {
              setGeolocationPermission('denied');
              setErrorMessages((prevState) => [...prevState, deniedMessage]);
            } else {
              setErrorMessages((prevState) => [
                ...prevState,
                `Unable to retrieve your location: ${error.message}`
              ]);
            }
          };

          const successCallback = (position) => {
            setGeolocationPermission('granted');
            setGeolocationEnabled(true);
            setFinding(false);
            const { latitude, longitude } = position.coords;
            setLocation({
              latitude,
              longitude
            });
            sendRequest({
              operation: 'postLocation',
              get body() {
                return {
                  query: `
                    mutation {
                      ${this.operation}(
                        latitude: ${latitude},
                        longitude: ${longitude}
                      ) {
                        _id
                      }
                    }
                  `
                };
              }
            });
          };

          setFinding(true);
          locationWatchID.current = navigator.geolocation.watchPosition(
            successCallback,
            failureCallback,
            { enableHighAccuracy: true }
          );
        }

        switch (geolocationPermission) {
          case 'denied':
            setErrorMessages((prevState) => [...prevState, deniedMessage]);
            break;
          default:
            proceed();
        }
      } else {
        setErrorMessages((prevState) => [
          ...prevState,
          'Geolocation is not supported by your cave man browser and/or device.'
        ]);
      }
    } else {
      setErrorMessages((prevState) => [
        ...prevState,
        'You must log in to enable location services.'
      ]);
    }
  }

  // rather than have the browser prompt the user to download the app, store the prompt
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

  // geolocation must be re-enabled each time the user refreshes the application, however, the whole point of notifications is that they run in the background, so a user that never logged out (which unsubscribes from the push subscription), but perhaps closed the browser / tab that was running CLM will still have a subscription thanks to the service worker.  we need to check for this when the application is started so we display the UI correctly
  useEffect(() => {
    (async function () {
      if (notificationsSupported) {
        const swreg = await navigator.serviceWorker.ready;
        const existingSubscription = await swreg.pushManager.getSubscription();
        if (Notification.permission === 'granted' && existingSubscription) {
          setNotificationsEnabled(true);
        } else {
          setNotificationsEnabled(false);
        }
      }
    })();
  }, [isLoggedIn, Notification.permission, navigator.serviceWorker]);

  // when the app closes, the user logs in/out or the geolocationPermission changes, clear the watch
  useEffect(() => {
    return clearAndDeleteLocation;
  }, [isLoggedIn, geolocationPermission]);

  useEffect(() => {
    (async function () {
      const G = await navigator.permissions.query({ name: 'geolocation' });
      setGeolocationPermission(G.state);
      const N = await navigator.permissions.query({ name: 'notifications' });
      setNotificationsPermission(N.state);

      const devices = navigator.mediaDevices && (await navigator.mediaDevices.enumerateDevices());

      if (
        devices.some((device) => device.kind === 'videoinput') &&
        navigator.permissions &&
        'camera' in navigator.permissions
      ) {
        setCameraSupported(true);
        const C = await navigator.permissions.query({ name: 'camera' });
        setCameraPermission(C.state);
      }

      if (
        devices.some((device) => device.kind === 'audioinput') &&
        navigator.permissions &&
        'microphone' in navigator.permissions
      ) {
        setMicrophoneSupported(true);
        const M = await navigator.permissions.query({ name: 'microphone' });
        setMicrophonePermission(M.state);
      }
    })();
  }, []);

  return (
    <PermissionsContext.Provider
      value={{
        cameraEnabled,
        cameraSupported,
        clearAndDeleteLocation,
        deferredPrompt,
        finding,
        geolocationEnabled,
        geolocationSupported,
        location,
        microphoneEnabled,
        microphoneSupported,
        notificationsEnabled,
        notificationsSupported,
        setCameraEnabled,
        setDeferredPrompt,
        setMicrophoneEnabled,
        turnOnNotificationsAndSubscribeToPushMessaging,
        unsubscribeFromPushSubscription,
        watchAndPostLocation
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}
