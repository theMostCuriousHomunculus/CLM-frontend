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
import { useRequest } from '../../hooks/request-hook';

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
  const [errorMessage, setErrorMessage] = React.useState();
  const history = useHistory();
  const { loading, sendRequest } = useRequest();

  const cobraId = React.useRef();
  const cubeDescription = React.useRef();
  const cubeName = React.useRef();

  async function submitForm (event) {
    event.preventDefault();

    const formInputs = {
      cobraId: cobraId.current.value,
      description: cubeDescription.current.value,
      name: cubeName.current.value
    };

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube`,
        'POST',
        JSON.stringify(formInputs),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      history.push(`/cube/${responseData._id}`);
    } catch (error) {
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
                required={true}
                type="text"
                variant="outlined"
              />

              <MUITextField
                autoComplete="off"
                fullWidth
                inputRef={cubeDescription}
                label="Description"
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