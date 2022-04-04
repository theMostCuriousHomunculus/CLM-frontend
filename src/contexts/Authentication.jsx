import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import Cookies from 'js-cookie';

import authenticate from '../graphql/queries/account/authenticate';
import authenticateQuery from '../constants/authenticate-query';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import { ErrorContext } from './Error';

const unauthenticatedUserInfo = {
  admin: false,
  avatar: {
    card_faces: [],
    image_uris: null
  },
  measurement_system: 'imperial',
  radius: 10,
  userID: null,
  userName: null
};

export const AuthenticationContext = createContext({
  ...unauthenticatedUserInfo,
  abortControllerRef: { current: new AbortController() },
  // a convenience field; just makes code a bit easier to reason about
  isLoggedIn: false,
  loading: false,
  localStream: null,
  peerConnection: null,
  setLoading: () => {
    // don't return anything
  },
  setLocalStream: () => {
    // don't return anything
  },
  setUserInfo: () => {
    // don't return anything
  }
});

export function AuthenticationProvider({ children }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const abortControllerRef = useRef(new AbortController());
  const { sendRequest } = useRequest();
  const [loading, setLoading] = useState(false);
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

  // const logout = useCallback(
  //   async function () {
  //     // unsubscribe from push notifications if subscribed
  //     let subscription;

  //     if ('Notification' in window && 'serviceWorker' in navigator) {
  //       const swreg = await navigator.serviceWorker.ready;
  //       subscription = await swreg.pushManager.getSubscription();
  //       if (subscription) {
  //         try {
  //           await subscription.unsubscribe();
  //         } catch (error) {
  //           setErrorMessages((prevState) => [...prevState, error.message]);
  //         }
  //       }
  //     }

  //     // if the logged in user had a push subscription, remove it and the token from the server
  //     await sendRequest({
  //       operation: 'logoutSingleDevice',
  //       get body() {
  //         return {
  //           query: `
  //             mutation {
  //               ${this.operation}${
  //             subscription
  //               ? `(
  //                 endpoint: "${subscription.endpoint}"
  //               )`
  //               : ''
  //           }
  //             }
  //           `
  //         };
  //       }
  //     });

  //     // clear from browser and running application
  //     setUserInfo({
  //       ...unauthenticatedUserInfo
  //     });
  //     Cookies.remove('authentication_token');
  //   },
  //   [sendRequest]
  // );

  useSubscribe({
    cleanup: () => {
      abortControllerRef.current.abort();
    },
    queryString: authenticateQuery,
    setup: async () => {
      try {
        if (Cookies.get('authentication_token')) {
          setLoading(true);
          const response = await authenticate({
            queryString: authenticateQuery,
            signal: abortControllerRef.current.signal
          });
          setUserInfo(response.data.authenticate);
        }
      } catch (error) {
        Cookies.remove('authentication_token');
      } finally {
        setLoading(false);
      }
    },
    subscriptionType: 'subscribeAccount',
    update: setUserInfo
  });

  return (
    <AuthenticationContext.Provider
      value={{
        ...userInfo,
        isLoggedIn: !!userInfo.userID,
        loading,
        localStream,
        peerConnection,
        setLoading,
        setLocalStream,
        setUserInfo
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}
