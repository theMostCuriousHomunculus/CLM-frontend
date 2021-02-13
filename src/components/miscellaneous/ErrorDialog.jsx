import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIWarningRoundedIcon from '@material-ui/icons/WarningRounded';

import theme from '../../theme';

const ErrorDialog = function (props) {

  const { clear, message } = props;

  return (
    <MUIDialog
      open={!!message}
      onClose={clear}
    >
      <MUIDialogTitle>
        <MUIWarningRoundedIcon style={{ color: theme.palette.warning.main, fontSize: 40 }} />
        <span>Error</span>
      </MUIDialogTitle>
      <MUIDialogContent>
        <MUIDialogContentText>{message}</MUIDialogContentText>
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton color="primary" onClick={clear} variant="contained">Dismiss</MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};

export default ErrorDialog;