import React, { useContext, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUITextField from '@mui/material/TextField';

import submitPasswordReset from '../graphql/mutations/account/submit-password-reset';
import tokenQuery from '../constants/token-query';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/Authentication';
import { ErrorContext } from '../contexts/Error';

export default function PasswordReset() {
  const { abortControllerRef, loading, setLoading, setUserInfo } =
    useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const [emailInputState, setEmailInputState] = useState('');
  const [passwordInputState, setPasswordInputState] = useState('');
  const [confirmPasswordInputState, setConfirmPasswordInputState] = useState('');

  async function submitForm(event) {
    event.preventDefault();
    if (passwordInputState !== confirmPasswordInputState) {
      setErrorMessages((prevState) => [
        ...prevState,
        'The entered passwords do not match.  Please try again.'
      ]);
    } else {
      try {
        setLoading(true);
        const {
          data: {
            submitPasswordReset: {
              admin,
              avatar,
              measurement_system,
              radius,
              token,
              userID,
              userName
            }
          }
        } = await submitPasswordReset({
          queryString: tokenQuery,
          signal: abortControllerRef.current.signal,
          variables: {
            email: emailInputState,
            password: passwordInputState,
            reset_token: resetToken
          }
        });
        setUserInfo({ admin, avatar, measurement_system, radius, userID, userName });
        Cookies.set('authentication_token', token);
        setTimeout(() => {
          navigate('/');
        }, 0);
      } catch (error) {
        setLoading(false);
        setErrorMessages((prevState) => [...prevState, error.message]);
      }
    }
  }

  return (
    <MUICard>
      <MUICardHeader title="Password Reset" />
      <form onSubmit={submitForm}>
        <MUICardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <React.Fragment>
              <MUITextField
                fullWidth
                label="Email Address"
                onChange={setEmailInputState}
                required={true}
                type="email"
                value={emailInputState}
              />
              <MUITextField
                fullWidth
                label="New Password"
                onChange={setPasswordInputState}
                required={true}
                type="password"
                value={passwordInputState}
              />
              <MUITextField
                fullWidth
                label="Confirm New Password"
                onChange={setConfirmPasswordInputState}
                required={true}
                type="password"
                value={confirmPasswordInputState}
              />
            </React.Fragment>
          )}
        </MUICardContent>
        <MUICardActions>
          <MUIButton type="submit">Submit!</MUIButton>
        </MUICardActions>
      </form>
    </MUICard>
  );
}
