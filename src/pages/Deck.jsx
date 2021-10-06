import React from 'react';
import { createClient } from 'graphql-ws';
import MUIPaper from '@mui/material/Paper';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { DeckContext } from '../contexts/deck-context';

export default function Deck () {

  const { token, userId } = React.useContext(AuthenticationContext);
  const {
    loading,
    deckQuery,
    deckState,
    setDeckState,
    addCardsToDeck,
    fetchDeckByID,
    removeCardsFromDeck,
    toggleMainboardSideboardDeck
  } = React.useContext(DeckContext);

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
    <React.Fragment>
      <DeckInfo />

      {deckState.creator._id === userId &&
        <React.Fragment>
          <MUIPaper style={{ padding: '0 4px' }}>
            <ScryfallRequest
              buttonText="Add to Deck"
              labelText={`Add a card to ${deckState.name}`}
              onSubmit={cardData => addCardsToDeck(cardData, 'mainboard', 1)}
            />
          </MUIPaper>

          <BasicLandAdder submitFunction={cardData => addCardsToDeck(cardData, 'mainboard', 1)} />
        </React.Fragment>
      }

      <DeckDisplay
        add={addCardsToDeck}
        authorizedID={deckState.creator._id}
        deck={{ mainboard: deckState.mainboard, sideboard: deckState.sideboard }}
        remove={removeCardsFromDeck}
        toggle={toggleMainboardSideboardDeck}
      />
    </React.Fragment>
  );
};