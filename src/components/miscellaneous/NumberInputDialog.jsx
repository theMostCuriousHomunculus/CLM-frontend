import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITextField from '@mui/material/TextField';

export default function NumberInputDialogue({
  buttonText,
  close,
  defaultValue,
  inputLabel,
  title,
  updateFunction
}) {
  const valueRef = React.useRef();

  return (
    <MUIDialog open={Number.isInteger(defaultValue)} onClose={close}>
      <MUIDialogTitle>{title}</MUIDialogTitle>
      <MUIDialogContent>
        <MUITextField
          autoFocus
          defaultValue={defaultValue}
          fullWidth
          inputRef={valueRef}
          label={inputLabel}
          type="number"
        />
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton
          color="warning"
          onClick={close}
          startIcon={<MUICancelOutlinedIcon />}
        >
          Cancel
        </MUIButton>
        <MUIButton
          autoFocus
          onClick={() => {
            updateFunction(valueRef.current.value);
            close();
          }}
        >
          {buttonText}
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
