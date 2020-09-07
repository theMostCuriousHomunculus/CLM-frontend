import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDialogue from '@material-ui/core/Dialog';
import MUIDialogueActions from '@material-ui/core/DialogActions';
import MUIDialogueContent from '@material-ui/core/DialogContent';
import MUIDialogueContentText from '@material-ui/core/DialogContentText'
import MUIDialogueTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  cardActions: {
    justifyContent: 'space-between'
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

const Authenticate = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [mode, setMode] = React.useState('Login');
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  function toggleMode (prevState) {
    if (prevState === 'Login') {
      setMode('Register');
    } else {
      setMode('Login');
    }
  }

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
      history.push('/');
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
      history.push('/');
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>
          <MUIDialogue
            open={!!errorMessage}
            onClose={clearError}
          >
            <MUIDialogueTitle>Error</MUIDialogueTitle>
            <MUIDialogueContent>
              <MUIDialogueContentText>{errorMessage}</MUIDialogueContentText>
            </MUIDialogueContent>
            <MUIDialogueActions>
              <MUIButton color="primary" onClick={clearError} variant="contained">Try Again</MUIButton>
            </MUIDialogueActions>
          </MUIDialogue>
          <MUICard>
            <MUICardHeader
              disableTypography={true}
              title={<MUITypography variant="subtitle1">{mode}</MUITypography>}
            />
            <MUICardContent>
            
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

            </MUICardContent>

            <MUICardActions className={classes.cardActions}>
              <MUIButton
                className={classes.warningButton}
                onClick={() => toggleMode (mode)}
                variant="contained"
              >
                {mode === 'Login' ? "Don't have an account yet?" : 'Already have an account?'}
              </MUIButton>
              <MUIButton color="primary" onClick={mode === 'Login' ? login : register} variant="contained">
                {mode}!
              </MUIButton>
            </MUICardActions>
          </MUICard>
        </React.Fragment>
      }
    </React.Fragment>    
  );
}

export default Authenticate;