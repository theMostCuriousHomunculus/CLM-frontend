import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';

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
          onClick={close}
        >
          Back To Match
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};