import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';

export default function CardMenu ({
  rightClickedCard,
  setRightClickedCard
}) {

  const { userId } = React.useContext(AuthenticationContext);
  const {
    matchState: { players },
    changeFaceDownImage,
    gainControlOfCard,
    revealCard,
    transferCard,
    turnCard,
    viewCard
  } = React.useContext(MatchContext);

  const clearRightClickedCard = React.useCallback(() => {
    setRightClickedCard({
      _id: null,
      anchorElement: null,
      controller: null,
      face_down: null,
      origin: null,
      owner: null,
      visibility: []
    })
  }, [setRightClickedCard]);

  function handleChangeFaceDownImage (faceDownImage) {
    changeFaceDownImage(rightClickedCard._id, faceDownImage, rightClickedCard.origin);
    setFaceDownImageAnchorEl(null);
    clearRightClickedCard();
  }

  function handleGainControlOfCard () {
    gainControlOfCard(rightClickedCard._id, rightClickedCard.controller, rightClickedCard.origin);
    clearRightClickedCard();
  }

  function handleRevealCard () {
    revealCard(rightClickedCard._id, rightClickedCard.origin);
    clearRightClickedCard();
  }

  function handleTransferCard (destinationZone, reveal, shuffle, index) {
    transferCard(
      rightClickedCard._id,
      destinationZone,
      rightClickedCard.origin,
      reveal,
      shuffle,
      index
    );
    setMoveToAnchorEl(null);
    clearRightClickedCard();
  }

  function handleTurnCard () {
    turnCard(rightClickedCard._id, rightClickedCard.origin);
    clearRightClickedCard();
  }

  function handleViewCard () {
    viewCard(rightClickedCard._id, rightClickedCard.controller, rightClickedCard.origin);
    clearRightClickedCard();
  }

  const [faceDownImageAnchorEl, setFaceDownImageAnchorEl] = React.useState();
  const [moveToAnchorEl, setMoveToAnchorEl] = React.useState();

  return (
    <React.Fragment>
      <MUIMenu
        anchorEl={rightClickedCard.anchorElement}
        keepMounted
        open={Boolean(rightClickedCard.anchorElement)}
        onClose={() => setRightClickedCard(prevState => ({
          ...prevState,
          anchorElement: null
        }))}
        style={{ zIndex: 2147483647 }}
      >
        <MUIMenuItem
          onClick={() => {
            setMoveToAnchorEl(rightClickedCard.anchorElement);
            setRightClickedCard(prevState => ({
              ...prevState,
              anchorElement: null
            }));
          }}
        >
          Move Card to...
        </MUIMenuItem>
        {/**/}
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
        <MUIMenuItem onClick={handleTurnCard}>
          {rightClickedCard.face_down ? "Turn Face-Up" : "Turn Face-Down"}
        </MUIMenuItem>
        {rightClickedCard.visibility.length < players.length &&
          rightClickedCard.controller === userId &&
          <MUIMenuItem onClick={handleRevealCard}>
            Reveal Card
          </MUIMenuItem>
        }
        {!rightClickedCard.visibility.map(plr => plr._id).includes(userId) &&
          <MUIMenuItem onClick={handleViewCard}>
            View Card
          </MUIMenuItem>
        }
        {rightClickedCard.controller !== userId &&
          <MUIMenuItem onClick={handleGainControlOfCard}>
            Gain Control of Card
          </MUIMenuItem>
        }
      </MUIMenu>

      <MUIMenu
        anchorEl={moveToAnchorEl}
        keepMounted
        open={Boolean(moveToAnchorEl)}
        onClose={() => setMoveToAnchorEl(null)}
        style={{ zIndex: 2147483647 }}
      >
        {rightClickedCard.origin !== 'battlefield' &&
          <MUIMenuItem onClick={() => handleTransferCard('battlefield', false, false)}>
            Move to Battlefield
          </MUIMenuItem>
        }
        {rightClickedCard.origin !== 'exile' &&
          <MUIMenuItem onClick={() => handleTransferCard('exile', false, false)}>
            Move to Exile
          </MUIMenuItem>
        }
        {rightClickedCard.origin !== 'graveyard' &&
          <MUIMenuItem onClick={() => handleTransferCard('graveyard', true, false)}>
            Move to Graveyard
          </MUIMenuItem>
        }
        {rightClickedCard.origin !== 'hand' &&
          <MUIMenuItem onClick={() => handleTransferCard('hand', false, false)}>
            Move to Hand
          </MUIMenuItem>
        }
        {rightClickedCard.origin !== 'stack' &&
          <MUIMenuItem onClick={() => handleTransferCard('stack', false, false)}>
            Put on the Stack
          </MUIMenuItem>
        }
        <MUIMenuItem onClick={() => handleTransferCard('library', false, true)}>
          Shuffle Into Library
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