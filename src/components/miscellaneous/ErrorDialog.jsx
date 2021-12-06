import React, { useContext } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogContentText from '@mui/material/DialogContentText';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIWarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import { ErrorContext } from '../../contexts/Error';

const useStyles = makeStyles({
  title: {
    '& .MuiTypography-root': {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }
});

export default function ErrorDialog() {
  const classes = useStyles();
  const { errorMessages, setErrorMessages } = useContext(ErrorContext);

  return (
    <MUIDialog
      open={errorMessages.length > 0}
      onClose={() => setErrorMessages([])}
    >
      <MUIDialogTitle className={classes.title}>
        <span>Error</span>
        <MUIWarningRoundedIcon
          style={{
            alignSelf: 'center',
            color: theme.palette.warning.main,
            fontSize: 36
          }}
        />
      </MUIDialogTitle>
      <MUIDialogContent>
        <MUIDialogContentText>{errorMessages[0]}</MUIDialogContentText>
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton
          onClick={() =>
            setErrorMessages((prevState) =>
              prevState.slice(0, prevState.length - 1)
            )
          }
        >
          Dismiss
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
