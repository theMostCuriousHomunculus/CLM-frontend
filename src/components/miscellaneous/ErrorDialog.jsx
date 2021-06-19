import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIWarningRoundedIcon from '@material-ui/icons/WarningRounded';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';

const useStyles = makeStyles({
  title: {
    '& .MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }
});

export default function ErrorDialog ({
  clearAll,
  clearOne,
  messages
}) {

  const classes = useStyles();

  return (
    <MUIDialog
      open={messages.length > 0}
      onClose={clearAll}
    >
      <MUIDialogTitle className={classes.title}>
        <span>Error</span>
        <MUIWarningRoundedIcon style={{ alignSelf: 'center', color: theme.palette.warning.main, fontSize: 36 }} />
      </MUIDialogTitle>
      <MUIDialogContent>
        <MUIDialogContentText>{messages[0]}</MUIDialogContentText>
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton color="primary" onClick={clearOne} size="small" variant="contained">Dismiss</MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};