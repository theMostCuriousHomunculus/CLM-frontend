import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
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
  const { loading, createCube } = React.useContext(AccountContext);
  const [cobraID, setCobraID] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form
          onSubmit={(event) => createCube(event, cobraID, description, name)}
        >
          <MUIDialogTitle>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Cube Name"
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
              label="Cube Description"
              multiline
              onChange={(event) => setDescription(event.target.value)}
              required={false}
              rows={2}
              type="text"
              value={description}
            />

            <MUITextField
              autoComplete="off"
              fullWidth
              helperText="https://cubecobra.com/cube/overview/this-is-your-full-cube-id-paste-it-here"
              label="Have a cube on CubeCobra.com?"
              onChange={(event) => setCobraID(event.target.value)}
              required={false}
              type="text"
              value={cobraID}
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
