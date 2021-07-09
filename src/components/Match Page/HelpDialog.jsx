import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITypography from '@material-ui/core/Typography';

export default function HelpDialog ({
  close,
  open
}) {

  return (
    <MUIDialog
      open={open}
      onClose={close}
    >
      <MUIDialogTitle>Match Hot Keys</MUIDialogTitle>
      <MUIDialogContent>
        <MUITypography variant="body1">Alt + Shift + C = Concede from game and begin sideboarding.</MUITypography>
        <MUITypography variant="body1">Alt + Shift + D = Draw a card.</MUITypography>
        <MUITypography variant="body1">Alt + Shift + R = Roll dice.</MUITypography>
        <MUITypography variant="body1">Alt + Shift + S = Shuffle your library.</MUITypography>
        <MUITypography variant="body1">Alt + Shift + T = Create tokens.</MUITypography>
        <MUITypography variant="body1">Alt + Shift + U = Untap all your tapped cards on the battlefield.</MUITypography>
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
}