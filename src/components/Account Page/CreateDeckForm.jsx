import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUICloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIPostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import MUISelect from '@mui/material/Select';
import MUITextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import createDeck from '../../graphql/mutations/deck/create-deck';
import { ErrorContext } from '../../contexts/Error';

export default function CreateCubeForm({ open, toggleOpen }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const [existingListID, setExistingListID] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState();
  const [name, setName] = useState('');
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <form
        name="create-deck-form"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            setPosting(true);
            const data = await createDeck({
              queryString: `{
                _id
              }`,
              variables: { description, existingListID, format, name }
            });
            setSuccess(true);
            setTimeout(() => {
              navigate(`/deck/${data.data.createDeck._id}`);
            }, 1000);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          } finally {
            setPosting(false);
          }
        }}
      >
        <MUIDialogTitle>
          <MUITextField
            autoComplete="off"
            autoFocus
            disabled={posting || success}
            fullWidth
            label="Deck Name"
            onChange={(event) => setName(event.target.value)}
            required={true}
            type="text"
            value={name}
          />
        </MUIDialogTitle>

        <MUIDialogContent>
          <MUITextField
            autoComplete="off"
            disabled={posting || success}
            fullWidth
            label="Deck Description"
            margin="normal"
            multiline
            onChange={(event) => setDescription(event.target.value)}
            required={false}
            rows={2}
            type="text"
            value={description}
          />

          <MUIFormControl margin="normal" variant="outlined">
            <MUIInputLabel htmlFor="format-selector">Format</MUIInputLabel>
            <MUISelect
              disabled={posting || success}
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
            disabled={posting || success}
            fullWidth
            helperText="https://scryfall.com/@yourName/decks/this-is-your-deck-id-paste-it-here"
            label="Already have a deck on Scryfall.com?"
            margin="normal"
            onChange={(event) => setExistingListID(event.target.value)}
            required={false}
            type="text"
            value={existingListID}
          />
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton
            color={success ? 'success' : 'primary'}
            disabled={posting}
            startIcon={(() => {
              if (posting) {
                return (
                  <MUICircularProgress size={13} style={{ color: 'inherit' }} />
                );
              }
              if (success) {
                return <MUICloudDoneOutlinedIcon />;
              }
              return <MUIPostAddOutlinedIcon />;
            })()}
            type="submit"
          >
            Create
          </MUIButton>
          <MUIButton
            color="warning"
            disabled={posting || success}
            onClick={toggleOpen}
            startIcon={<MUICancelOutlinedIcon />}
          >
            Cancel
          </MUIButton>
        </MUIDialogActions>
      </form>
    </MUIDialog>
  );
}
