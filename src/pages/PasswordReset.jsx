import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUITextField from '@mui/material/TextField';

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/Authentication';
import { ErrorContext } from '../contexts/Error';

export default function PasswordReset() {
  const { loading, submitPasswordReset } = React.useContext(
    AuthenticationContext
  );
  const { setErrorMessages } = React.useContext(ErrorContext);
  const confirmPasswordInput = React.useRef();
  const emailInput = React.useRef();
  const navigate = useNavigate();
  const passwordInput = React.useRef();
  const { resetToken } = useParams();

  async function submitForm(event) {
    event.preventDefault();
    if (passwordInput.current.value !== confirmPasswordInput.current.value) {
      setErrorMessages((prevState) => [
        ...prevState,
        'The entered passwords do not match.  Please try again.'
      ]);
    } else {
      submitPasswordReset(
        emailInput.current.value,
        passwordInput.current.value,
        resetToken
      );
      navigate('/');
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
