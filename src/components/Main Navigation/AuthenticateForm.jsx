import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText'
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

export default function (props) {

  const { open, toggleOpen } = props;

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [email, setEmail] = React.useState('');
  const [mode, setMode] = React.useState('Login');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function login () {
    try {
      const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/login`,
        'PATCH',
        JSON.stringify({
          email,
          password
        }),
        {
          'Content-Type': 'application/json'
        }
      );

      authentication.login(response.isAdmin, response.token, response.userId);
      toggleOpen();
    } catch (err) {
      console.log(err);
    }
  }

  async function register () {
    try {
      const randomCard = await sendRequest('https://api.scryfall.com/cards/random', 'GET', null, {});
      const randomCardPrintings = await sendRequest(randomCard.prints_search_uri, 'GET', null, {});
      const randomIndex = Math.floor(Math.random() * randomCardPrintings.data.length);
      const avatar = randomCardPrintings.data[randomIndex].image_uris.art_crop;

      const response = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
        'POST',
        JSON.stringify({
          avatar,
          email,
          name,
          password
        }),
        {
          'Content-Type': 'application/json'
        }
      );
        
      authentication.login(false, response.token, response.userId);
      toggleOpen();
    } catch (err) {
      console.log(err);
    }
  }

  function submitForm (event) {
    event.preventDefault();

    if (mode === 'Login') {
      login();
    } else {
      register();
    }
  }

  function toggleMode (prevState) {
    if (prevState === 'Login') {
      setMode('Register');
    } else {
      setMode('Login');
    }
  }

  return (
    <React.Fragment>
      <MUIDialog
        open={!!errorMessage}
        onClose={clearError}
      >
        <MUIDialogTitle>Error</MUIDialogTitle>
        <MUIDialogContent>
          <MUIDialogContentText>{errorMessage}</MUIDialogContentText>
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton color="primary" onClick={clearError} variant="contained">Try Again</MUIButton>
        </MUIDialogActions>
      </MUIDialog>

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
                onChange={(event) => setEmail(event.target.value)}
                required={true}
                type="email"
                value={email}
                variant="outlined"
              />

              {mode === 'Register' &&
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  label="Account Name"
                  onChange={(event) => setName(event.target.value)}
                  required={true}
                  style={{ marginTop: 16 }}
                  type="text"
                  value={name}
                  variant="outlined"
                />
              }

              <MUITextField
                autoComplete="off"
                fullWidth
                label="Password"
                onChange={(event) => setPassword(event.target.value)}
                required={true}
                style={{ marginTop: 16 }}
                type="password"
                value={password}
                variant="outlined"
              />
            </MUIDialogContent>
            <MUIDialogActions>
              <MUIButton
                className={classes.warningButton}
                onClick={() => toggleMode(mode)}
                variant="contained"
              >
                {mode === 'Login' ? "Don't have an account yet?" : 'Already have an account?'}
              </MUIButton>
              <MUIButton
                color="primary"
                type="submit"
                variant="contained"
              >
                {mode}!
              </MUIButton>
            </MUIDialogActions>
          </form>
        }
      </MUIDialog>
    </React.Fragment>
  );
}