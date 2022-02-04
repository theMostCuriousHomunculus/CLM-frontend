import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import fetchAccountByID from '../graphql/queries/account/fetch-account-by-ID';
import useRequest from '../hooks/request-hook';
import Account from '../pages/Account';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from './Authentication';
import { CardCacheContext } from './CardCache';
import { ErrorContext } from './Error';

export const AccountContext = createContext({
  loading: false,
  accountState: {
    _id: '',
    avatar: '',
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
  createMatch: () => null,
  // deleteEvent: () => null,
  // deleteMatch: () => null,
  editAccount: () => null
});

export default function ContextualizedAccountPage() {
  const { setUserInfo, userID } = useContext(AuthenticationContext);
  const { addCardsToCache, scryfallCardDataCache } =
    useContext(CardCacheContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const { accountID } = useParams();
  const [accountState, setAccountState] = useState({
    _id: accountID,
    avatar: '',
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
  const accountQuery = `
    _id
    avatar
    buds {
      _id
      avatar
      buds {
        _id
        avatar
        name
      }
      decks {
        _id
        format
        name
      }
      name
    }
    cubes {
      _id
      description
      image
      mainboard {
        _id
      }
      modules {
        _id
        cards {
          _id
        }
        name
      }
      name
      rotations {
        _id
        cards {
          _id
        }
        name
        size
      }
      sideboard {
        _id
      }
    }
    decks {
      _id
      description
      format
      image
      name
    }
    email
    events {
      _id
      createdAt
      cube {
        _id
        image
        name
      }
      host {
        _id
        avatar
        name
      }
      name
      players {
        account {
          _id
          avatar
          name
        }
      }
    }
    location {
      coordinates
    }
    matches {
      _id
      createdAt
      cube {
        _id
        name
      }
      decks {
        _id
        format
        name
      }
      event {
        _id
        name
      }
      players {
        account {
          _id
          avatar
          name
        }
      }
    }
    name
    nearby_users {
      _id
      avatar
      name
    }
    received_bud_requests {
      _id
      avatar
      name
    }
    sent_bud_requests {
      _id
      avatar
      name
    }
    settings {
      measurement_system
      radius
    }
    total_events
  `;
  const { sendRequest } = useRequest();

  const updateAccountState = useCallback(
    async function (data) {
      const cardSet = new Set();

      for (const cube of data.cubes) {
        if (cube.image) cardSet.add(cube.image);
      }

      for (const deck of data.decks) {
        if (deck.image) cardSet.add(deck.image);
      }

      for (const event of data.events) {
        if (event.cube.image) cardSet.add(event.cube.image);
      }

      await addCardsToCache([...cardSet]);

      for (const cube of data.cubes) {
        if (cube.image) {
          cube.image = {
            alt: scryfallCardDataCache.current[cube.image].name,
            scryfall_id: cube.image,
            src: scryfallCardDataCache.current[cube.image].art_crop
          };
        }
      }

      for (const deck of data.decks) {
        if (deck.image) {
          deck.image = {
            alt: scryfallCardDataCache.current[deck.image].name,
            scryfall_id: deck.image,
            src: scryfallCardDataCache.current[deck.image].art_crop
          };
        }
      }

      for (const event of data.events) {
        if (event.cube.image) {
          event.cube.image = {
            alt: scryfallCardDataCache.current[event.cube.image].name,
            scryfall_id: event.cube.image,
            src: scryfallCardDataCache.current[event.cube.image].art_crop
          };
        }
      }

      setAccountState(data);
    },
    [addCardsToCache]
  );

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

  const editAccount = useCallback(
    async function (changes) {
      await sendRequest({
        callback: (data) => {
          setAccountState(data);
          if (!changes.toString().includes('return_other')) {
            setUserInfo((prevState) => ({
              ...prevState,
              avatar: data.avatar,
              settings: data.settings,
              userName: data.name
            }));
          }
        },
        operation: 'editAccount',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                ${changes}
              ) {
                ${accountQuery}
              }
            }
          `
          };
        }
      });
    },
    [accountQuery, sendRequest]
  );

  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const data = await fetchAccountByID({
          headers: { AccountID: accountID },
          queryString: `{\n${accountQuery}\n}`
        });
        await updateAccountState(data.data.fetchAccountByID);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
    })();
  }, [accountID, userID]);

  return (
    <AccountContext.Provider
      value={{
        accountState,
        setAccountState,
        createMatch,
        editAccount
      }}
    >
      {loading ? <LoadingSpinner /> : <Account />}
    </AccountContext.Provider>
  );
}
