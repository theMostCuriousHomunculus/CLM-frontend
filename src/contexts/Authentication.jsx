import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
    image_uris: {}
  },
  buds: [],
  conversations: [],
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
      image_uris: {}
    },
    buds: [],
    conversations: [],
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

  useEffect(() => {
    (async () => {
      try {
        if (Cookies.get('authentication_token')) {
          setLoading(true);
          const {
            data: {
              authenticate: {
                _id,
                admin,
                avatar,
                buds,
                conversations,
                measurement_system,
                name,
                radius
              }
            }
          } = await authenticate({
            queryString: authenticateQuery,
            signal: abortControllerRef.current.signal
          });
          setUserInfo({
            admin,
            avatar,
            buds,
            conversations,
            measurement_system,
            radius,
            userID: _id,
            userName: name
          });
        }
      } catch (error) {
        Cookies.remove('authentication_token');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useSubscribe({
    cleanup: () => {
      abortControllerRef.current.abort();
      abortControllerRef.current = new AbortController();
    },
    condition: !!Cookies.get('authentication_token'),
    queryString: authenticateQuery,
    subscriptionType: 'subscribeAccount',
    update: (data) => {
      setUserInfo({
        admin: data.admin,
        avatar: data.avatar,
        buds: data.buds,
        conversations: data.conversations,
        measurement_system: data.measurement_system,
        radius: data.radius,
        userID: data._id,
        userName: data.name
      });
    }
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
