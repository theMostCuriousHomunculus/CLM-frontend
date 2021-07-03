import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Deck from '../pages/Deck';

export const DeckContext = createContext({
  loading: false,
  deckQuery: '',
  deckState: null,
  setDeckState: () => null,
  addCardsToDeck: () => null,
  editDeck: () => null,
  fetchDeckByID: () => null,
  removeCardFromDeck: () => null,
  toggleMainboardSideboard: () => null
});

export default function ContextualizedDeckPage() {

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
      _id
      back_image
      image
      name
    }
    name
    sideboard {
      _id
      back_image
      image
      name
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
    tokens,
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
                    tokens: [${tokens.map(token => '{\nname: "' + token.name + '",\nscryfall_id: "' + token.scryfall_id + '"\n}')}],
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
  }, [deckState._id, sendRequest])

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

  const removeCardFromDeck = React.useCallback(async function (cardID) {
    await sendRequest({
      headers: { DeckID: deckState._id },
      operation: 'removeCardFromDeck',
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

  const toggleMainboardSideboard = React.useCallback(async function (cardID) {
    await sendRequest({
      headers: { DeckID: deckState._id },
      operation: 'toggleMainboardSideboard',
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
        editDeck,
        fetchDeckByID,
        removeCardFromDeck,
        toggleMainboardSideboard
      }}
    >
      <Deck />
    </DeckContext.Provider>
  );
};