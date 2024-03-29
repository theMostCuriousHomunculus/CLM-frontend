import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIIconButton from '@mui/material/IconButton';
import MUIInputAdornment from '@mui/material/InputAdornment';
import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import MUITextField from '@mui/material/TextField';
import MUIVisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import MUIVisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { makeStyles } from '@mui/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  activeTab: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around'
  },
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
  const [passwordVisible, setPasswordVisible] = useState(false);

  function submitForm(event) {
    event.preventDefault();

    if (selectedTab === 0) {
      login(emailInput, passwordInput);
    }

    if (selectedTab === 1) {
      requestPasswordReset(emailInput);
    }

    if (selectedTab === 2) {
      register(emailInput, nameInput, passwordInput);
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
              variant="fullWidth"
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
              className={selectedTab === 0 ? classes.activeTab : undefined}
              hidden={selectedTab !== 0}
              id="authentication-options-tabpanel-0"
              role="tabpanel"
            >
              <MUITextField
                autoComplete="off"
                autoFocus={selectedTab === 0}
                fullWidth
                label="Email Address"
                margin="normal"
                onChange={(event) => setEmailInput(event.target.value)}
                required={selectedTab === 0}
                type="email"
                value={emailInput}
              />

              <MUITextField
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <MUIInputAdornment position="end">
                      <MUIIconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() =>
                          setPasswordVisible((prevState) => !prevState)
                        }
                      >
                        {passwordVisible ? (
                          <MUIVisibilityOffOutlinedIcon />
                        ) : (
                          <MUIVisibilityOutlinedIcon />
                        )}
                      </MUIIconButton>
                    </MUIInputAdornment>
                  )
                }}
                label="Password"
                margin="normal"
                onChange={(event) => setPasswordInput(event.target.value)}
                required={selectedTab === 0}
                type={passwordVisible ? 'text' : 'password'}
                value={passwordInput}
              />
            </div>

            <div
              aria-labelledby="password-reset-tab"
              className={selectedTab === 1 ? classes.activeTab : undefined}
              hidden={selectedTab !== 1}
              id="authentication-options-tabpanel-1"
              role="tabpanel"
            >
              <MUITextField
                autoComplete="off"
                autoFocus={selectedTab === 1}
                fullWidth
                label="Email Address"
                margin="normal"
                onChange={(event) => setEmailInput(event.target.value)}
                required={selectedTab === 1}
                type="email"
                value={emailInput}
              />
            </div>

            <div
              aria-labelledby="register-tab"
              className={selectedTab === 2 ? classes.activeTab : undefined}
              hidden={selectedTab !== 2}
              id="authentication-options-tabpanel-2"
              role="tabpanel"
            >
              <MUITextField
                autoComplete="off"
                autoFocus={selectedTab === 2}
                fullWidth
                label="Email Address"
                margin="normal"
                onChange={(event) => setEmailInput(event.target.value)}
                required={selectedTab === 2}
                type="email"
                value={emailInput}
              />

              <MUITextField
                autoComplete="off"
                fullWidth
                label="Account Name"
                margin="normal"
                onChange={(event) => setNameInput(event.target.value)}
                required={selectedTab === 2}
                type="text"
                value={nameInput}
              />

              <MUITextField
                autoComplete="off"
                fullWidth
                InputProps={{
                  endAdornment: (
                    <MUIInputAdornment position="end">
                      <MUIIconButton
                        aria-label="toggle password visibility"
                        edge="end"
                        onClick={() =>
                          setPasswordVisible((prevState) => !prevState)
                        }
                      >
                        {passwordVisible ? (
                          <MUIVisibilityOffOutlinedIcon />
                        ) : (
                          <MUIVisibilityOutlinedIcon />
                        )}
                      </MUIIconButton>
                    </MUIInputAdornment>
                  )
                }}
                label="Password"
                margin="normal"
                onChange={(event) => setPasswordInput(event.target.value)}
                required={selectedTab === 2}
                type={passwordVisible ? 'text' : 'password'}
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
