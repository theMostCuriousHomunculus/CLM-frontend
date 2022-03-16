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

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <DeckInfo />

      {creator._id === userID && (
        <React.Fragment>
          <BasicLandAdder
            labelText={`Add basic lands to ${name}`}
            submitFunction={(cardData) =>
              setNumberOfDeckCardCopies({
                headers: { DeckID: deckID },
                variables: {
                  mainboard_count: 1,
                  scryfall_id: cardData.scryfall_id,
                  sideboard_count: 0
                }
              })
            }
          />
          <MUIPaper>
            <ScryfallRequest
              buttonText="Add to Deck"
              labelText={`Add a card to ${name}`}
              onSubmit={(cardData) =>
                setNumberOfDeckCardCopies({
                  headers: { DeckID: deckID },
                  variables: {
                    mainboard_count: 1,
                    scryfall_id: cardData.scryfall_id,
                    sideboard_count: 0
                  }
                })
              }
            />
          </MUIPaper>
        </React.Fragment>
      )}

      <DeckDisplay authorizedID={creator._id} cards={cards} />
    </React.Fragment>
  );
}
