import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUICloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import MUIDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIRestorePageOutlinedIcon from '@mui/icons-material/RestorePageOutlined';
import MUITypography from '@mui/material/Typography';
import { useNavigate, useParams } from 'react-router-dom';

import deleteDeck from '../graphql/mutations/deck/delete-deck';
import { AccountContext } from '../contexts/account-context';
import { AuthenticationContext } from '../contexts/Authentication';
import { ErrorContext } from '../contexts/Error';

export default function DeleteDeckForm({ deckToDelete, setDeckToDelete }) {
  const { setAccountState } = useContext(AccountContext);
  const { userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const { accountID, deckID } = useParams();
  const [deleting, setDeleting] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <MUIDialog open={!!deckToDelete._id} onClose={() => setDeckToDelete({ _id: null, name: null })}>
      <form
        name="delete-deck-form"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            setDeleting(true);
            const data = await deleteDeck({
              headers: { DeckID: deckToDelete._id },
              queryString: '{\n_id\n}'
            });
            setSuccess(true);
            if (accountID) {
              setAccountState((prevState) => ({
                ...prevState,
                decks: prevState.decks.filter((deck) => deck._id !== data.data.deleteDeck._id)
              }));
            }
            setTimeout(() => {
              setDeckToDelete({ _id: null, name: null });
              if (deckID) {
                navigate(`/account/${userID}`);
              }
              setSuccess(false);
            }, 1000);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          } finally {
            setDeleting(false);
          }
        }}
      >
        <MUIDialogTitle>{`Are you sure you want to delete "${deckToDelete.name}"?`}</MUIDialogTitle>
        <MUIDialogContent>
          <MUITypography variant="body1">
            {'This action cannot be undone. You may want to export your list first.'}
          </MUITypography>
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton
            color={success ? 'success' : 'warning'}
            disabled={deleting}
            startIcon={(() => {
              if (deleting) {
                return <MUICircularProgress size={13} style={{ color: 'inherit' }} />;
              }
              if (success) {
                return <MUICloudDoneOutlinedIcon />;
              }
              return <MUIDeleteForeverOutlinedIcon />;
            })()}
            type="submit"
          >
            Confirm
          </MUIButton>
          <MUIButton
            autoFocus
            disabled={deleting || success}
            onClick={() => setDeckToDelete({ _id: null, name: null })}
            startIcon={<MUIRestorePageOutlinedIcon />}
          >
            Cancel
          </MUIButton>
        </MUIDialogActions>
      </form>
    </MUIDialog>
  );
}
