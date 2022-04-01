import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import accountQuery from '../constants/account-query';
import fetchAccountByID from '../graphql/queries/account/fetch-account-by-ID';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Account from '../pages/Account';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from './Authentication';
import { ErrorContext } from './Error';

export const AccountContext = createContext({
  abortControllerRef: { current: new AbortController() },
  accountState: {
    _id: '',
    avatar: {
      card_faces: null,
      image_uris: {
        art_crop: '...'
      }
    },
    buds: [],
    cubes: [],
    decks: [],
    email: '',
    events: [],
    location: {
      coordinates: []
    },
    matches: [],
    name: '...',
    nearby_users: null,
    received_bud_requests: [],
    sent_bud_requests: [],
    total_events: 0
  },
  setAccountState: () => null,
  createMatch: () => null
  // deleteEvent: () => null,
  // deleteMatch: () => null
});

export default function ContextualizedAccountPage() {
  const { userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { accountID } = useParams();
  const abortControllerRef = useRef(new AbortController());
  const [accountState, setAccountState] = useState({
    _id: accountID,
    avatar: {
      card_faces: null,
      image_uris: {
        art_crop: '...'
      }
    },
    buds: [],
    cubes: [],
    decks: [],
    email: '',
    events: [],
    location: {
      coordinates: []
    },
    matches: [],
    name: '...',
    nearby_users: null,
    received_bud_requests: [],
    sent_bud_requests: [],
    total_events: 0
  });
  const [loading, setLoading] = useState(false);
  const { accountData } = location.state || {};
  const { sendRequest } = useRequest();

  const createMatch = useCallback(
    async function (event, deckIDs, eventID, playerIDs) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          navigate(`/match/${data._id}`);
        },
        load: true,
        operation: 'createMatch',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                deckIDs: [${deckIDs.map((dckID) => '"' + dckID + '"')}],
                ${eventID ? 'eventID: "' + eventID + '",\n' : ''}
                playerIDs: [${playerIDs.map((plrID) => '"' + plrID + '"')}]
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [navigate, sendRequest]
  );

  useSubscribe({
    cleanup: () => {
      abortControllerRef.current.abort();
    },
    connectionInfo: { accountID },
    dependencies: [accountID],
    queryString: accountQuery,
    setup: async () => {
      if (accountData) {
        setAccountState(accountData);
      } else {
        try {
          setLoading(true);
          const response = await fetchAccountByID({
            headers: { AccountID: accountID },
            queryString: accountQuery,
            signal: abortControllerRef.current.signal
          });
          setAccountState(response.data.fetchAccountByID);
        } catch (error) {
          setErrorMessages((prevState) => [...prevState, error.message]);
        } finally {
          setLoading(false);
        }
      }
    },
    subscriptionType: 'subscribeAccount',
    update: setAccountState
  });

  return (
    <AccountContext.Provider
      value={{
        abortControllerRef,
        accountState,
        setAccountState,
        createMatch
      }}
    >
      {loading ? <LoadingSpinner /> : <Account />}
    </AccountContext.Provider>
  );
}
