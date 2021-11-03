import React from 'react';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';

import CountersDialog from './CountersDialog';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';

export default function CardMenu({ rightClickedCard, setRightClickedCard }) {
  const { userID } = React.useContext(AuthenticationContext);
  const {
    matchState: { players },
    setNumberInputDialogInfo,
    changeFaceDownImage,
    createCopies,
    destroyCopyToken,
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
      isCopyToken: null,
      name: null,
      origin: null,
      owner: null,
      visibility: []
    });
  }, [setRightClickedCard]);

  function handleChangeFaceDownImage(faceDownImage) {
    changeFaceDownImage(
      rightClickedCard._id,
      faceDownImage,
      rightClickedCard.origin
    );
    setFaceDownImageAnchorEl(null);
    clearRightClickedCard();
  }

  function handleCreateCopies() {
    setRightClickedCard((prevState) => ({
      ...prevState,
      anchorElement: null
    }));
    setNumberInputDialogInfo({
      buttonText: 'Create Copies!',
      defaultValue: 1,
      inputLabel: 'Number of Copies',
      title: `Create Copies of ${rightClickedCard.name}`,
      updateFunction: (value) => {
        createCopies(
          rightClickedCard._id,
          rightClickedCard.controller,
          value,
          rightClickedCard.origin
        );
        clearRightClickedCard();
      }
    });
  }

  function handleTransferCard(destinationZone, reveal, shuffle, index) {
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

  const [counterDialogOpen, setCounterDialogOpen] = React.useState(false);
  const [faceDownImageAnchorEl, setFaceDownImageAnchorEl] = React.useState();
  const [moveToAnchorEl, setMoveToAnchorEl] = React.useState();

  return (
    <React.Fragment>
      <CountersDialog
        cardID={rightClickedCard._id}
        cardName={rightClickedCard.name}
        close={() => {
          clearRightClickedCard();
          setCounterDialogOpen(false);
        }}
        open={counterDialogOpen}
        zone={rightClickedCard.origin}
      />

      <MUIMenu
        anchorEl={rightClickedCard.anchorElement}
        keepMounted
        open={Boolean(rightClickedCard.anchorElement)}
        onClose={() =>
          setRightClickedCard((prevState) => ({
            ...prevState,
            anchorElement: null
          }))
        }
        style={{ zIndex: 2147483647 }}
      >
        {rightClickedCard.controller === userID && (
          <React.Fragment>
            <MUIMenuItem
              onClick={() => {
                setMoveToAnchorEl(rightClickedCard.anchorElement);
                setRightClickedCard((prevState) => ({
                  ...prevState,
                  anchorElement: null
                }));
              }}
            >
              Move Card to...
            </MUIMenuItem>
            <MUIMenuItem
              onClick={() => {
                setCounterDialogOpen(true);
                setRightClickedCard((prevState) => ({
                  ...prevState,
                  anchorElement: null
                }));
              }}
            >
              Adjust Counters
            </MUIMenuItem>
            {['battlefield', 'stack'].includes(rightClickedCard.origin) && (
              <MUIMenuItem onClick={handleCreateCopies}>
                Create Copies
              </MUIMenuItem>
            )}
            {/**/}
            <MUIMenuItem
              onClick={() => {
                setFaceDownImageAnchorEl(rightClickedCard.anchorElement);
                setRightClickedCard((prevState) => ({
                  ...prevState,
                  anchorElement: null
                }));
              }}
            >
              Change Face Down Image
            </MUIMenuItem>
            <MUIMenuItem
              onClick={() => {
                turnCard(rightClickedCard._id, rightClickedCard.origin);
                clearRightClickedCard();
              }}
            >
              {rightClickedCard.face_down ? 'Turn Face-Up' : 'Turn Face-Down'}
            </MUIMenuItem>
            {rightClickedCard.visibility.length < players.length && (
              <MUIMenuItem
                onClick={() => {
                  revealCard(rightClickedCard._id, rightClickedCard.origin);
                  clearRightClickedCard();
                }}
              >
                Reveal Card
              </MUIMenuItem>
            )}
            {rightClickedCard.isCopyToken && (
              <MUIMenuItem
                onClick={() => {
                  destroyCopyToken(
                    rightClickedCard._id,
                    rightClickedCard.origin
                  );
                  clearRightClickedCard();
                }}
              >
                Destroy Copy/Token
              </MUIMenuItem>
            )}
          </React.Fragment>
        )}
        {!rightClickedCard.visibility
          .map((plr) => plr._id)
          .includes(userID) && (
          <MUIMenuItem
            onClick={() => {
              viewCard(
                rightClickedCard._id,
                rightClickedCard.controller,
                rightClickedCard.origin
              );
              clearRightClickedCard();
            }}
          >
            View Card
          </MUIMenuItem>
        )}
        {rightClickedCard.controller !== userID && (
          <MUIMenuItem
            onClick={() => {
              gainControlOfCard(
                rightClickedCard._id,
                rightClickedCard.controller,
                rightClickedCard.origin
              );
              clearRightClickedCard();
            }}
          >
            Gain Control of Card
          </MUIMenuItem>
        )}
      </MUIMenu>

      <MUIMenu
        anchorEl={moveToAnchorEl}
        keepMounted
        open={Boolean(moveToAnchorEl)}
        onClose={() => setMoveToAnchorEl(null)}
        style={{ zIndex: 2147483647 }}
      >
        {rightClickedCard.origin !== 'battlefield' && (
          <MUIMenuItem
            onClick={() => handleTransferCard('battlefield', false, false)}
          >
            Move to Battlefield
          </MUIMenuItem>
        )}
        {rightClickedCard.origin !== 'exile' && (
          <MUIMenuItem
            onClick={() => handleTransferCard('exile', false, false)}
          >
            Move to Exile
          </MUIMenuItem>
        )}
        {rightClickedCard.origin !== 'graveyard' && (
          <MUIMenuItem
            onClick={() => handleTransferCard('graveyard', true, false)}
          >
            Move to Graveyard
          </MUIMenuItem>
        )}
        {rightClickedCard.origin !== 'hand' && (
          <MUIMenuItem onClick={() => handleTransferCard('hand', false, false)}>
            Move to Hand
          </MUIMenuItem>
        )}
        {rightClickedCard.origin !== 'stack' && (
          <MUIMenuItem
            onClick={() => handleTransferCard('stack', false, false)}
          >
            Put on the Stack
          </MUIMenuItem>
        )}
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
}
