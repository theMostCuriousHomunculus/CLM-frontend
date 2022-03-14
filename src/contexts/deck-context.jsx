import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import validateDeck from '../functions/validate-deck';
import Deck from '../pages/Deck';
import { CardCacheContext } from './CardCache';

export const DeckContext = createContext({
  loading: false,
  deckState: {
    _id: '',
    creator: {
      _id: '',
      avatar: '',
      name: ''
    },
    description: '',
    format: '',
    image: {
      alt: undefined,
      scryfall_id: undefined,
      src: undefined
    },
    mainboard: [],
    name: '',
    published: false,
    sideboard: []
  },
  addCardsToDeck: () => null,
  cloneDeck: () => null,
  editDeck: () => null,
  removeCardsFromDeck: () => null,
  toggleMainboardSideboardDeck: () => null,
  warnings: []
});

export default function ContextualizedDeckPage() {
  const navigate = useNavigate();
  const { deckID } = useParams();
  const { addCardsToCache, scryfallCardDataCache } = useContext(CardCacheContext);
  const [deckState, setDeckState] = useState({
    _id: deckID,
    creator: {
      _id: '',
      avatar: '',
      name: '...'
    },
    description: '',
    format: '',
    image: {
      alt: undefined,
      scryfall_id: undefined,
      src: undefined
    },
    mainboard: [],
    name: '',
    published: false,
    sideboard: []
  });
  const [warnings, setWarnings] = useState([]);

  const cardQuery = `
    _id
    scryfall_card {
      _id
      card_faces {
        image_uris {
          large
        }
        mana_cost
        name
        oracle_text
      }
      cmc
      collector_number
      image_uris {
        large
      }
      legalities {
        banned
        legal
        not_legal
        restricted
      }
      mana_cost
      mtgo_id
      name
      oracle_text
      _set
      type_line
    }
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
    image
    mainboard {
      ${cardQuery}
    }
    name
    published
    sideboard {
      ${cardQuery}
    }
  `;
  const { loading, sendRequest } = useRequest();

  const updateDeckState = useCallback(
    async function (data) {
      const cardSet = new Set();

      if (data.image) cardSet.add(data.image);

      await addCardsToCache([...cardSet]);

      if (data.image) {
        data.image = {
          alt: scryfallCardDataCache.current[data.image].name,
          scryfall_id: data.image,
          src: scryfallCardDataCache.current[data.image].art_crop
        };
      }

      setDeckState(data);
    },
    [addCardsToCache]
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
    async function ({ description, format, image, name, published }) {
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
                  ${image ? `image: "${image}",` : ''}
                  published: ${published},
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

  useSubscribe({
    connectionInfo: { deckID },
    queryString: deckQuery,
    setup: fetchDeckByID,
    subscriptionType: 'subscribeDeck',
    update: updateDeckState
  });

  useEffect(() => {
    const { format, mainboard, sideboard } = deckState;
    validateDeck({ format, mainboard, sideboard }, setWarnings);
  }, [deckState.format, deckState.mainboard.length, deckState.sideboard.length]);

  return (
    <DeckContext.Provider
      value={{
        loading,
        deckState,
        addCardsToDeck,
        cloneDeck,
        editDeck,
        removeCardsFromDeck,
        toggleMainboardSideboardDeck,
        warnings
      }}
    >
      <Deck />
    </DeckContext.Provider>
  );
}
