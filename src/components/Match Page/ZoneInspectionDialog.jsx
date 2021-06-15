import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';

import MagicCard from '../miscellaneous/MagicCard';

export default function ZoneInspectionDialogue (props) {

  const { close, player, setRightClickedCardAnchorElement, setRightClickedCardID, zoneName } = props;
  const validZones = ['battlefield', 'exile', 'graveyard', 'hand', 'library', 'stack', 'temporary'];

  return (
    <MUIDialog
      open={!!zoneName}
      onClose={close}
    >
      <MUIDialogTitle>{player.account.name}'s {zoneName}</MUIDialogTitle>
      <MUIDialogContent style={{ display: 'flex', flexWrap: 'wrap' }}>
        {zoneName && player[zoneName].map(crd => {
          return (
            <MagicCard
              cardData={crd}
              key={crd._id}
              rightClickFunction={(event) => {
                event.preventDefault();
                setRightClickedCardAnchorElement(event.currentTarget);
                setRightClickedCardID(crd._id);
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