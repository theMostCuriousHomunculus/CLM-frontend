import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';

import Account from './pages/Account';
import Authenticate from './pages/Authenticate';
import Cube from './pages/Cube';
import Footer from './components/Footer';
import Home from './pages/Home';
import Navigation from './components/Navigation';
import Resources from './pages/Resources';
import { AuthenticationContext } from './contexts/authentication-context';
import { useRequest } from './hooks/request-hook';

const useStyles = makeStyles({
  main: {
    paddingBottom: 300,
    margin: '1rem auto 0 auto'
  }
});

function App() {

  const classes = useStyles();
  const { sendRequest } = useRequest();

  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const login = React.useCallback((uid, tkn) => {
    setToken(tkn);
    Cookies.set('authentication_token', tkn);
    setUserId(uid);
    Cookies.set('user_id', uid);
  }, []);

  const logout = React.useCallback(() => {
    removeTokensOnServer();
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, []);

  function removeTokensOnServer () {
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/logoutAll`,
      'PATCH',
      null,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
  }

  React.useEffect(() => {
    if (Cookies.get('user_id') && Cookies.get('authentication_token')) {
      login(Cookies.get('user_id'), Cookies.get('authentication_token'));
    }
  }, [login]);

  return (
    <AuthenticationContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        userId,
        login,
        logout
      }}
    >
      <BrowserRouter>
        <Navigation />
        <main className={classes.main}>
          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/account/authenticate' exact>
              <Authenticate />
            </Route>
            <Route path='/account/:accountId'>
              <Account />
            </Route>
            <Route path='/cube/:cubeId'>
              <Cube />
            </Route>
            <Route path='/resources' exact>
              <Resources />
            </Route>
          </Switch>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthenticationContext.Provider>
  );
}

export default App;