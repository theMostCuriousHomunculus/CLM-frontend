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
  add,
  authorizedID,
  deck,
  remove,
  toggle
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
                  'cmc',
                  'name',
                  'set'
                ]).filter((card) => specificCardType(card.type_line) === type);
                const condensedGroup = [];

                for (const card of group) {
                  const existingCopies = condensedGroup.find(
                    (abstraction) =>
                      abstraction.card.scryfall_id === card.scryfall_id
                  );
                  if (existingCopies) {
                    existingCopies.copies.push(card._id);
                  } else {
                    condensedGroup.push({
                      card: {
                        back_image: card.back_image,
                        cmc: card.cmc,
                        collector_number: card.collector_number,
                        color_identity: card.color_identity,
                        image: card.image,
                        keywords: card.keywords,
                        mana_cost: card.mana_cost,
                        mtgo_id: card.mtgo_id,
                        name: card.name,
                        oracle_id: card.oracle_id,
                        scryfall_id: card.scryfall_id,
                        set: card.set,
                        set_name: card.set_name,
                        tcgplayer_id: card.tcgplayer_id,
                        type_line: card.type_line
                      },
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
                          key={playset.card.scryfall_id}
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
