import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Deck from '../pages/Deck';

export const DeckContext = createContext({
  loading: false,
  deckQuery: '',
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
  fetchDeckByID: () => null,
  removeCardsFromDeck: () => null,
  toggleMainboardSideboardDeck: () => null
});

export default function ContextualizedDeckPage() {

  const history = useHistory();
  const [deckState, setDeckState] = React.useState({
    _id: useParams().deckId,
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
    back_image
    cmc
    collector_number
    color_identity
    image
    keywords
    mana_cost
    mtgo_id
    name
    oracle_id
    scryfall_id
    set
    set_name
    tcgplayer_id
    type_line
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

  const addCardsToDeck = React.useCallback(async function ({
    back_image,
    cmc,
    collector_number,
    color_identity,
    image,
    keywords,
    mana_cost,
    mtgo_id,
    name,
    oracle_id,
    tcgplayer_id,
    scryfall_id,
    set,
    set_name,
    type_line
  }, component, numberOfCopies) {
    await sendRequest({
      headers: { DeckID: deckState._id },
      operation: 'addCardsToDeck',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  card: {
                    ${back_image ? 'back_image: "' + back_image + '",\n' : ''}
                    cmc: ${cmc},
                    collector_number: ${collector_number},
                    color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                    image: "${image}",
                    keywords: [${keywords.map(kw => '"' + kw + '"')}],
                    mana_cost: "${mana_cost}",
                    ${Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',\n' : ''}
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    ${Number.isInteger(tcgplayer_id) ? 'tcgplayer_id: ' + tcgplayer_id + ',\n' : ''} 
                    scryfall_id: "${scryfall_id}",
                    set: "${set}",
                    set_name: "${set_name}",
                    type_line: "${type_line}"
                  },
                  component: ${component},
                  numberOfCopies: ${numberOfCopies}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [deckState._id, sendRequest]);

  const cloneDeck = React.useCallback(async function () {
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
        }
      }
    });
  }, [deckQuery, deckState._id, history, sendRequest]);

  const editDeck = React.useCallback(async function (description, format, name) {
    await sendRequest({
      headers: { DeckID: deckState._id },
      operation: 'editDeck',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  description: "${description}",
                  format: ${format},
                  name: "${name}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [deckState._id, sendRequest]);

  const fetchDeckByID = React.useCallback(async function () {
    await sendRequest({
      callback: data => setDeckState(data),
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
        }
      }
    });
  }, [deckQuery, deckState._id, sendRequest]);

  const removeCardsFromDeck = React.useCallback(async function (cardIDs, component) {
    await sendRequest({
      headers: { DeckID: deckState._id },
      operation: 'removeCardsFromDeck',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardIDs: [${cardIDs.map(cardID => '"' + cardID + '"')}],
                  component: ${component}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [deckState._id, sendRequest]);

  const toggleMainboardSideboardDeck = React.useCallback(async function (cardID) {
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
        }
      }
    });
  }, [deckState._id, sendRequest]);

  return (
    <DeckContext.Provider
      value={{
        loading,
        deckQuery,
        deckState,
        setDeckState,
        addCardsToDeck,
        cloneDeck,
        editDeck,
        fetchDeckByID,
        removeCardsFromDeck,
        toggleMainboardSideboardDeck
      }}
    >
      <Deck />
    </DeckContext.Provider>
  );
};