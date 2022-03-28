import React from 'react';
import MUITypography from '@mui/material/Typography';

import CardMapItem from './CardMapItem';
import specificCardType from '../../functions/specific-card-type';

export default function TypeMapItem({
  cardCountState,
  component,
  componentCards,
  generalCardType,
  setCardCountState
}) {
  const cardsOfType = componentCards.filter(
    (card) => specificCardType(card.scryfall_card.type_line) === generalCardType
  );

  return (
    cardsOfType.length > 0 && (
      <React.Fragment>
        <MUITypography variant="subtitle1">
          {`${generalCardType} (${cardsOfType.reduce(
            (previousValue, currentValue) =>
              previousValue +
              (cardCountState[currentValue.scryfall_card._id]
                ? cardCountState[currentValue.scryfall_card._id][component.field_name]
                : 0),
            0
          )})`}
        </MUITypography>
        {cardsOfType.map(({ scryfall_card }) => (
          <CardMapItem
            component={component}
            cardCountState={cardCountState}
            key={scryfall_card._id}
            scryfall_card={scryfall_card}
            setCardCountState={setCardCountState}
          />
        ))}
      </React.Fragment>
    )
  );
}
