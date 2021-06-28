import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import { MatchContext } from '../../contexts/match-context';

export default function CardMenu ({
  rightClickedCard,
  setRightClickedCard
}) {

  const { matchState, changeFaceDownImage, transferCard } = React.useContext(MatchContext);

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

  function handleChangeFaceDownImage (faceDownImage) {
    changeFaceDownImage(rightClickedCard._id, faceDownImage, rightClickedCard.origin);
    setFaceDownImageAnchorEl(null);
    setRightClickedCard({
      _id: null,
      anchorElement: null,
      origin: null,
      visibility: []
    });
  }

  const [faceDownImageAnchorEl, setFaceDownImageAnchorEl] = React.useState();

  return (
    <React.Fragment>
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
        {rightClickedCard.visibility.length < matchState.players.length &&
          <MUIMenuItem onClick={() => handleTransferCard('exile', false, false)}>
            Place Face Down in Exile
          </MUIMenuItem>
        }
        <MUIMenuItem onClick={() => handleTransferCard('exile', true, false)}>
          Place Face Up in Exile
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleTransferCard('graveyard', true, false)}>
          Move to Graveyard
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleTransferCard('hand', true, false)}>
          Reveal and Put in Hand
        </MUIMenuItem>
        {rightClickedCard.visibility.length < matchState.players.length &&
          <MUIMenuItem onClick={() => handleTransferCard('hand', false, false)}>
            Put in Hand Without Revealing
          </MUIMenuItem>
        }
        <MUIMenuItem onClick={() => handleTransferCard('library', true, true)}>
          Reveal and Shuffle into Library
        </MUIMenuItem>
        {rightClickedCard.visibility.length < matchState.players.length &&
          <MUIMenuItem onClick={() => handleTransferCard('library', false, true)}>
            Shuffle into Library Without Revealing
          </MUIMenuItem>
        }
        <MUIMenuItem onClick={() => handleTransferCard('stack', false, false)}>
          Place Face Down on the Stack
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleTransferCard('stack', true, false)}>
          Place Face Up on the Stack
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setFaceDownImageAnchorEl(rightClickedCard.anchorElement);
            setRightClickedCard(prevState => ({
              ...prevState,
              anchorElement: null
            }));
          }}
        >
          Change Face Down Image
        </MUIMenuItem>
      </MUIMenu>

      <MUIMenu
        anchorEl={faceDownImageAnchorEl}
        keepMounted
        open={Boolean(faceDownImageAnchorEl)}
        onClose={() => setFaceDownImageAnchorEl(null)}
        style={{ zIndex: 2147483647 }}
      >
        <MUIMenuItem onClick={() => handleChangeFaceDownImage('foretell')}>
          Foretell
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleChangeFaceDownImage('manifest')}>
          Manifest
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleChangeFaceDownImage('morph')}>
          Morph
        </MUIMenuItem>
        <MUIMenuItem onClick={() => handleChangeFaceDownImage('standard')}>
          Standard
        </MUIMenuItem>
      </MUIMenu>
    </React.Fragment>
  );
};