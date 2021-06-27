import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import { MatchContext } from '../../contexts/match-context';

export default function CardMenu ({
  rightClickedCard,
  setRightClickedCard
}) {

  const { transferCard } = React.useContext(MatchContext);

  function handleTransferCard (destinationZone, reveal, shuffle, index) {
    transferCard(
      rightClickedCard._id,
      destinationZone,
      rightClickedCard.origin,
      reveal,
      shuffle,
      index
    );
    setRightClickedCard({
      _id: null,
      anchorElement: null,
      origin: null,
      visibility: []
    });
  }

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
      <MUIMenuItem onClick={() => handleTransferCard('battlefield', false, false)}>
        Place Face Down on Battlefield
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('battlefield', true, false)}>
        Place Face Up on Battlefield
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('exile', false, false)}>
        Place Face Down in Exile
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('exile', true, false)}>
        Place Face Up in Exile
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('graveyard', true, false)}>
        Move to Graveyard
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('hand', true, false)}>
        Reveal and Put in Hand
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('hand', false, false)}>
        Put in Hand Without Revealing
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('library', true, true)}>
        Reveal and Shuffle into Library
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('library', false, true)}>
        Shuffle into Library Without Revealing
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('stack', false, false)}>
        Place Face Down on the Stack
      </MUIMenuItem>
      <MUIMenuItem onClick={() => handleTransferCard('stack', true, false)}>
        Place Face Up on the Stack
      </MUIMenuItem>
    </MUIMenu>
  );
};