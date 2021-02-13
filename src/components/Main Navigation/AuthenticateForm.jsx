import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import ErrorDialog from '../miscellaneous/ErrorDialog';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { login as loginRequest, register as registerRequest } from '../../requests/account-requests';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

const AuthenticateForm = function (props) {

  const { open, toggleOpen } = props;

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const emailInput = React.useRef();
  const [errorMessage, setErrorMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [mode, setMode] = React.useState('Login');
  const nameInput = React.useRef();
  const passwordInput = React.useRef();

  async function login () {
    try {
      setLoading(true);

      const response = await loginRequest(emailInput.current.value, passwordInput.current.value);

      authentication.login(response.isAdmin, response.token, response.userId);
      toggleOpen();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function register () {
    try {
      setLoading(true);

      const response = await registerRequest(emailInput.current.value, nameInput.current.value, passwordInput.current.value);
        
      authentication.login(false, response.token, response.userId);
      toggleOpen();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function submitForm (event) {
    event.preventDefault();

    if (mode === 'Login') {
      login();
    } else {
      register();
    }
  }

  function toggleMode (prevState) {
    if (prevState === 'Login') {
      setMode('Register');
    } else {
      setMode('Login');
    }
  }

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <MUIDialog
        open={open}
        onClose={toggleOpen}
      >
        <MUIDialogTitle>
          {mode}
        </MUIDialogTitle>
        {loading ?
          <MUIDialogContent className={classes.loadingSpinnerContainer}>
            <LoadingSpinner />
          </MUIDialogContent> :
          <form onSubmit={submitForm}>
            <MUIDialogContent>
              <MUITextField
                autoComplete="off"
                autoFocus
                fullWidth
                inputRef={emailInput}
                label="Email Address"
                required={true}
                type="email"
                variant="outlined"
              />

              {mode === 'Register' &&
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  inputRef={nameInput}
                  label="Account Name"
                  required={true}
                  style={{ marginTop: 16 }}
                  type="text"
                  variant="outlined"
                />
              }

              <MUITextField
                autoComplete="off"
                fullWidth
                inputRef={passwordInput}
                label="Password"
                required={true}
                style={{ marginTop: 16 }}
                type="password"
                variant="outlined"
              />
            </MUIDialogContent>
            <MUIDialogActions>
              <WarningButton
                onClick={() => toggleMode(mode)}
              >
                {mode === 'Login' ? "Don't have an account yet?" : 'Already have an account?'}
              </WarningButton>
              <MUIButton
                color="primary"
                type="submit"
                variant="contained"
              >
                {mode}!
              </MUIButton>
            </MUIDialogActions>
          </form>
        }
      </MUIDialog>
      
    </React.Fragment>
  );
}

export default AuthenticateForm;