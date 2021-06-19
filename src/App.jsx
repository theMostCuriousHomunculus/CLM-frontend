import React from 'react';
import Cookies from 'js-cookie';
import thunk from 'redux-thunk';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { applyMiddleware, compose, createStore } from 'redux';
import { makeStyles } from '@material-ui/core/styles';
import { Provider } from 'react-redux';

import cubeReducer from './redux-store/reducers/cube-reducer';
import ErrorDialog from './components/miscellaneous/ErrorDialog';
import Footer from './components/miscellaneous/Footer';
import LoadingSpinner from './components/miscellaneous/LoadingSpinner';
import Navigation from './components/Main Navigation/Navigation';
import { AuthenticationContext } from './contexts/authentication-context';
import { ErrorContext } from './contexts/error-context';
import { logout } from './requests/GraphQL/account-requests';

const Account = React.lazy(() => import('./pages/Account'));
const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Cube = React.lazy(() => import('./pages/Cube'));
const Event = React.lazy(() => import('./pages/Event'));
const Home = React.lazy(() => import('./pages/Home'));
const Match = React.lazy(() => import('./pages/Match'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));
const Resources = React.lazy(() => import('./pages/Resources'));
const Test = React.lazy(() => import('./pages/Test'));

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

export default function App() {

  const classes = useStyles();
  const [avatar, setAvatar] = React.useState(null);
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [name, setName] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

  const login = React.useCallback((admin, avtr, nm, tkn, uid) => {
    setIsAdmin(admin);
    Cookies.set('is_admin', admin);
    setAvatar(avtr);
    Cookies.set('avatar', avtr);
    setName(nm);
    Cookies.set('username', nm);
    setToken(tkn);
    Cookies.set('authentication_token', tkn);
    setUserId(uid);
    Cookies.set('user_id', uid);
  }, []);

  const handleLogout = React.useCallback(() => {
    // not awaiting for this response because it can only cause problems.  if the user's token was deleted on the server already, this request will throw an error, preventing this function from then removing cookies and updating context, which I don't want.
    logout(Cookies.get('authentication_token'));
    setIsAdmin(false);
    Cookies.remove('is_admin');
    setAvatar(null);
    Cookies.remove('avatar');
    setName(null);
    Cookies.remove('username');
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, []);

  React.useEffect(() => {
    if (Cookies.get('user_id') && Cookies.get('authentication_token')) {
      login(Cookies.get('is_admin') === 'true',
        Cookies.get('avatar'),
        Cookies.get('username'),
        Cookies.get('authentication_token'),
        Cookies.get('user_id'));
    }
  }, [login]);

  return (
    <AuthenticationContext.Provider
      value={{
        avatar,
        isAdmin,
        isLoggedIn: !!token,
        login,
        logout: handleLogout,
        name,
        token,
        userId
      }}
    >
      <ErrorContext.Provider
        value={{
          setErrorMessages
        }}
      >
        <BrowserRouter>
          <Navigation />
          <main className={classes.main}>
            <React.Suspense 
              fallback={<LoadingSpinner />}
            >
            <ErrorDialog
              clearAll={() => setErrorMessages([])}
              clearOne={() => setErrorMessages(prevState => prevState.slice(0, prevState.length - 1))}
              messages={errorMessages}
            />
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
                <Route path='/match/:matchId'>
                  <Match />
                </Route>
                <Route path='/reset/:resetToken'>
                  <PasswordReset />
                </Route>
                <Route path='/resources' exact>
                  <Resources />
                </Route>
                <Route path='/test'>
                  <Test />
                </Route>
              </Switch>
            </React.Suspense>
          </main>
          <Footer />
        </BrowserRouter>
      </ErrorContext.Provider>
    </AuthenticationContext.Provider>
  );
};