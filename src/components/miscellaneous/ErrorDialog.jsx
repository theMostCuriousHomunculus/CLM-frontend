import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';

export default function (props) {

  const { clearError, errorMessage } = props;

  return (
    <MUIDialog
      open={!!errorMessage}
      onClose={clearError}
    >
      <MUIDialogTitle>Error</MUIDialogTitle>
      <MUIDialogContent>
        <MUIDialogContentText>{errorMessage}</MUIDialogContentText>
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton color="primary" onClick={clearError} variant="contained">Try Again</MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};