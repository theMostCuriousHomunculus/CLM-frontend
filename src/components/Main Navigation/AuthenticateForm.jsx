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

    try {
      const operation = 'login';
      const response = await sendRequest({
        operation,
        body: {
          query: `
            mutation {
              ${operation}(
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
      });
      
      login(response.isAdmin, response.token, response.userId);
      toggleOpen();
    } catch (error) {

    }

  }

  async function handleRegister () {

    try {
      const operation = 'register';
      const randomCard = await sendRequest({
        url: 'https://api.scryfall.com/cards/random',
        method: 'GET'
      });
      const randomCardPrintings = await sendRequest({
        url: randomCard.prints_search_uri,
        method: 'GET'
      });
      const randomIndex = Math.floor(Math.random() * randomCardPrintings.data.length);
      const avatar = randomCardPrintings.data[randomIndex].image_uris.art_crop;
      const response = await sendRequest({
        operation,
        body: {
          query: `
            mutation {
              ${operation}(
                input: {
                  avatar: "${avatar}",
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
      });

      login(false, response.token, response.userId);
      toggleOpen();
    } catch (error) {

    }
  }

  async function handleRequestPasswordReset () {

    try {
      const operation = 'requestPasswordReset';
      await sendRequest({
        body: {
          query: `
            mutation {
              ${operation}(email: "${emailInput}")
            }
          `
        }
      });
      setErrorMessages(prevState => {
        return [...prevState, `A link to reset your password has been sent.  Please check your email inbox and your spam folder.`];
      });
      toggleOpen();
    } catch (error) {

    }
    
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
          <MUIDialogActions style={{ justifyContent: 'space-between' }}>
            <WarningButton
              onClick={() => setMode((prevState) => prevState === 'Register' ? 'Login' : 'Register')}
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
  );
};