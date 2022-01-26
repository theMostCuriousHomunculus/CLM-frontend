import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUITextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import { AccountContext } from '../../contexts/account-context';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function CreateCubeForm({ open, toggleOpen }) {
  const classes = useStyles();
  const { loading, createDeck } = React.useContext(AccountContext);
  const [deckID, setDeckID] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [format, setFormat] = React.useState();
  const [name, setName] = React.useState('');

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form
          onSubmit={(event) =>
            createDeck(event, description, deckID, format, name)
          }
        >
          <MUIDialogTitle>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Deck Name"
              margin="none"
              onChange={(event) => setName(event.target.value)}
              required={true}
              type="text"
              value={name}
            />
          </MUIDialogTitle>

          <MUIDialogContent>
            <MUITextField
              autoComplete="off"
              fullWidth
              label="Deck Description"
              multiline
              onChange={(event) => setDescription(event.target.value)}
              required={false}
              rows={2}
              type="text"
              value={description}
            />

            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="format-selector">Format</MUIInputLabel>
              <MUISelect
                fullWidth
                label="Format"
                native
                onChange={(event) => setFormat(event.target.value)}
                value={format}
                inputProps={{
                  id: 'format-selector'
                }}
              >
                <option value={undefined}>Freeform</option>
                <option value="Classy">Classy</option>
                <option value="Legacy">Legacy</option>
                <option value="Modern">Modern</option>
                <option value="Pauper">Pauper</option>
                <option value="Pioneer">Pioneer</option>
                <option value="Standard">Standard</option>
                <option value="Vintage">Vintage</option>
              </MUISelect>
            </MUIFormControl>

            <MUITextField
              autoComplete="off"
              fullWidth
              helperText="https://scryfall.com/@yourName/decks/this-is-your-deck-id-paste-it-here"
              label="Already have a deck on Scryfall.com?"
              onChange={(event) => setDeckID(event.target.value)}
              required={false}
              type="text"
              value={deckID}
            />
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton type="submit" startIcon={<MUICheckCircleOutlinedIcon />}>
              Create!
            </MUIButton>
            <MUIButton
              color="warning"
              onClick={toggleOpen}
              startIcon={<MUICancelOutlinedIcon />}
            >
              Cancel
            </MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
