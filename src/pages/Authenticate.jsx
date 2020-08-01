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
import LoadingSpinner from '../components/LoadingSpinner';

const useStyles = makeStyles({
  cardActions: {
    justifyContent: 'space-between'
  },
  centeredCard: {
    justifyContent: 'center',
    margin: '1rem auto',
    minWidth: '360px'
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

  const { loading, sendRequest } = useRequest();

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

      authentication.login(response.userId, response.token);
      history.push('/');

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
        
      authentication.login(response.userId, response.token);
      history.push('/');

    } catch (error) {
      console.log({ Error: error.message });
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <MUICard className={classes.centeredCard}>
          <MUICardHeader
            title={<MUITypography variant="h2">{mode}</MUITypography>}
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
          />
          {mode === 'Register' &&
            <MUITextField
              autoComplete="off"
              fullWidth
              label="Account Name"
              onChange={(event) => setName(event.target.value)}
              required={true}
              type="text"
              value={name}
            />
          }
          <MUITextField
            autoComplete="off"
            fullWidth
            label="Password"
            onChange={(event) => setPassword(event.target.value)}
            required={true}
            type="password"
            value={password}
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
      }
    </React.Fragment>    
  );
}

export default Authenticate;