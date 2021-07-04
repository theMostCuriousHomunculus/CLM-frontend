import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIInputLabel from '@material-ui/core/InputLabel';
import MUISelect from '@material-ui/core/Select';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AccountContext } from '../../contexts/account-context';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function CreateCubeForm ({
  open,
  toggleOpen
}) {

  const classes = useStyles();
  const { loading, createDeck } = React.useContext(AccountContext);
  const [description, setDescription] = React.useState('');
  const [format, setFormat] = React.useState();
  const [name, setName] = React.useState('');

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Cube</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form onSubmit={event => createDeck(event, description, format, name)}>
          <MUIDialogContent style={{ height: 'max-content' }}>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Deck Name"
              margin="dense"
              onChange={event => setName(event.target.value)}
              required={true}
              type="text"
              value={name}
              variant="outlined"
            />

            <MUITextField
              autoComplete="off"
              fullWidth
              label="Deck Description"
              margin="dense"
              multiline
              onChange={event => setDescription(event.target.value)}
              required={false}
              rows={2}
              style={{ marginBottom: '12px', marginTop: '16px' }}
              type="text"
              value={description}
              variant="outlined"
            />

            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="format-selector">Format</MUIInputLabel>
              <MUISelect
                fullWidth
                label="Format"
                margin="dense"
                native
                onChange={event => setFormat(event.target.value)}
                value={format}
                variant="outlined"
                inputProps={{
                  id: 'format-selector'
                }}
              >
                <option value={undefined}>Freeform</option>
                <option value="Legacy">Legacy</option>
                <option value="Modern">Modern</option>
                <option value="Pauper">Pauper</option>
                <option value="Pioneer">Pioneer</option>
                <option value="Standard">Standard</option>
                <option value="Vintage">Vintage</option>
              </MUISelect>
            </MUIFormControl>
          </MUIDialogContent>
          <MUIDialogActions>
            <WarningButton onClick={toggleOpen}>
              Cancel
            </WarningButton>
            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              Create!
            </MUIButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};