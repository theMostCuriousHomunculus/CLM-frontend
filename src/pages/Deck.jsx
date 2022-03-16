import React, { useContext } from 'react';
import MUIPaper from '@mui/material/Paper';
import { useParams } from 'react-router-dom';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import setNumberOfDeckCardCopies from '../graphql/mutations/deck/set-number-of-deck-card-copies';
import { AuthenticationContext } from '../contexts/Authentication';
import { DeckContext } from '../contexts/deck-context';

export default function Deck() {
  const { userID } = useContext(AuthenticationContext);
  const {
    loading,
    deckState: { cards, creator, name }
  } = useContext(DeckContext);
  const { deckID } = useParams();

  function submit(cardData) {
    const existingCard = cards.find((card) => card.scryfall_card._id === cardData.scryfall_id);
    if (existingCard) {
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables: {
          mainboard_count: existingCard.mainboard_count + 1,
          scryfall_id: cardData.scryfall_id,
          sideboard_count: existingCard.sideboard_count
        }
      });
    } else {
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables: {
          mainboard_count: 1,
          scryfall_id: cardData.scryfall_id,
          sideboard_count: 0
        }
      });
    }
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <DeckInfo />

      {creator._id === userID && (
        <React.Fragment>
          <BasicLandAdder labelText={`Add basic lands to ${name}`} submitFunction={submit} />
          <MUIPaper>
            <ScryfallRequest
              buttonText="Add to Deck"
              labelText={`Add a card to ${name}`}
              onSubmit={submit}
            />
          </MUIPaper>
        </React.Fragment>
      )}

      <DeckDisplay authorizedID={creator._id} cards={cards} />
    </React.Fragment>
  );
}
