import React, { useContext } from 'react';
import MUIPaper from '@mui/material/Paper';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AuthenticationContext } from '../contexts/Authentication';
import { CardCacheContext } from '../contexts/CardCache';
import { DeckContext } from '../contexts/deck-context';

export default function Deck() {
  const { userID } = useContext(AuthenticationContext);
  const { scryfallCardDataCache } = useContext(CardCacheContext);
  const {
    loading,
    deckState: { creator, image, mainboard, name, sideboard },
    addCardsToDeck,
    removeCardsFromDeck,
    toggleMainboardSideboardDeck
  } = useContext(DeckContext);

  return loading || (image && !scryfallCardDataCache.current[image]) ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <DeckInfo />

      {creator._id === userID && (
        <React.Fragment>
          <BasicLandAdder
            labelText={`Add basic lands to ${name}`}
            submitFunction={(cardData) =>
              addCardsToDeck(cardData, 'mainboard', 1)
            }
          />
          <MUIPaper>
            <ScryfallRequest
              buttonText="Add to Deck"
              labelText={`Add a card to ${name}`}
              onSubmit={(cardData) => addCardsToDeck(cardData, 'mainboard', 1)}
            />
          </MUIPaper>
        </React.Fragment>
      )}

      <DeckDisplay
        add={addCardsToDeck}
        authorizedID={creator._id}
        deck={{
          mainboard: mainboard,
          sideboard: sideboard
        }}
        remove={removeCardsFromDeck}
        toggle={toggleMainboardSideboardDeck}
      />
    </React.Fragment>
  );
}
