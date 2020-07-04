import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  cardActions: {
    justifyContent: 'space-between'
  },
  centeredCard: {
    justifyContent: 'center',
    margin: '1rem auto',
    minWidth: '600px',
    width: '75%'
  }
});

const Authenticate = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const [mode, setMode] = React.useState('Login');

  const { sendRequest } = useRequest();

  function toggleMode (prevState) {
    if (prevState === 'Login') {
      setMode('Register');
    } else {
      setMode('Login');
    }
  }

  async function login () {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/account/login`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const responseData = await response.json();

      if (response.ok) {
        authentication.login(responseData.userId, responseData.token);
        history.push('/');
      } else {
        alert(responseData.message);
      }

    } catch (error) {
      console.log({ Error: error.message });
    }
  }

  async function register () {
    try {

      const randomCard = await sendRequest('https://api.scryfall.com/cards/random', 'GET', null, {});
      const randomCardPrintings = await sendRequest(randomCard.prints_search_uri, 'GET', null, {});
      const randomIndex = Math.floor(Math.random() * randomCardPrintings.data.length);
      const avatar = randomCardPrintings.data[randomIndex].image_uris.art_crop;

      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/account`,
        {
          method: 'POST',
          body: JSON.stringify({
            avatar,
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            password: document.getElementById('password').value
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      const responseData = await response.json();
        
      if (response.ok) {
        authentication.login(responseData.userId, responseData.token);
        history.push('/');
      } else {
        alert(responseData.message);
      }

    } catch (error) {
      console.log({ Error: error.message });
    }
  }

  return (
    <MUICard className={classes.centeredCard}>
      <MUICardHeader
        title={<MUITypography variant="h2">{mode}</MUITypography>}
      />
      <MUICardContent>
      
      <MUITextField
        autoComplete="off"
        autoFocus
        fullWidth
        id="email"
        label="Email Address"
        required={true}
        type="email"
      />
      {mode === 'Register' &&
        <MUITextField
          autoComplete="off"
          fullWidth
          id="name"
          label="Account Name"
          required={true}
          type="text"
        />
      }
      <MUITextField
        autoComplete="off"
        fullWidth
        id="password"
        label="Password"
        required={true}
        type="password"
      />

      </MUICardContent>

      <MUICardActions className={classes.cardActions}>
        <MUIButton color="primary" onClick={() => toggleMode (mode)} variant="contained">
          {mode === 'Login' ? "Don't have an account yet?" : 'Already have an account?'}
        </MUIButton>
        <MUIButton color="primary" onClick={mode === 'Login' ? login : register} variant="contained">
          {mode}!
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
}

export default Authenticate;