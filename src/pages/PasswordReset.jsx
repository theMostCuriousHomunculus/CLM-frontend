import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/authentication-context';
import { submitPasswordReset as submitPasswordResetRequest } from '../requests/GraphQL/account-requests';

export default function PasswordReset () {

  const authentication = React.useContext(AuthenticationContext);
  const confirmPasswordInput = React.useRef();
  const emailInput = React.useRef();
  const history = useHistory();
  const [loading, setLoading] = React.useState(false);
  const passwordInput = React.useRef();
  const resetToken = useParams().resetToken;

  async function submitPasswordReset (event) {
    event.preventDefault();
    try {

      if (passwordInput.current.value !== confirmPasswordInput.current.value) {
        throw new Error(`The entered passwords do not match.  Please try again.`);
      }

      setLoading(true);
      // this should return info required to login, set cookies and then auto-redirect to the user's account page
      const response = await submitPasswordResetRequest(emailInput.current.value, passwordInput.current.value, resetToken);
      authentication.login(response.isAdmin, response.token, response.userId);
      history.push(`/account/${response.userId}`);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  }
  
  return (
    <MUICard>
      <MUICardHeader title="Password Reset" />
      <form onSubmit={submitPasswordReset}>
        <MUICardContent>
          {loading ?
            <LoadingSpinner /> :
            <React.Fragment>
              <MUITextField
                fullWidth
                inputRef={emailInput}
                label="Email Address"
                margin="dense"
                required={true}
                type="email"
                variant="outlined"
              />
              <MUITextField
                fullWidth
                inputRef={passwordInput}
                label="New Password"
                margin="dense"
                required={true}
                type="password"
                variant="outlined"
              />
              <MUITextField
                fullWidth
                inputRef={confirmPasswordInput}
                label="Confirm New Password"
                margin="dense"
                required={true}
                type="password"
                variant="outlined"
              />
            </React.Fragment>
          }
        </MUICardContent>
        <MUICardActions>
          <MUIButton
            color="primary"
            size="small"
            type="submit"
            variant="contained"
          >
            Submit!
          </MUIButton>
        </MUICardActions>
      </form>
    </MUICard>
  );
};