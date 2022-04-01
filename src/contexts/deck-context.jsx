import React, {
  createContext,
  useContext,
  /* useEffect, */
  useRef,
  useState
} from 'react';
import { useLocation, useParams } from 'react-router-dom';

import deckQuery from '../constants/deck-query';
import fetchDeckByID from '../graphql/queries/deck/fetch-deck-by-ID';
import useSubscribe from '../hooks/subscribe-hook';
// import validateDeck from '../functions/validate-deck';
import Deck from '../pages/Deck';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { ErrorContext } from './Error';

export const DeckContext = createContext({
  abortControllerRef: { current: new AbortController() },
  deckState: {
    _id: '',
    cards: [],
    creator: {
      _id: '',
      avatar: {
        card_faces: [],
        image_uris: null
      },
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
  }
  // warnings: []
});

export default function ContextualizedDeckPage() {
  const { setErrorMessages } = useContext(ErrorContext);
  const location = useLocation();
  const { deckID } = useParams();
  const abortControllerRef = useRef(new AbortController());
  const [loading, setLoading] = useState(false);
  const [deckState, setDeckState] = useState({
    _id: deckID,
    cards: [],
    creator: {
      _id: '',
      avatar: {
        card_faces: [],
        image_uris: null
      },
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

  const { deckData } = location.state || {};

  useSubscribe({
    connectionInfo: { deckID },
    dependencies: [deckID],
    queryString: deckQuery,
    setup: async () => {
      if (deckData) {
        setDeckState(deckData);
      } else {
        try {
          setLoading(true);
          const response = await fetchDeckByID({
            headers: { DeckID: deckID },
            queryString: deckQuery,
            signal: abortControllerRef.current.signal
          });
          setDeckState(response.data.fetchDeckByID);
        } catch (error) {
          setErrorMessages((prevState) => [...prevState, error.message]);
        } finally {
          setLoading(false);
        }
      }
    },
    fetchDeckByID,
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
        abortControllerRef,
        deckState
        // warnings
      }}
    >
      {loading ? <LoadingSpinner /> : <Deck />}
    </DeckContext.Provider>
  );
}
