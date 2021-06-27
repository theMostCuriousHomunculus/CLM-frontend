import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
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
          color="primary"
          onClick={toggleOpen}
          size="small"
          variant="contained"
        >
          Cancel
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};