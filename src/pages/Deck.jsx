import React from 'react';
import { createClient } from 'graphql-ws';
import MUIPaper from '@material-ui/core/Paper';
import MUITypography from '@material-ui/core/Typography';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import DeckInfo from '../components/Deck Page/DeckInfo';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { DeckContext } from '../contexts/deck-context';

export default function Deck () {

  const { token, userId } = React.useContext(AuthenticationContext);
  const { loading, deckQuery, deckState, setDeckState, addCardsToDeck, fetchDeckByID } = React.useContext(DeckContext);

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

          <MUIPaper style={{ padding: '0 4px' }}>
            <div style={{ padding: 4 }}>
              <MUITypography variant="subtitle1">Add Basic Lands to Deck</MUITypography>
            </div>
            <BasicLandAdder submitFunction={() => null} />
          </MUIPaper>
        </React.Fragment>
      }

      {deckState.mainboard.map(card => (
        <span key={card._id}>
          <HoverPreview back_image={card.back_image} image={card.image}>
            <MUITypography variant="body1">{card.name}</MUITypography>
          </HoverPreview>
        </span>
      ))}
    </React.Fragment>
  );
};