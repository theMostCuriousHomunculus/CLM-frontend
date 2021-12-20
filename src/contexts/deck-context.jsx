import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import usePopulate from '../hooks/populate-hook';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Deck from '../pages/Deck';
import { CardCacheContext } from './CardCache';

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
  addCardsToDeck: () => null,
  cloneDeck: () => null,
  editDeck: () => null,
  removeCardsFromDeck: () => null,
  toggleMainboardSideboardDeck: () => null
});

export default function ContextualizedDeckPage() {
  const navigate = useNavigate();
  const { deckID } = useParams();
  const { addCardsToCache } = useContext(CardCacheContext);
  const [deckState, setDeckState] = useState({
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
  const { populateCachedScryfallData } = usePopulate();
  const { requestSubscription } = useSubscribe();

  const updateDeckState = useCallback(
    async function (data) {
      const cardSet = new Set();

      for (const card of data.mainboard) {
        cardSet.add(card.scryfall_id);
      }

      for (const card of data.sideboard) {
        cardSet.add(card.scryfall_id);
      }

      await addCardsToCache([...cardSet]);

      data.mainboard.forEach(populateCachedScryfallData);

      data.sideboard.forEach(populateCachedScryfallData);

      setDeckState(data);
    },
    [addCardsToCache, populateCachedScryfallData]
  );

  const addCardsToDeck = useCallback(
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

  const cloneDeck = useCallback(
    async function () {
      await sendRequest({
        callback: (data) => {
          navigate(`/deck/${data._id}`);
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
    [deckQuery, deckState._id, navigate, sendRequest]
  );

  const editDeck = useCallback(
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

  const fetchDeckByID = useCallback(
    async function () {
      await sendRequest({
        callback: updateDeckState,
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
    [deckQuery, deckState._id, sendRequest, updateDeckState]
  );

  const removeCardsFromDeck = useCallback(
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

  const toggleMainboardSideboardDeck = useCallback(
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

  useEffect(() => {
    requestSubscription({
      headers: { deckID },
      queryString: deckQuery,
      setup: fetchDeckByID,
      subscriptionType: 'subscribeDeck',
      update: updateDeckState
    });
  }, [deckID, deckQuery, fetchDeckByID, requestSubscription, updateDeckState]);

  return (
    <DeckContext.Provider
      value={{
        loading,
        deckState,
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
