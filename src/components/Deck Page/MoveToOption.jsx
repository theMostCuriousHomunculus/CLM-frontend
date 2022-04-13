import React from 'react';
import MUIMenuItem from '@mui/material/MenuItem';

export default function MoveToOption({
  cardCountState,
  component,
  handleChangeNumberOfCopies,
  option,
  scryfall_card,
  setAnchorEl
}) {
  return (
    <MUIMenuItem
      onClick={() => {
        handleChangeNumberOfCopies({
          ...cardCountState[scryfall_card._id],
          [component.field_name]: option.multiple
            ? 0
            : cardCountState[scryfall_card._id][component.field_name] - 1,
          [option.field_name]:
            cardCountState[scryfall_card._id][option.field_name] +
            (option.multiple ? cardCountState[scryfall_card._id][component.field_name] : 1),
          scryfall_id: scryfall_card._id
        });
        setAnchorEl(null);
      }}
    >
      {`Move ${option.multiple ? 'All' : 1} to ${option.display_name}`}
    </MUIMenuItem>
  );
}
