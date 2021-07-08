import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';

import MagicCard from '../miscellaneous/MagicCard';

export default function ZoneInspectionDialogue ({
  close,
  player,
  setRightClickedCard,
  zoneName
}) {

  return (
    <MUIDialog
      open={!!zoneName}
      onClose={close}
    >
      <MUIDialogTitle>{player.account.name}'s {zoneName + (zoneName === 'temporary' ? ' zone' : '')}</MUIDialogTitle>
      <MUIDialogContent style={{ display: 'flex', flexWrap: 'wrap' }}>
        {zoneName && player[zoneName].map(card => {
          return (
            <MagicCard
              cardData={card}
              key={card._id}
              rightClickFunction={(event) => {
                event.preventDefault();
                setRightClickedCard({
                  _id: card._id,
                  anchorElement: event.currentTarget,
                  controller: card.controller._id,
                  face_down: card.face_down,
                  isCopyToken: card.isCopyToken,
                  origin: zoneName,
                  owner: card.owner._id,
                  tokens: card.tokens,
                  visibility: card.visibility
                });
              }}
            />
          );
        })}
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton
          autoFocus
          color="primary"
          onClick={close}
          size="small"
          variant="contained"
        >
          Back To Match
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};