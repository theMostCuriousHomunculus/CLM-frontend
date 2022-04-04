import React, { useContext, useState } from 'react';
import Cookies from 'js-cookie';
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

import login from '../../graphql/mutations/account/login';
import register from '../../graphql/mutations/account/register';
import requestPasswordReset from '../../graphql/mutations/account/request-password-reset';
import tokenQuery from '../../constants/token-query';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

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
  const { abortControllerRef, loading, setLoading, setUserInfo } =
    useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState(0);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  async function submitForm(event) {
    event.preventDefault();

    if (selectedTab === 0) {
      try {
        setLoading(true);
        const {
          data: {
            login: { admin, avatar, measurement_system, radius, token, userID, userName }
          }
        } = await login({
          queryString: tokenQuery,
          signal: abortControllerRef.current.signal,
          variables: { email: emailInput, password: passwordInput }
        });
        setUserInfo({ admin, avatar, measurement_system, radius, userID, userName });
        Cookies.set('authentication_token', token);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedTab === 1) {
      try {
        setLoading(true);
        await login({
          signal: abortControllerRef.current.signal,
          variables: { email: emailInput }
        });
        setErrorMessages((prevState) => {
          return [
            ...prevState,
            'A link to reset your password has been sent to the provided email address.  Please allow a few minutes and check both your inbox and your spam folder.'
          ];
        });
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
    }

    if (selectedTab === 2) {
      try {
        setLoading(true);
        const {
          data: {
            register: { admin, avatar, measurement_system, radius, token, userID, userName }
          }
        } = await register({
          queryString: tokenQuery,
          signal: abortControllerRef.current.signal,
          variables: { email: emailInput, name: nameInput, password: passwordInput }
        });
        setUserInfo({ admin, avatar, measurement_system, radius, userID, userName });
        Cookies.set('authentication_token', token);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
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
                        onClick={() => setPasswordVisible((prevState) => !prevState)}
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
                        onClick={() => setPasswordVisible((prevState) => !prevState)}
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
