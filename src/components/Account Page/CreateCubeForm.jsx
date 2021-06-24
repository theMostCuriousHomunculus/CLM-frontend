import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import useRequest from '../../hooks/request-hook';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';

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
  const cobraID = React.useRef();
  const cubeDescription = React.useRef();
  const cubeName = React.useRef();
  const history = useHistory();
  const { loading, sendRequest } = useRequest();

  async function submitForm (event) {
    event.preventDefault();

    await sendRequest({
      callback: (data) => {
        history.push(`/cube/${data._id}`);
      },
      load: true,
      operation: 'createCube',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  ${cobraID.current.value ? 'cobraID: "' + cobraID + '",\n' : ''}
                  description: "${cubeDescription.current.value}",
                  name: "${cubeName.current.value}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Cube</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form onSubmit={submitForm}>
          <MUIDialogContent style={{ height: 'max-content' }}>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              inputRef={cubeName}
              label="Cube Name"
              margin="dense"
              required={true}
              type="text"
              variant="outlined"
            />

            <MUITextField
              autoComplete="off"
              fullWidth
              inputRef={cubeDescription}
              label="Description"
              margin="dense"
              multiline
              required={false}
              rows={2}
              style={{ marginBottom: '12px', marginTop: '16px' }}
              type="text"
              variant="outlined"
            />

            <MUITypography variant="body1">
              Have an existing cube on CubeCobra?
            </MUITypography>

            <MUITextField
              autoComplete="off"
              fullWidth
              inputRef={cobraID}
              label="24 character ID from cubecobra URL"
              margin="dense"
              required={false}
              style={{ marginTop: '8px' }}
              type="text"
              variant="outlined"
            />
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              Create!
            </MUIButton>
            <WarningButton onClick={toggleOpen}>
              Cancel
            </WarningButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};