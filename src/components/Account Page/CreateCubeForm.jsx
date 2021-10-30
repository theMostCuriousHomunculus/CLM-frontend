import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

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

export default function CreateCubeForm({ open, toggleOpen }) {
  const classes = useStyles();
  const { loading, createCube } = React.useContext(AccountContext);
  const [cobraID, setCobraID] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Cube</MUIDialogTitle>
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form
          onSubmit={(event) => createCube(event, cobraID, description, name)}
        >
          <MUIDialogContent style={{ height: 'max-content' }}>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Cube Name"
              onChange={(event) => setName(event.target.value)}
              required={true}
              type="text"
              value={name}
            />

            <MUITextField
              autoComplete="off"
              fullWidth
              label="Cube Description"
              multiline
              onChange={(event) => setDescription(event.target.value)}
              required={false}
              rows={2}
              style={{ marginBottom: '12px', marginTop: '16px' }}
              type="text"
              value={description}
            />

            <MUITypography variant="body1">
              Have an existing cube on CubeCobra?
            </MUITypography>

            <MUITextField
              autoComplete="off"
              fullWidth
              label="24 character ID from cubecobra URL"
              onChange={(event) => setCobraID(event.target.value)}
              required={false}
              style={{ marginTop: '8px' }}
              type="text"
              value={cobraID}
            />
          </MUIDialogContent>
          <MUIDialogActions>
            <WarningButton onClick={toggleOpen}>Cancel</WarningButton>
            <MUIButton type="submit">Create!</MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
