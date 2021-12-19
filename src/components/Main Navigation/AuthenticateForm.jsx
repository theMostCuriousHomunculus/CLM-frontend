import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function AuthenticateForm({ open, toggleOpen }) {
  const { loading, login, register, requestPasswordReset } = useContext(
    AuthenticationContext
  );
  const classes = useStyles();
  const [mode, setMode] = useState('Login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  function submitForm(event) {
    event.preventDefault();

    if (mode === 'Login') {
      login(emailInput, passwordInput);
    } else if (mode === 'Register') {
      register(emailInput, nameInput, passwordInput);
    } else {
      requestPasswordReset(emailInput);
    }

    toggleOpen();
  }

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>{mode}</MUIDialogTitle>
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form onSubmit={submitForm}>
          <MUIDialogContent>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Email Address"
              onChange={(event) => setEmailInput(event.target.value)}
              required={true}
              type="email"
              value={emailInput}
            />

            {mode === 'Register' && (
              <MUITextField
                autoComplete="off"
                fullWidth
                label="Account Name"
                onChange={(event) => setNameInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="text"
                value={nameInput}
              />
            )}

            {mode !== 'Reset Password' && (
              <MUITextField
                autoComplete="off"
                fullWidth
                label="Password"
                onChange={(event) => setPasswordInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="password"
                value={passwordInput}
              />
            )}
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton type="submit">{mode}!</MUIButton>
            {mode === 'Login' && (
              <MUIButton
                color="secondary"
                onClick={() => setMode('Reset Password')}
              >
                Forgot Your Password?
              </MUIButton>
            )}
            <WarningButton
              onClick={() =>
                setMode((prevState) =>
                  prevState === 'Register' ? 'Login' : 'Register'
                )
              }
            >
              {mode === 'Register'
                ? 'Already have an account?'
                : "Don't have an account yet?"}
            </WarningButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
