import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import Cookies from 'js-cookie';

import useRequest from '../hooks/request-hook';
import { ErrorContext } from './Error';

const unauthenticatedUserInfo = {
  admin: false,
  avatar: null,
  settings: {
    measurement_system: 'imperial',
    radius: 10
  },
  userID: null,
  userName: null
};

export const AuthenticationContext = createContext({
  ...unauthenticatedUserInfo,
  // a convenience field; just makes code a bit easier to reason about
  isLoggedIn: false,
  loading: false,
  localStream: null,
  login: () => {
    // don't return anything
  },
  logout: () => {
    // don't return anything
  },
  peerConnection: null,
  register: () => {
    // don't return anything
  },
  requestPasswordReset: () => {
    // don't return anything
  },
  setLocalStream: () => {
    // don't return anything
  },
  setUserInfo: () => {
    // don't return anything
  },
  submitPasswordReset: () => {
    // don't return anything
  }
});

export function AuthenticationProvider({ children }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const { loading, sendRequest } = useRequest();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [userInfo, setUserInfo] = useState({
    ...unauthenticatedUserInfo
  });
  const servers = useRef({
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
    ],
    iceCandidatePoolSize: 10
  });
  const peerConnection = useRef(new RTCPeerConnection(servers.current));
  const authenticationQuery = `
    _id
    admin
    avatar
    name
    settings {
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

  const logout = useCallback(
    async function () {
      // unsubscribe from push notifications if subscribed
      let subscription;

      if ('Notification' in window && 'serviceWorker' in navigator) {
        const swreg = await navigator.serviceWorker.ready;
        subscription = await swreg.pushManager.getSubscription();
        if (subscription) {
          try {
            await subscription.unsubscribe();
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          }
        }
      }

      // if the logged in user had a push subscription, remove it and the token from the server
      await sendRequest({
        operation: 'logoutSingleDevice',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}${
              subscription
                ? `(
                  endpoint: "${subscription.endpoint}"
                )`
                : ''
            }
              }
            `
          };
        }
      });

      // clear from browser and running application
      setUserInfo({
        ...unauthenticatedUserInfo
      });
      Cookies.remove('authentication_token');
    },
    [sendRequest]
  );

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

  useEffect(() => {
    if (Cookies.get('authentication_token')) {
      authenticate();
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        ...userInfo,
        isLoggedIn: !!userInfo.userID,
        loading,
        localStream,
        login,
        logout,
        peerConnection,
        register,
        requestPasswordReset,
        setLocalStream,
        setUserInfo,
        submitPasswordReset
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
