import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';

import { MatchContext } from '../../contexts/match-context';

export default function CountersDialog ({
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
        onSubmit={event => {
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
            margin="dense"
            onChange={event => setCounterType(event.target.value)}
            required={true}
            type="text"
            value={counterType}
            variant="outlined"
          />
          <MUITextField
            autoComplete="off"
            fullWidth
            inputProps={{
              min: 0
            }}
            label="Amount"
            margin="dense"
            onChange={event => setCounterAmount(event.target.value)}
            required={true}
            type="number"
            value={counterAmount}
            variant="outlined"
          />
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton
            color="primary"
            size="small"
            type="submit"
            variant="contained"
          >
            Adjust
          </MUIButton>
        </MUIDialogActions>
      </form>
    </MUIDialog>
  );
};