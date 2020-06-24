import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cookies from 'js-cookie';

import Account from './pages/Account';
import Authenticate from './pages/Authenticate';
import Cube from './pages/Cube';
import Footer from './components/Footer';
import Home from './pages/Home';
import MainNav from './components/MainNav';
import { AuthenticationContext } from './contexts/authentication-context';

function App() {

  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((uid, tkn) => {
    setToken(tkn);
    Cookies.set('authentication_token', tkn);
    setUserId(uid);
    Cookies.set('user_id', uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, []);

  useEffect(() => {
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
        <header>
          <MainNav />
        </header>
        <main>
          <Switch>
            <Route path='/' exact>
              <Home />
            </Route>
            <Route path='/account/authenticate' exact>
              <Authenticate />
            </Route>
            <Route path='/account/:accountId' exact>
              <Account />
            </Route>
            <Route path='/cube/:cubeId' exact>
              <Cube />
            </Route>
          </Switch>
        </main>
        <footer className="site-footer">
          <Footer />
        </footer>
      </BrowserRouter>
    </AuthenticationContext.Provider>
  );
}

export default App;