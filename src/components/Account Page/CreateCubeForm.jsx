import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
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
  const { loading, createCube } = React.useContext(AccountContext);
  const [cobraID, setCobraID] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [name, setName] = React.useState('');

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Cube</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form onSubmit={event => createCube(event, cobraID, description, name)}>
          <MUIDialogContent style={{ height: 'max-content' }}>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Cube Name"
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
              label="Cube Description"
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

            <MUITypography variant="body1">
              Have an existing cube on CubeCobra?
            </MUITypography>

            <MUITextField
              autoComplete="off"
              fullWidth
              label="24 character ID from cubecobra URL"
              margin="dense"
              onChange={event => setCobraID(event.target.value)}
              required={false}
              style={{ marginTop: '8px' }}
              type="text"
              value={cobraID}
              variant="outlined"
            />
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