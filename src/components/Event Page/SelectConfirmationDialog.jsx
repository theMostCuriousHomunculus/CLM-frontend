import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  cardImage: {
    height: 300
  },
  dialogueContent: {
    display: 'flex',
    justifyContent: 'center'
  }
});

const SelectConfirmationDialogue = (props) => {

  const classes = useStyles();

  return (
    <MUIDialog
      open={props.open}
      onClose={props.toggleOpen}
    >
      <MUIDialogTitle>{`Are you sure you want to draft ${props.card ? props.card.name : null}?`}</MUIDialogTitle>
      <MUIDialogContent className={classes.dialogueContent}>
        <img alt={props.card ? props.card.name : null} className={classes.cardImage} src={props.card ? props.card.image : null} />
        {props.card && props.card.back_image &&
          <img alt={props.card.name} className={classes.cardImage} src={props.card.back_image} />
        }
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton
          autoFocus
          color="primary"
          onClick={() => {
            props.toggleOpen();
            props.selectCardHandler(props.card ? props.card._id : null);
          }}
          size="small"
          variant="contained"
        >
          Yes
        </MUIButton>
        <MUIButton onClick={props.toggleOpen} color="primary" size="small" variant="contained">
          No
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}

export default SelectConfirmationDialogue;