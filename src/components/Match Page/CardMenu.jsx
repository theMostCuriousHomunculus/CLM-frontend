import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

export default function CardMenu ({
  handleTransferCard,
  rightClickedCard,
  setRightClickedCard
}) {

  return (
    <MUIMenu
      anchorEl={rightClickedCard.anchorElement}
      keepMounted
      open={Boolean(rightClickedCard.anchorElement)}
      onClose={() => setRightClickedCard({
        _id: null,
        anchorElement: null,
        origin: null,
        visibility: []
      })}
      style={{ zIndex: 2147483647 }}
    >
      <MUIMenuItem onClick={() => handleTransferCard('battlefield', null, false, false)}>
        Place Face Down on Battlefield
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('battlefield', null, true, false)}>
        Place Face Up on Battlefield
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('exile', null, false, false)}>
        Place Face Down in Exile
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('exile', null, true, false)}>
        Place Face Up in Exile
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('graveyard', null, true, false)}>
        Move to Graveyard
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('hand', null, true, false)}>
        Reveal and Put in Hand
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('hand', null, false, false)}>
        Put in Hand Without Revealing
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('library', null, true, true)}>
        Reveal and Shuffle into Library
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('library', null, false, true)}>
        Shuffle into Library Without Revealing
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('stack', null, false, false)}>
        Place Face Down on the Stack
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('stack', null, true, false)}>
        Place Face Up on the Stack
      </MUIMenuItem>
    </MUIMenu>
  );
};