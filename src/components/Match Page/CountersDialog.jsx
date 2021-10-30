import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITextField from '@mui/material/TextField';

import { MatchContext } from '../../contexts/match-context';

export default function CountersDialog({
  cardID,
  cardName,
  close,
  open,
  zone
}) {
  const { adjustCounters } = React.useContext(MatchContext);
  const [counterType, setCounterType] = React.useState();
  const [counterAmount, setCounterAmount] = React.useState(0);

  return (
    <MUIDialog onClose={close} open={open}>
      <MUIDialogTitle>{`Adjust Counters on ${cardName}`}</MUIDialogTitle>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          adjustCounters(cardID, counterAmount, counterType, zone);
          close();
        }}
      >
        <MUIDialogContent>
          <MUITextField
            autoComplete="off"
            autoFocus
            fullWidth
            label="Type"
            onChange={(event) => setCounterType(event.target.value)}
            required={true}
            type="text"
            value={counterType}
          />
          <MUITextField
            autoComplete="off"
            fullWidth
            inputProps={{
              min: 0
            }}
            label="Amount"
            onChange={(event) => setCounterAmount(event.target.value)}
            required={true}
            type="number"
            value={counterAmount}
          />
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton type="submit">Adjust</MUIButton>
        </MUIDialogActions>
      </form>
    </MUIDialog>
  );
}
