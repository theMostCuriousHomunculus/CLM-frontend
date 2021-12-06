import React, { createContext, useCallback, useState } from 'react';

import useRequest from '../hooks/request-hook';

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
  authenticate: () => null,
  // a convenience field; just makes code a bit easier to reason about
  isLoggedIn: false,
  loading: false,
  login: () => null,
  logout: () => null,
  register: () => null,
  requestPasswordReset: () => null,
  submitPasswordReset: () => null
});

export function AuthenticationProvider({ children }) {
  const { loading, sendRequest } = useRequest();
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
    [sendRequest, storeUserInfo]
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
    [sendRequest, storeUserInfo]
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

    // clear from running application
    setUserInfo({
      ...unauthenticatedUserInfo
    });

    // stop watching user's location
    if (Cookies.get('geolocation_id')) {
      navigator.geolocation.clearWatch(Cookies.get('geolocation_id'));
    }

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
    [sendRequest, storeUserInfo]
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
    [sendRequest, storeUserInfo]
  );

  return (
    <AuthenticationContext.Provider
      value={{
        ...userInfo,
        authenticate,
        isLoggedIn: !!userInfo.token,
        loading,
        login,
        logout,
        register,
        requestPasswordReset,
        submitPasswordReset
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
