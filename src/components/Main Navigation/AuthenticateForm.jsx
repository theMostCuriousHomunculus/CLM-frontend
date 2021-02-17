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
import {
  login as loginRequest,
  register as registerRequest,
  requestPasswordReset as requestPasswordResetRequest
} from '../../requests/account-requests';

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

  async function requestPasswordReset () {
    try {
      setLoading(true);
      await requestPasswordResetRequest(emailInput.current.value);
      setErrorMessage(`A link to reset your password has been sent.  Please check your email inbox and your spam folder.`);
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
    } else if (mode === 'Register') {
      register();
    } else {
      requestPasswordReset();
    }
  }

  // function toggleMode (prevState) {
  //   if (prevState === 'Login') {
  //     setMode('Register');
  //   } else {
  //     setMode('Login');
  //   }
  // }

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
                margin="dense"
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
                  margin="dense"
                  required={true}
                  style={{ marginTop: 16 }}
                  type="text"
                  variant="outlined"
                />
              }

              {mode !== 'Reset Password' &&
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  inputRef={passwordInput}
                  label="Password"
                  margin="dense"
                  required={true}
                  style={{ marginTop: 16 }}
                  type="password"
                  variant="outlined"
                />
              }
            </MUIDialogContent>
            <MUIDialogActions style={{ justifyContent: 'space-between' }}>
              <WarningButton
                onClick={() => setMode((prevState) => {
                  return prevState === 'Register' ? 'Login' : 'Register';
                })}
              >
                {mode === 'Register' ? 'Already have an account?' : "Don't have an account yet?"}
              </WarningButton>
              {mode === 'Login' &&
                <MUIButton
                  color="secondary"
                  onClick={() => setMode('Reset Password')}
                  size="small"
                  variant="contained"
                >
                  Forgot Your Password?
                </MUIButton>
              }
              <MUIButton
                color="primary"
                size="small"
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