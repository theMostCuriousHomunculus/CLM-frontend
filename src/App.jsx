import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import MUICard from '@material-ui/core/Card';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';

import Footer from './components/miscellaneous/Footer';
import Navigation from './components/Main Navigation/Navigation';

import { AuthenticationContext } from './contexts/authentication-context';
import { useRequest } from './hooks/request-hook';

const Account = React.lazy(() => import('./pages/Account'));
const Authenticate = React.lazy(() => import('./pages/Authenticate'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Cube = React.lazy(() => import('./pages/Cube'));
const Event = React.lazy(() => import('./pages/Event'));
const Home = React.lazy(() => import('./pages/Home'));
const Resources = React.lazy(() => import('./pages/Resources'));

const useStyles = makeStyles({
  loading: {
    margin: 8
  },
  main: {
    flex: '1 0 auto',
    height: '100%',
    margin: '0 auto 0 auto',
    width: '100%'
  }
});

function App() {

  const classes = useStyles();
  const { sendRequest } = useRequest();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const login = React.useCallback((admin, tkn, uid) => {
    setIsAdmin(admin);
    Cookies.set('is_admin', admin);
    setToken(tkn);
    Cookies.set('authentication_token', tkn);
    setUserId(uid);
    Cookies.set('user_id', uid);
  }, []);

  const logout = React.useCallback(() => {
    // removeTokensOnServer();
    sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/logoutAll`,
      'PATCH',
      null,
      {
        Authorization: 'Bearer ' + Cookies.get('authentication_token')
      }
    );
    setIsAdmin(false);
    Cookies.remove('is_admin');
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, [sendRequest]);

  // function removeTokensOnServer () {
  //   sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/logoutAll`,
  //     'PATCH',
  //     null,
  //     {
  //       Authorization: 'Bearer ' + Cookies.get('authentication_token'),
  //       'Content-Type': 'application/json'
  //     }
  //   );
  // }

  React.useEffect(() => {
    if (Cookies.get('user_id') && Cookies.get('authentication_token')) {
      login(!!(Cookies.get('is_admin') === 'true'), Cookies.get('authentication_token'), Cookies.get('user_id'));
    }
  }, [login]);

  return (
    <AuthenticationContext.Provider
      value={{
        isAdmin,
        isLoggedIn: !!token,
        login,
        logout,
        token,
        userId
      }}
    >
      <BrowserRouter>
        <Navigation />
        <main className={classes.main}>
        
          <React.Suspense 
            fallback={
              <MUICard className={classes.loading}>
                <MUICircularProgress />
              </MUICard>
            }
          >
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
              <Route path='/blog/:blogPostId'>
                <BlogPost />
              </Route>
              <Route path='/blog'>
                <Blog />
              </Route>
              <Route path='/cube/:cubeId'>
                <Cube />
              </Route>
              <Route path='/event/:eventId'>
                <Event />
              </Route>
              <Route path='/resources' exact>
                <Resources />
              </Route>
            </Switch>
          </React.Suspense>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthenticationContext.Provider>
  );
}

export default App;