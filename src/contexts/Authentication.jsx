import React, { createContext, useContext, useRef, useState } from 'react';
import Cookies from 'js-cookie';

import authenticate from '../graphql/queries/account/authenticate';
import authenticateQuery from '../constants/authenticate-query';
import useSubscribe from '../hooks/subscribe-hook';
import { ErrorContext } from './Error';

export const AuthenticationContext = createContext({
  abortControllerRef: { current: new AbortController() },
  admin: false,
  avatar: {
    card_faces: [],
    image_uris: null
  },
  // a convenience field; just makes code a bit easier to reason about
  isLoggedIn: false,
  loading: false,
  localStream: null,
  measurement_system: 'imperial',
  peerConnection: null,
  setLoading: () => {
    // don't return anything
  },
  setLocalStream: () => {
    // don't return anything
  },
  setUserInfo: () => {
    // don't return anything
  },
  radius: 10,
  userID: null,
  userName: null
});

export function AuthenticationProvider({ children }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const abortControllerRef = useRef(new AbortController());
  const [loading, setLoading] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);
  const [userInfo, setUserInfo] = useState({
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
  const servers = useRef({
    iceServers: [
      {
        urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302']
      }
    ],
    iceCandidatePoolSize: 10
  });
  const peerConnection = useRef(new RTCPeerConnection(servers.current));

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
        abortControllerRef,
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
