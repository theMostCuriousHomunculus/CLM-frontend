import React from 'react';
import MUIPaper from '@mui/material/Paper';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/Authentication';
import { DeckContext } from '../contexts/deck-context';

export default function Deck() {
  const { userID } = React.useContext(AuthenticationContext);
  const {
    loading,
    deckState,
    addCardsToDeck,
    removeCardsFromDeck,
    toggleMainboardSideboardDeck
  } = React.useContext(DeckContext);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <DeckInfo />

      {deckState.creator._id === userID && (
        <React.Fragment>
          <BasicLandAdder
            submitFunction={(cardData) =>
              addCardsToDeck(cardData, 'mainboard', 1)
            }
          />
          <MUIPaper>
            <ScryfallRequest
              buttonText="Add to Deck"
              labelText={`Add a card to ${deckState.name}`}
              onSubmit={(cardData) => addCardsToDeck(cardData, 'mainboard', 1)}
            />
          </MUIPaper>
        </React.Fragment>
      )}

      <DeckDisplay
        add={addCardsToDeck}
        authorizedID={deckState.creator._id}
        deck={{
          mainboard: deckState.mainboard,
          sideboard: deckState.sideboard
        }}
        remove={removeCardsFromDeck}
        toggle={toggleMainboardSideboardDeck}
      />
    </React.Fragment>
  );
}
