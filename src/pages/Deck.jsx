import React from 'react';
import { createClient } from 'graphql-ws';

import DeckInfo from '../components/Deck Page/DeckInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
import { DeckContext } from '../contexts/deck-context';

export default function Deck () {

  const { token } = React.useContext(AuthenticationContext);
  const { loading, deckQuery, deckState, setDeckState, fetchDeckByID } = React.useContext(DeckContext);

  React.useEffect(function () {

    async function initialize () {
      await fetchDeckByID();
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: token,
        deckID: deckState._id
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setDeckState(update.data.subscribeDeck);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            subscribeDeck {
              ${deckQuery}
            }
          }`
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      });
    }

    subscribe(result => console.log(result), error => console.log(error));

    return client.dispose;
  }, [deckQuery, deckState._id, setDeckState, fetchDeckByID, token]);

  return (loading ?
    <LoadingSpinner /> :
    <DeckInfo />
  );
};