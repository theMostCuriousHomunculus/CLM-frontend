import React from 'react';
import Cookies from 'js-cookie';
import thunk from 'redux-thunk';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import cubeReducer from './store/reducers/cube-reducer';
import Footer from './components/miscellaneous/Footer';
import LoadingSpinner from './components/miscellaneous/LoadingSpinner';
import Navigation from './components/Main Navigation/Navigation';
import { AuthenticationContext } from './contexts/authentication-context';
import { logout as logoutRequest } from './requests/account-requests';

const Account = React.lazy(() => import('./pages/Account'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Cube = React.lazy(() => import('./pages/Cube'));
const Event = React.lazy(() => import('./pages/Event'));
const Home = React.lazy(() => import('./pages/Home'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));
const Resources = React.lazy(() => import('./pages/Resources'));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const cubeStore = createStore(cubeReducer, composeEnhancers(applyMiddleware(thunk)));

const useStyles = makeStyles({
  main: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    height: '100%',
    margin: 'auto',
    width: '100%'
  }
});

function App() {

  const classes = useStyles();
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
    // not awaiting for this response because it can only cause problems.  if the user's token was deleted on the server already, this request will throw an error, preventing this function from then removing cookies and updating context, which I don't want.
    logoutRequest(Cookies.get('authentication_token'));
    setIsAdmin(false);
    Cookies.remove('is_admin');
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, []);

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
            fallback={<LoadingSpinner />}
          >
            <Switch>
              <Route path='/' exact>
                <Home />
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
                <Provider store={cubeStore}>
                  <Cube />
                </Provider>
              </Route>
              <Route path='/event/:eventId'>
                <Event />
              </Route>
              <Route path='/reset/:resetToken'>
                <PasswordReset />
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