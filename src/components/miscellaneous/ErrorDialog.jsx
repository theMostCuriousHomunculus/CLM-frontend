import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogContentText from '@mui/material/DialogContentText';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIWarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { makeStyles } from '@mui/styles';

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
        <MUIButton onClick={clearOne}>
          Dismiss
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};