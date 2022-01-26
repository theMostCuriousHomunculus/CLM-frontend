import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';

export default function ConfirmationDialog({
  children,
  confirmHandler,
  open,
  title,
  toggleOpen
}) {
  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>{title}</MUIDialogTitle>
      <MUIDialogContent>{children}</MUIDialogContent>
      <MUIDialogActions>
        <MUIButton color="warning" onClick={confirmHandler}>
          Confirm
        </MUIButton>
        <MUIButton autoFocus onClick={toggleOpen}>
          Cancel
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
