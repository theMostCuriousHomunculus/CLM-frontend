import React, { createContext, useCallback, /* useContext, useEffect, */ useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
// import validateDeck from '../functions/validate-deck';
import Deck from '../pages/Deck';

export const DeckContext = createContext({
  loading: false,
  deckState: {
    _id: '',
    cards: [],
    creator: {
      _id: '',
      avatar: '',
      name: ''
    },
    description: '',
    format: '',
    image: {
      _id: '',
      image_uris: {
        art_crop: ''
      },
      name: '',
      card_faces: [
        {
          image_uris: {
            art_crop: ''
          },
          name: ''
        }
      ]
    },
    name: '',
    published: false
  },
  cloneDeck: () => null,
  editDeck: () => null
  // warnings: []
});

export default function ContextualizedDeckPage() {
  const navigate = useNavigate();
  const { deckID } = useParams();
  const [deckState, setDeckState] = useState({
    _id: deckID,
    cards: [],
    creator: {
      _id: '',
      avatar: '',
      name: '...'
    },
    description: '',
    format: '',
    image: {
      _id: '',
      image_uris: {
        image_uris: {
          art_crop: ''
        },
        name: ''
      },
      name: '',
      card_faces: [
        {
          image_uris: {
            art_crop: ''
          },
          name: ''
        }
      ]
    },
    name: '',
    published: false
  });
  // const [warnings, setWarnings] = useState([]);

  const cardQuery = `
    _id
    mainboard_count
    maybeboard_count
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
      rarity
      _set
      type_line
    }
    sideboard_count
  `;
  const deckQuery = `
    _id
    cards {
      ${cardQuery}
    }
    creator {
      _id
      avatar
      name
    }
    description
    format
    image {
      _id
      image_uris {
        art_crop
      }
      name
      card_faces {
        image_uris {
          art_crop
        }
        name
      }
    }
    name
    published
  `;
  const { loading, sendRequest } = useRequest();

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
        callback: setDeckState,
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
    [deckQuery, deckState._id, sendRequest]
  );

  useSubscribe({
    connectionInfo: { deckID },
    queryString: deckQuery,
    setup: fetchDeckByID,
    subscriptionType: 'subscribeDeck',
    update: setDeckState
  });

  // useEffect(() => {
  //   const { format, mainboard, sideboard } = deckState;
  //   validateDeck({ format, mainboard, sideboard }, setWarnings);
  // }, [deckState.format, deckState.mainboard.length, deckState.sideboard.length]);

  return (
    <DeckContext.Provider
      value={{
        loading,
        deckState,
        cloneDeck,
        editDeck
        // warnings
      }}
    >
      <Deck />
    </DeckContext.Provider>
  );
}
