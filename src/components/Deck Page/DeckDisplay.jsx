import React, { useContext } from 'react';
import MUIGrid from '@mui/material/Grid';

import ComponentMapItem from './ComponentMapItem';
import customSort from '../../functions/custom-sort';
import deckComponents from '../../constants/deck-components';
import { DeckContext } from '../../contexts/deck-context';

export default function DeckDisplay() {
  const {
    deckState: { cards }
  } = useContext(DeckContext);
  const sortedCards = customSort(cards, [
    'scryfall_card.cmc',
    'scryfall_card.name',
    'scryfall_card._set',
    'scryfall_card.collector_number'
  ]);

  return (
    <MUIGrid alignItems="stretch" container spacing={0}>
      {deckComponents.map((component) => (
        <ComponentMapItem
          componentCards={sortedCards.filter((card) => card[component.field_name] > 0)}
          component={component}
          key={component.display_name}
        />
      ))}
    </MUIGrid>
  );
}
