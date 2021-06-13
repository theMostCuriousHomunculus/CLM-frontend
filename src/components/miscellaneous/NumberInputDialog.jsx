import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';

import WarningButton from './WarningButton';

export default function NumberInputDialogue (props) {

  const {
    close,
    inputName,
    defaultValue,
    updateFunction
  } = props;
  const valueRef = React.useRef();

  return (
    <MUIDialog
      open={!!inputName}
      onClose={close}
    >
      <MUIDialogTitle>Update Your {inputName}</MUIDialogTitle>
      <MUIDialogContent>
        <MUITextField
          autoFocus
          defaultValue={defaultValue}
          fullWidth
          inputRef={valueRef}
          label={inputName}
          margin="dense"
          type="number"
          variant="outlined"
        />
      </MUIDialogContent>
      <MUIDialogActions style={{ justifyContent: 'space-between' }}>
        <WarningButton onClick={close}>
          Cancel
        </WarningButton>
        <MUIButton
          autoFocus
          color="primary"
          onClick={() => {
            updateFunction(valueRef.current.value);
            close();
          }}
          size="small"
          variant="contained"
        >
          Update
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};