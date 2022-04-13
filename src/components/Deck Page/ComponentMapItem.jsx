import React, { useContext, useEffect, useState } from 'react';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';
import { useParams } from 'react-router';

import TypeMapItem from './TypeMapItem';
import ScryfallRequest from '../miscellaneous/ScryfallRequest';
import deckComponents from '../../constants/deck-components';
import generalCardTypes from '../../constants/general-card-types';
import setNumberOfDeckCardCopies from '../../graphql/mutations/deck/set-number-of-deck-card-copies';
import { AuthenticationContext } from '../../contexts/Authentication';
import { DeckContext } from '../../contexts/deck-context';

export default function ComponentMapItem({ component, componentCards }) {
  const { userID } = useContext(AuthenticationContext);
  const { deckState } = useContext(DeckContext);
  const { deckID } = useParams();

  const [cardCountState, setCardCountState] = useState(
    componentCards.reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue.scryfall_card._id]: {
          mainboard_count: currentValue.mainboard_count,
          maybeboard_count: currentValue.maybeboard_count,
          sideboard_count: currentValue.sideboard_count
        }
      }),
      {}
    )
  );

  function addCardToComponent(cardData) {
    const otherComponents = deckComponents.filter(
      (cmpnnt) => cmpnnt.display_name !== component.display_name
    );
    const existingCard = deckState.cards.find((card) => card.scryfall_card._id === cardData._id);
    if (existingCard) {
      const variables = otherComponents.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.field_name]: existingCard[currentValue.field_name]
        }),
        {
          scryfall_id: cardData._id,
          [component.field_name]: existingCard[component.field_name] + 1
        }
      );
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables
      });
    } else {
      const variables = otherComponents.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.field_name]: 0
        }),
        {
          scryfall_id: cardData._id,
          [component.field_name]: 1
        }
      );
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables
      });
    }
  }

  useEffect(() => {
    setCardCountState(
      componentCards.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.scryfall_card._id]: {
            mainboard_count: currentValue.mainboard_count,
            maybeboard_count: currentValue.maybeboard_count,
            sideboard_count: currentValue.sideboard_count
          }
        }),
        {}
      )
    );
  }, [componentCards]);

  return (
    <MUIGrid item xs={12} md={6} lg={4}>
      <MUICard>
        <MUICardHeader
          title={
            <MUITypography variant="h3">
              {component.display_name} (
              {Object.values(cardCountState).reduce(
                (previousValue, currentValue) => previousValue + currentValue[component.field_name],
                0
              )}
              )
            </MUITypography>
          }
        />
        <MUICardContent>
          {generalCardTypes.map((generalCardType) => (
            <TypeMapItem
              cardCountState={cardCountState}
              component={component}
              componentCards={componentCards}
              generalCardType={generalCardType}
              key={generalCardType}
              setCardCountState={setCardCountState}
            />
          ))}
        </MUICardContent>
        {deckState && deckState.creator._id === userID && (
          <MUICardActions>
            <ScryfallRequest
              buttonText="+"
              labelText={`Add a card to ${component.display_name}`}
              onSubmit={addCardToComponent}
            />
          </MUICardActions>
        )}
      </MUICard>
    </MUIGrid>
  );
}
