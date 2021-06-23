import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';

import useRequest from './hooks/request-hook';
import ErrorDialog from './components/miscellaneous/ErrorDialog';
import Footer from './components/miscellaneous/Footer';
import LoadingSpinner from './components/miscellaneous/LoadingSpinner';
import Navigation from './components/Main Navigation/Navigation';
import { AuthenticationContext } from './contexts/authentication-context';
import { ErrorContext } from './contexts/error-context';

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

const useStyles = makeStyles({
  main: {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    height: '100%',
    margin: 'auto',
    padding: 4,
    width: '100%'
  }
});

export default function App() {

  const classes = useStyles();
  const { sendRequest } = useRequest();
  const [errorMessages, setErrorMessages] = React.useState([]);
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

  const handleLogout = React.useCallback(() => {
    // not awaiting for this response because it can only cause problems.  if the user's token was deleted on the server already, this request will throw an error, preventing this function from then removing cookies and updating context, which I don't want.
    const operation = 'logoutAllDevices';
    sendRequest({
      operation,
      body: {
        query: `
          mutation {
            ${operation}
          }
        `
      }
    });
    setIsAdmin(false);
    Cookies.remove('is_admin');
    setToken(null);
    Cookies.remove('authentication_token');
    setUserId(null);
    Cookies.remove('user_id');
  }, [sendRequest]);

  React.useEffect(() => {
    if (Cookies.get('user_id') && Cookies.get('authentication_token')) {
      login(Cookies.get('is_admin') === 'true',
        Cookies.get('authentication_token'),
        Cookies.get('user_id'));
    }
  }, [login]);

  return (
    <AuthenticationContext.Provider
      value={{
        isAdmin,
        isLoggedIn: !!token,
        login,
        logout: handleLogout,
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
                  <Cube />
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