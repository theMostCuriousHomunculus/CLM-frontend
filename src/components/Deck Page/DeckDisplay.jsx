import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';

import customSort from '../../functions/custom-sort';
import specificCardType from '../../functions/specific-card-type';
import HoverPreview from '../miscellaneous/HoverPreview';
import ManaCostSVGs from '../miscellaneous/ManaCostSVGs';
import { DeckContext } from '../../contexts/deck-context';

export default function DeckDisplay () {

  const { deckState } = React.useContext(DeckContext);

  return (
    <div style={{ display: 'flex' }}>
      {['Mainboard', 'Sideboard'].map(component => (
        <MUICard style={{ width: '50%' }}>
          <MUICardHeader title={`${component} (${deckState[component.toLowerCase()].length})`} />
          <MUICardContent>
            {["Land", "Creature", "Planeswalker", "Artifact", "Enchantment", "Instant", "Sorcery"].map(function (type) {
              const group = customSort(deckState[component.toLocaleLowerCase()], ['cmc', 'name'])
                .filter(card => specificCardType(card.type_line) === type);
              const condensedGroup = [];

              for (const card of group) {
                const existingCopies = condensedGroup.find(abstraction => abstraction.card.scryfall_id === card.scryfall_id);
                if (existingCopies) {
                  existingCopies.numberOfCopies++;
                } else {
                  condensedGroup.push({ card, numberOfCopies: 1 });
                }
              }

              return (
                group.length > 0 &&
                <React.Fragment >
                  <MUITypography key={`${component}-${type}`} variant="subtitle1">{`${type} (${group.length})`}</MUITypography>
                  {condensedGroup.map(playset => (
                    <MUITypography key={playset.card._id} variant="body1" style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <HoverPreview back_image={playset.card.back_image} image={playset.card.image}>
                        <span style={{ marginLeft: 16 }}>{`${playset.numberOfCopies}X - ${playset.card.name}`}</span>
                      </HoverPreview>
                      <span>
                        {playset.card.set.toUpperCase()}
                        {playset.card.mana_cost}
                      </span>
                    </MUITypography>
                  ))}
                </React.Fragment>
              );
            })}
          </MUICardContent>
        </MUICard>
      ))}
    </div>
  );
};