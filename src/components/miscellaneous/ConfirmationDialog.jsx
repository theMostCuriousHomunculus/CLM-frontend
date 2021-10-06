import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import WarningButton from './WarningButton';

export default function ConfirmationDialog ({
  children,
  confirmHandler,
  open,
  title,
  toggleOpen
}) {

  return (
    <MUIDialog
      open={open}
      onClose={toggleOpen}
    >
      <MUIDialogTitle>{title}</MUIDialogTitle>
      <MUIDialogContent>
        {children}
      </MUIDialogContent>
      <MUIDialogActions>
        <WarningButton
          onClick={confirmHandler}
        >
          Confirm
        </WarningButton>
        <MUIButton
          autoFocus
          onClick={toggleOpen}
        >
          Cancel
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};