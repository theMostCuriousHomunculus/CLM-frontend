import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUITextField from '@mui/material/TextField';

import useRequest from '../hooks/request-hook';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
import { ErrorContext } from '../contexts/error-context';

export default function PasswordReset() {
  const authentication = React.useContext(AuthenticationContext);
  const { setErrorMessages } = React.useContext(ErrorContext);
  const confirmPasswordInput = React.useRef();
  const emailInput = React.useRef();
  const history = useHistory();
  const passwordInput = React.useRef();
  const { resetToken } = useParams();
  const { loading, sendRequest } = useRequest();

  async function submitPasswordReset(event) {
    event.preventDefault();
    try {
      if (passwordInput.current.value !== confirmPasswordInput.current.value) {
        setErrorMessages((prevState) => [
          ...prevState,
          'The entered passwords do not match.  Please try again.'
        ]);
      } else {
        const operation = 'submitPasswordReset';
        const response = await sendRequest({
          operation,
          body: {
            query: `
              mutation {
                ${operation}(
                  email: "${emailInput.current.value}"
                  password: "${passwordInput.current.value}"
                  reset_token: "${resetToken}"
                ) {
                  isAdmin
                  token
                  userId
                }
              }
            `
          }
        });

        authentication.login(response.isAdmin, response.token, response.userId);
        history.push(`/account/${response.userId}`);
      }
    } catch (error) {}
  }

  return (
    <MUICard>
      <MUICardHeader title="Password Reset" />
      <form onSubmit={submitPasswordReset}>
        <MUICardContent>
          {loading ? (
            <LoadingSpinner />
          ) : (
            <React.Fragment>
              <MUITextField
                fullWidth
                inputRef={emailInput}
                label="Email Address"
                required={true}
                type="email"
              />
              <MUITextField
                fullWidth
                inputRef={passwordInput}
                label="New Password"
                required={true}
                type="password"
              />
              <MUITextField
                fullWidth
                inputRef={confirmPasswordInput}
                label="Confirm New Password"
                required={true}
                type="password"
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
