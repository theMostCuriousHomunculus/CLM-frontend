import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import useRequest from '../../hooks/request-hook';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { ErrorContext } from '../../contexts/error-context';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function AuthenticateForm ({
  open,
  toggleOpen
}) {

  const { login } = React.useContext(AuthenticationContext);
  const { loading, sendRequest } = useRequest();
  const { setErrorMessages } = React.useContext(ErrorContext);
  const classes = useStyles();
  const [mode, setMode] = React.useState('Login');
  const [emailInput, setEmailInput] = React.useState();
  const [nameInput, setNameInput] = React.useState();
  const [passwordInput, setPasswordInput] = React.useState();

  async function handleLogin () {
    await sendRequest({
      callback: (data) => {
        login(data.isAdmin, data.token, data.userId);
        toggleOpen();
      },
      load: true,
      operation: 'login',
      get body () {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  email: "${emailInput}",
                  password: "${passwordInput}"
                }
              ) {
                isAdmin
                token
                userId
              }
            }
          `
        }
      }
    });
  }

  async function handleRegister () {
    const avatar = {};

    await sendRequest({
      callback: (data) => {
        avatar.prints_search_uri = data.prints_search_uri;
      },
      load: true,
      method: 'GET',
      url: 'https://api.scryfall.com/cards/random'
    });

    await sendRequest({
      callback: (data) => {
        avatar.printings = data.data;
      },
      load: true,
      method: 'GET',
      url: avatar.prints_search_uri
    });

    const randomIndex = Math.floor(Math.random() * avatar.printings.length);

    await sendRequest({
      callback: (data) => {
        login(false, data.token, data.userId);
        toggleOpen();
      },
      load: true,
      operation: 'register',
      get body () {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  avatar: "${avatar.printings[randomIndex].image_uris.art_crop}",
                  email: "${emailInput}",
                  name: "${nameInput}",
                  password: "${passwordInput}"
                }
              ) {
                token
                userId
              }
            }
          `
        }
      }
    });
  }

  async function handleRequestPasswordReset () {
    await sendRequest({
      callback: () => {
        setErrorMessages(prevState => {
          return [...prevState, `A link to reset your password has been sent.  Please check your email inbox and your spam folder.`];
        });
        toggleOpen();
      },
      load: true,
      operation: 'requestPasswordReset',
      get body () {
        return {
          query: `
            mutation {
              ${this.operation}(email: "${emailInput}")
            }
          `
        }
      }
    });
  }

  function submitForm (event) {
    event.preventDefault();

    if (mode === 'Login') {
      handleLogin();
    } else if (mode === 'Register') {
      handleRegister();
    } else {
      handleRequestPasswordReset();
    }
  }

  return (
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
              label="Email Address"
              margin="dense"
              onChange={(event) => setEmailInput(event.target.value)}
              required={true}
              type="email"
              value={emailInput}
              variant="outlined"
            />

            {mode === 'Register' &&
              <MUITextField
                autoComplete="off"
                fullWidth
                label="Account Name"
                margin="dense"
                onChange={(event) => setNameInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="text"
                value={nameInput}
                variant="outlined"
              />
            }

            {mode !== 'Reset Password' &&
              <MUITextField
                autoComplete="off"
                fullWidth
                label="Password"
                margin="dense"
                onChange={(event) => setPasswordInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="password"
                value={passwordInput}
                variant="outlined"
              />
            }
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              {mode}!
            </MUIButton>
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
            <WarningButton
              onClick={() => setMode((prevState) => prevState === 'Register' ? 'Login' : 'Register')}
            >
              {mode === 'Register' ? 'Already have an account?' : "Don't have an account yet?"}
            </WarningButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};