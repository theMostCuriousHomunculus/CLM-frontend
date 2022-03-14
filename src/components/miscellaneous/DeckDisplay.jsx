import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';

import customSort from '../../functions/custom-sort';
import specificCardType from '../../functions/specific-card-type';
import PlaysetDisplay from './PlaysetDisplay';

export default function DeckDisplay({
  add = () => {
    // default: don't do anything
  },
  authorizedID,
  deck,
  remove = () => {
    // default: don't do anything
  },
  toggle = () => {
    // default: don't do anything
  }
}) {
  return (
    <MUIGrid container spacing={0}>
      {['Mainboard', 'Sideboard'].map((component) => (
        <MUIGrid item key={component} xs={12} md={6}>
          <MUICard>
            <MUICardHeader
              title={
                <MUITypography variant="h3">
                  {component} ({deck[component.toLowerCase()].length})
                </MUITypography>
              }
            />
            <MUICardContent>
              {[
                'Land',
                'Creature',
                'Planeswalker',
                'Artifact',
                'Enchantment',
                'Instant',
                'Sorcery'
              ].map(function (type) {
                const group = customSort(deck[component.toLocaleLowerCase()], [
                  'scryfall_card.cmc',
                  'scryfall_card.name',
                  'scryfall_card._set',
                  'scryfall_card.collector_number'
                ]).filter((card) => specificCardType(card.scryfall_card.type_line) === type);
                const condensedGroup = [];

                for (const card of group) {
                  const existingCopies = condensedGroup.find(
                    (abstraction) => abstraction.card._id === card.scryfall_card._id
                  );
                  if (existingCopies) {
                    existingCopies.copies.push(card._id);
                  } else {
                    condensedGroup.push({
                      card: { ...card.scryfall_card },
                      copies: [card._id]
                    });
                  }
                }

                return (
                  group.length > 0 && (
                    <React.Fragment key={`${component}-${type}`}>
                      <MUITypography variant="subtitle1">{`${type} (${group.length})`}</MUITypography>
                      {condensedGroup.map((playset) => (
                        <PlaysetDisplay
                          add={add}
                          authorizedID={authorizedID}
                          component={component.toLowerCase()}
                          key={playset.card._id}
                          playset={playset}
                          remove={remove}
                          toggle={toggle}
                        />
                      ))}
                    </React.Fragment>
                  )
                );
              })}
            </MUICardContent>
          </MUICard>
        </MUIGrid>
      ))}
    </MUIGrid>
  );
}
