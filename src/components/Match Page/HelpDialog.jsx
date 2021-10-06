import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITypography from '@mui/material/Typography';

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
          onClick={close}
        >
          Back To Match
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}