import React from 'react';
import MUITypography from '@mui/material/Typography';

import BasicLandAdder from '../miscellaneous/BasicLandAdder';
import SortableList from './SortableList';

export default function PicksDisplay ({
  addBasics,
  onSortEnd,
  player
}) {

  return (
    <React.Fragment>
      <MUITypography variant="h3">Add Basic Lands to Your Deck</MUITypography>
      <MUITypography variant="subtitle1">Pro Tip: add a few extra basics and move them to your sideboard!</MUITypography>
      <BasicLandAdder submitFunction={addBasics} />

      <MUITypography variant="h3">Mainboard</MUITypography>
      <MUITypography variant="subtitle1">The Crème de la Crème</MUITypography>
      <SortableList
        axis="xy"
        cards={player.mainboard}
        distance={2}
        fromCollection={"mainboard"}
        onSortEnd={onSortEnd}
      >
      </SortableList>

      <MUITypography variant="h3">Sideboard</MUITypography>
      <MUITypography variant="subtitle1">The Cal Naughton, Jrs of cube cards</MUITypography>
      <SortableList
        axis="xy"
        cards={player.sideboard}
        distance={2}
        fromCollection={"sideboard"}
        onSortEnd={onSortEnd}
      >
      </SortableList>
    </React.Fragment>
  );
};