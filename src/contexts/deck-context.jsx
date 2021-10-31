import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Deck from '../pages/Deck';
import { CardCacheContext } from './card-cache-context';

export const DeckContext = createContext({
  loading: false,
  deckState: {
    _id: null,
    creator: {
      _id: null,
      avatar: null,
      name: null
    },
    description: null,
    format: null,
    mainboard: [],
    name: null,
    sideboard: []
  },
  setDeckState: () => null,
  addCardsToDeck: () => null,
  cloneDeck: () => null,
  editDeck: () => null,
  removeCardsFromDeck: () => null,
  toggleMainboardSideboardDeck: () => null
});

export default function ContextualizedDeckPage() {
  const history = useHistory();
  const { deckID } = useParams();
  const { addCardsToCache, scryfallCardDataCache } =
    React.useContext(CardCacheContext);
  const [deckState, setDeckState] = React.useState({
    _id: deckID,
    creator: {
      _id: '',
      avatar: '',
      name: '...'
    },
    description: '',
    format: '',
    mainboard: [],
    name: '',
    sideboard: []
  });
  const cardQuery = `
    _id
    name
    scryfall_id
  `;
  const deckQuery = `
    _id
    creator {
      _id
      avatar
      name
    }
    description
    format
    mainboard {
      ${cardQuery}
    }
    name
    sideboard {
      ${cardQuery}
    }
  `;
  const { loading, sendRequest } = useRequest();
  const { requestSubscription } = useSubscribe();

  const addCardsToDeck = React.useCallback(
    async function ({ name, scryfall_id }, component, numberOfCopies) {
      await sendRequest({
        headers: { DeckID: deckState._id },
        operation: 'addCardsToDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                component: ${component},
                name: "${name}",
                numberOfCopies: ${numberOfCopies},
                scryfall_id: "${scryfall_id}"
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [deckState._id, sendRequest]
  );

  const cloneDeck = React.useCallback(
    async function () {
      await sendRequest({
        callback: (data) => {
          history.push(`/deck/${data._id}`);
          setDeckState(data);
        },
        headers: { DeckID: deckState._id },
        load: true,
        operation: 'cloneDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation} {
                ${deckQuery}
              }
            }
          `
          };
        }
      });
    },
    [deckQuery, deckState._id, history, sendRequest]
  );

  const editDeck = React.useCallback(
    async function (description, format, name) {
      await sendRequest({
        headers: { DeckID: deckState._id },
        operation: 'editDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                description: "${description}",
                format: ${format},
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
    [deckState._id, sendRequest]
  );

  const fetchDeckByID = React.useCallback(
    async function () {
      await sendRequest({
        callback: async function (data) {
          const cardSet = new Set();

          for (const card of data.mainboard) {
            cardSet.add(card.scryfall_id);
          }

          for (const card of data.sideboard) {
            cardSet.add(card.scryfall_id);
          }

          await addCardsToCache([...cardSet]);

          data.mainboard.forEach((card, index, array) => {
            array[index] = {
              ...scryfallCardDataCache.current[card.scryfall_id],
              ...card
            };
          });

          data.sideboard.forEach((card, index, array) => {
            array[index] = {
              ...scryfallCardDataCache.current[card.scryfall_id],
              ...card
            };
          });

          setDeckState(data);
        },
        headers: { DeckID: deckState._id },
        load: true,
        operation: 'fetchDeckByID',
        get body() {
          return {
            query: `
            query {
              ${this.operation} {
                ${deckQuery}
              }
            }
          `
          };
        }
      });
    },
    [
      addCardsToCache,
      deckQuery,
      deckState._id,
      scryfallCardDataCache,
      sendRequest
    ]
  );

  const removeCardsFromDeck = React.useCallback(
    async function (cardIDs, component) {
      await sendRequest({
        headers: { DeckID: deckState._id },
        operation: 'removeCardsFromDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardIDs: [${cardIDs.map((cardID) => '"' + cardID + '"')}],
                component: ${component}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [deckState._id, sendRequest]
  );

  const toggleMainboardSideboardDeck = React.useCallback(
    async function (cardID) {
      await sendRequest({
        headers: { DeckID: deckState._id },
        operation: 'toggleMainboardSideboardDeck',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(cardID: "${cardID}") {
                _id
              }
            }
          `
          };
        }
      });
    },
    [deckState._id, sendRequest]
  );

  React.useEffect(() => {
    requestSubscription({
      headers: { deckID },
      queryString: deckQuery,
      setup: fetchDeckByID,
      subscriptionType: 'subscribeDeck',
      update: setDeckState
    });
  }, [deckID, deckQuery, fetchDeckByID, requestSubscription]);

  return (
    <DeckContext.Provider
      value={{
        loading,
        deckState,
        setDeckState,
        addCardsToDeck,
        cloneDeck,
        editDeck,
        removeCardsFromDeck,
        toggleMainboardSideboardDeck
      }}
    >
      <Deck />
    </DeckContext.Provider>
  );
}
