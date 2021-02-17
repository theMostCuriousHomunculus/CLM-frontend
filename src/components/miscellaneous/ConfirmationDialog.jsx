import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import WarningButton from './WarningButton';

function ConfirmationDialogue (props) {

  const {
    confirmHandler,
    dialogInfo,
    toggleOpen
  } = props;

  return (
    <MUIDialog
      open={!!dialogInfo.data}
      onClose={toggleOpen}
    >
      <MUIDialogTitle>{dialogInfo.title}</MUIDialogTitle>
      <MUIDialogContent>
        {dialogInfo.content}
      </MUIDialogContent>
      <MUIDialogActions style={{ justifyContent: 'space-between' }}>
        <WarningButton onClick={toggleOpen}>
          Cancel
        </WarningButton>
        <MUIButton
          autoFocus
          color="primary"
          onClick={() => {
            confirmHandler(dialogInfo.data);
            toggleOpen();
          }}
          size="small"
          variant="contained"
        >
          Yes
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}

export default ConfirmationDialogue;