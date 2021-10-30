import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Account from '../pages/Account';

export const AccountContext = createContext({
  loading: false,
  accountQuery: '',
  accountState: null,
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
  const history = useHistory();
  const [accountState, setAccountState] = React.useState({
    _id: accountID,
    avatar: '',
    buds: [],
    cubes: [],
    decks: [],
    email: '',
    events: [],
    matches: [],
    name: '...',
    received_bud_requests: [],
    sent_bud_requests: []
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
      name
    }
    email
    events {
      _id
      createdAt
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
  `;
  const { loading, sendRequest } = useRequest();

  const createCube = React.useCallback(
    async function (event, cobraID, description, name) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          history.push(`/cube/${data._id}`);
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
    [history, sendRequest]
  );

  const createDeck = React.useCallback(
    async function (event, description, existingListID, format, name) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          history.push(`/deck/${data._id}`);
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
    [history, sendRequest]
  );

  const createEvent = React.useCallback(
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
          history.push(`/event/${data._id}`);
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
    [history, sendRequest]
  );

  const createMatch = React.useCallback(
    async function (event, deckIDs, eventID, playerIDs) {
      event.preventDefault();

      await sendRequest({
        callback: (data) => {
          history.push(`/match/${data._id}`);
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
    [history, sendRequest]
  );

  const deleteCube = React.useCallback(
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

  const deleteDeck = React.useCallback(
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

  const editAccount = React.useCallback(
    async function (changes) {
      await sendRequest({
        callback: (data) => {
          setAccountState(data);
        },
        operation: 'editAccount',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                input: {
                  ${changes}
                }
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

  const fetchAccountByID = React.useCallback(
    async function () {
      await sendRequest({
        callback: (data) => setAccountState(data),
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
        accountQuery,
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