import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import MUITextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
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
  const [selectedTab, setSelectedTab] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  function submitForm(event) {
    event.preventDefault();

    if (selectedTab === 0) {
      login(emailInput, passwordInput);
    }
    if (selectedTab === 1) {
      register(emailInput, nameInput, passwordInput);
    }
    if (selectedTab === 2) {
      requestPasswordReset(emailInput);
    }

    toggleOpen();
  }

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form onSubmit={submitForm}>
          <MUIDialogTitle>
            <MUITabs
              aria-label="authentication-options"
              onChange={(event, chosenTab) => setSelectedTab(chosenTab)}
              value={selectedTab}
            >
              <MUITab
                aria-controls="authentication-options-tabpanel-0"
                id="login-tab"
                label="Login"
              />
              <MUITab
                aria-controls="authentication-options-tabpanel-1"
                id="password-reset-tab"
                label="Password Reset"
              />
              <MUITab
                aria-controls="authentication-options-tabpanel-2"
                id="register-tab"
                label="Register"
              />
            </MUITabs>
          </MUIDialogTitle>

          <MUIDialogContent>
            <div
              aria-labelledby="login-tab"
              hidden={selectedTab !== 0}
              id="authentication-options-tabpanel-0"
              role="tabpanel"
              style={
                selectedTab === 0
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around'
                    }
                  : undefined
              }
            >
              <MUITextField
                autoComplete="off"
                autoFocus
                fullWidth
                label="Email Address"
                onChange={(event) => setEmailInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="email"
                value={emailInput}
              />

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
            </div>

            <div
              aria-labelledby="password-reset-tab"
              hidden={selectedTab !== 1}
              id="authentication-options-tabpanel-1"
              role="tabpanel"
              style={
                selectedTab === 1
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around'
                    }
                  : undefined
              }
            >
              <MUITextField
                autoComplete="off"
                autoFocus
                fullWidth
                label="Email Address"
                onChange={(event) => setEmailInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="email"
                value={emailInput}
              />
            </div>

            <div
              aria-labelledby="register-tab"
              hidden={selectedTab !== 2}
              id="authentication-options-tabpanel-2"
              role="tabpanel"
              style={
                selectedTab === 2
                  ? {
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-around'
                    }
                  : undefined
              }
            >
              <MUITextField
                autoComplete="off"
                autoFocus
                fullWidth
                label="Email Address"
                onChange={(event) => setEmailInput(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="email"
                value={emailInput}
              />

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
            </div>
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton type="submit">Submit</MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
