import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import Cookies from 'js-cookie';

import useRequest from '../hooks/request-hook';
import { ErrorContext } from './Error';

const unauthenticatedUserInfo = {
  admin: false,
  avatar: null,
  settings: {
    location_services: false,
    measurement_system: 'imperial',
    radius: 10
  },
  token: null,
  userID: null,
  userName: null
};

export const AuthenticationContext = createContext({
  ...unauthenticatedUserInfo,
  hideLocation: () => null,
  // a convenience field; just makes code a bit easier to reason about
  isLoggedIn: false,
  loading: false,
  login: () => null,
  logout: () => null,
  register: () => null,
  requestPasswordReset: () => null,
  setUserInfo: () => null,
  shareLocation: () => null,
  submitPasswordReset: () => null
});

export function AuthenticationProvider({ children }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const { loading, sendRequest } = useRequest();
  const [geolocationID, setGeolocationID] = useState(null);
  const [userInfo, setUserInfo] = useState({
    ...unauthenticatedUserInfo
  });
  const authenticationQuery = `
    _id
    admin
    avatar
    name
    settings {
      location_services
      measurement_system
      radius
    }
    token
  `;

  const storeUserInfo = useCallback(function ({
    _id,
    admin,
    avatar,
    name,
    settings,
    token
  }) {
    // store in running application
    setUserInfo({
      admin,
      avatar,
      settings,
      token,
      userID: _id,
      userName: name
    });

    // store in browser
    Cookies.set('authentication_token', token);
  },
  []);

  const authenticate = useCallback(
    async function () {
      await sendRequest({
        callback: storeUserInfo,
        headers: {
          Authorization: `Bearer ${Cookies.get('authentication_token')}`
        },
        load: true,
        operation: 'authenticate',
        get body() {
          return {
            query: `
              query {
                ${this.operation} {
                  ${authenticationQuery}
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  const login = useCallback(
    async function (email, password) {
      await sendRequest({
        callback: storeUserInfo,
        load: true,
        operation: 'login',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  email: "${email}",
                  password: "${password}"
                ) {
                  ${authenticationQuery}
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  const logout = useCallback(() => {
    // clear from server
    sendRequest({
      operation: 'logoutAllDevices',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}
            }
          `
        };
      }
    });

    // if the logged in user had a push subscription, unsubscribe from it
    (async function () {
      if ('Notification' in window && 'serviceWorker' in navigator) {
        const swreg = await navigator.serviceWorker.ready;
        const existingSubscription = await swreg.pushManager.getSubscription();
        if (existingSubscription) {
          try {
            // TODO: send request to backend to remove subscription from user's push_subscribed_devices array
            await existingSubscription.unsubscribe();
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          }
        }
      }
    })();

    // stop watching user's location
    if (geolocationID) {
      navigator.geolocation.clearWatch(geolocationID);
    }

    // clear from running application
    setGeolocationID(null);
    setUserInfo({
      ...unauthenticatedUserInfo
    });

    // clear from browser
    Cookies.remove('authentication_token');
  }, [sendRequest]);

  const register = useCallback(
    async function (email, name, password) {
      const avatar = {
        prints_search_uri: null,
        printings: []
      };

      await sendRequest({
        callback: (data) => {
          avatar.prints_search_uri = data.prints_search_uri;
        },
        load: true,
        method: 'GET',
        url: 'https://api.scryfall.com/cards/random'
      });

      await sendRequest({
        callback: (data) => {
          avatar.printings = data.data;
        },
        load: true,
        method: 'GET',
        url: avatar.prints_search_uri
      });

      const randomIndex = Math.floor(Math.random() * avatar.printings.length);

      await sendRequest({
        callback: storeUserInfo,
        load: true,
        operation: 'register',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  avatar: "${avatar.printings[randomIndex].image_uris.art_crop}",
                  email: "${email}",
                  name: "${name}",
                  password: "${password}"
                ) {
                  ${authenticationQuery}
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  const requestPasswordReset = useCallback(
    async function (email) {
      await sendRequest({
        callback: () => {
          setErrorMessages((prevState) => {
            return [
              ...prevState,
              'A link to reset your password has been sent.  Please check your email inbox and your spam folder.'
            ];
          });
        },
        load: true,
        operation: 'requestPasswordReset',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(email: "${email}")
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  // this is the function that is called to send the user's location to the backend
  const postLocation = useCallback(
    async function (latitude, longitude) {
      await sendRequest({
        callback: (data) => {
          setUserInfo((prevState) => ({
            ...prevState,
            settings: {
              ...prevState.settings,
              location_services: data.settings.location_services
            }
          }));
        },
        headers: {
          Authorization: `Bearer ${Cookies.get('authentication_token')}`
        },
        operation: 'postLocation',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  latitude: ${latitude},
                  longitude: ${longitude}
                ) {
                  settings {
                    location_services
                  }
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  // this is the function that is called when a user opts to turn on location services, and when they log in and their account settings indicate that they want to share their location
  const shareLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setErrorMessages((prevState) => {
        return [
          ...prevState,
          'Geolocation is not supported by your cave man browser.'
        ];
      });
    }

    const GLID = navigator.geolocation.watchPosition(
      // success
      (position) => {
        postLocation(position.coords.latitude, position.coords.longitude);
        setGeolocationID(GLID);
      },
      // failure
      () => {
        setErrorMessages((prevState) => {
          return [...prevState, 'Unable to retrieve your location.'];
        });
      },
      {
        enableHighAccuracy: true
      }
    );
  }, [postLocation]);

  const submitPasswordReset = useCallback(
    async function (email, password, reset_token) {
      await sendRequest({
        callback: storeUserInfo,
        load: true,
        operation: 'submitPasswordReset',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  email: "${email}"
                  password: "${password}"
                  reset_token: "${reset_token}"
                ) {
                  ${authenticationQuery}
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  // this is the function that is called to remove the user's location from the backend
  const deleteLocation = useCallback(
    async function () {
      await sendRequest({
        callback: (data) => {
          setUserInfo((prevState) => ({
            ...prevState,
            settings: {
              ...prevState.settings,
              location_services: data.settings.location_services
            }
          }));
        },
        headers: {
          Authorization: `Bearer ${Cookies.get('authentication_token')}`
        },
        operation: 'deleteLocation',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation} {
                  settings {
                    location_services
                  }
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  // this is the function that is called when the user elects to turn off location services
  const hideLocation = useCallback(() => {
    if (geolocationID) {
      navigator.geolocation.clearWatch(geolocationID);
    }
    setGeolocationID(null);
    deleteLocation();
  }, [deleteLocation]);

  useEffect(() => {
    if (Cookies.get('authentication_token')) {
      authenticate();
    }
  }, []);

  useEffect(() => {
    if (userInfo.settings.location_services) {
      shareLocation();
    }
    return () => {
      if (geolocationID) {
        navigator.geolocation.clearWatch(geolocationID);
      }
    };
  }, [userInfo.settings.location_services]);

  return (
    <AuthenticationContext.Provider
      value={{
        ...userInfo,
        hideLocation,
        isLoggedIn: !!userInfo.token,
        loading,
        login,
        logout,
        register,
        requestPasswordReset,
        setUserInfo,
        shareLocation,
        submitPasswordReset
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
