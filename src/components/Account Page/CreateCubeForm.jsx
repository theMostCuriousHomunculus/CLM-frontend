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

import ErrorDialog from '../miscellaneous/ErrorDialog';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { createCube } from '../../requests/cube-requests';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

const CreateCubeForm = function (props) {

  const { open, toggleOpen } = props;

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cobraId = React.useRef();
  const cubeDescription = React.useRef();
  const cubeName = React.useRef();
  const [errorMessage, setErrorMessage] = React.useState();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);

  async function submitForm (event) {
    event.preventDefault();

    const cubeDetails = {
      cobraId: cobraId.current.value,
      description: cubeDescription.current.value,
      name: cubeName.current.value
    };

    try {
      setLoading(true);
      const responseData = await createCube(cubeDetails, authentication.token);
      setLoading(false);
      history.push(`/cube/${responseData._id}`);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />
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
                inputRef={cobraId}
                label="24 character ID from cubecobra URL"
                margin="dense"
                required={false}
                style={{ marginTop: '8px' }}
                type="text"
                variant="outlined"
              />
            </MUIDialogContent>
            <MUIDialogActions>
              <WarningButton
                onClick={toggleOpen}
              >
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
    </React.Fragment>
  );
};

export default CreateCubeForm;