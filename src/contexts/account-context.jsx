import React, { createContext, useCallback, useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Account from '../pages/Account';
import { AuthenticationContext } from './Authentication';
import { CardCacheContext } from './CardCache';

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
  createCube: () => null,
  createDeck: () => null,
  createEvent: () => null,
  createMatch: () => null,
  deleteCube: () => null,
  deleteDeck: () => null,
  // deleteEvent: () => null,
  // deleteMatch: () => null,
  editAccount: () => null,
  fetchAccountByID: () => null
});

export default function ContextualizedAccountPage() {
  const { accountID } = useParams();
  const { addCardsToCache, scryfallCardDataCache } =
    useContext(CardCacheContext);
  const { setUserInfo } = useContext(AuthenticationContext);
  const navigate = useNavigate();
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
  const { loading, sendRequest } = useRequest();

  const updateAccountState = useCallback(
    async function (data) {
      const cardSet = new Set();
      console.log(data);
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
      console.log(accountState);
    },
    [addCardsToCache]
  );

  const createCube = useCallback(
    async function (event, cobraID, description, name) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          navigate(`/cube/${data._id}`);
        },
        load: true,
        operation: 'createCube',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                ${cobraID ? 'cobraID: "' + cobraID + '",\n' : ''}
                description: "${description}",
                name: "${name}"
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

  const createDeck = useCallback(
    async function (event, description, existingListID, format, name) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          navigate(`/deck/${data._id}`);
        },
        load: true,
        operation: 'createDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                description: "${description}",
                ${
                  existingListID
                    ? 'existingListID: "' + existingListID + '",\n'
                    : ''
                }
                ${format ? 'format: ' + format + ',\n' : ''}
                name: "${name}"
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

  const createEvent = useCallback(
    async function (
      event,
      cubeID,
      cardsPerPack,
      eventType,
      modules,
      name,
      otherPlayers,
      packsPerPlayer
    ) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          navigate(`/event/${data._id}`);
        },
        headers: { CubeID: cubeID },
        load: true,
        operation: 'createEvent',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cards_per_pack: ${cardsPerPack},
                event_type: ${eventType},
                modules: [${modules.map((mdl) => '"' + mdl + '"')}],
                name: "${name}",
                other_players: [${otherPlayers.map((plr) => '"' + plr + '"')}],
                packs_per_player: ${packsPerPlayer}
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

  const deleteCube = useCallback(
    async function (cubeID) {
      await sendRequest({
        headers: { CubeID: cubeID },
        operation: 'deleteCube',
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
    },
    [sendRequest]
  );

  const deleteDeck = useCallback(
    async function (deckID) {
      await sendRequest({
        headers: { DeckID: deckID },
        operation: 'deleteDeck',
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
    },
    [sendRequest]
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

  const fetchAccountByID = useCallback(
    async function () {
      await sendRequest({
        callback: updateAccountState,
        load: true,
        operation: 'fetchAccountByID',
        get body() {
          return {
            query: `
            query {
              ${this.operation}(_id: "${accountID}") {
                ${accountQuery}
              }
            }
          `
          };
        }
      });
    },
    [accountQuery, accountID, sendRequest]
  );

  return (
    <AccountContext.Provider
      value={{
        loading,
        accountState,
        setAccountState,
        createCube,
        createDeck,
        createEvent,
        createMatch,
        deleteCube,
        deleteDeck,
        editAccount,
        fetchAccountByID
      }}
    >
      <Account />
    </AccountContext.Provider>
  );
}
