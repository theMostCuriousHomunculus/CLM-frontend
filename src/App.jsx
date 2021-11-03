import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import cacheScryfallData from './functions/cache-scryfall-data';
import useRequest from './hooks/request-hook';
import ErrorDialog from './components/miscellaneous/ErrorDialog';
import Footer from './components/miscellaneous/Footer';
import LoadingSpinner from './components/miscellaneous/LoadingSpinner';
import Navigation from './components/Main Navigation/Navigation';
import { AuthenticationContext } from './contexts/authentication-context';
import { ErrorContext } from './contexts/error-context';
import { CardCacheContext } from './contexts/card-cache-context';

const Blog = React.lazy(() => import('./pages/Blog'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const Classy = React.lazy(() => import('./pages/Classy'));
const ContextualizedCubePage = React.lazy(() =>
  import('./contexts/cube-context')
);
const ContextualizedEventPage = React.lazy(() =>
  import('./contexts/event-context')
);
const ContextualizedAccountPage = React.lazy(() =>
  import('./contexts/account-context')
);
const ContextualizedDeckPage = React.lazy(() =>
  import('./contexts/deck-context')
);
const ContextualizedMatchPage = React.lazy(() =>
  import('./contexts/match-context')
);
const Home = React.lazy(() => import('./pages/Home'));
const PasswordReset = React.lazy(() => import('./pages/PasswordReset'));
const Resources = React.lazy(() => import('./pages/Resources'));

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
  const scryfallCardDataCache = React.useRef(Object.create(null));
  const classes = useStyles();
  const { sendRequest } = useRequest();
  const [errorMessages, setErrorMessages] = React.useState([]);
  const [authenticationState, setAuthenticationState] = React.useState({
    avatar: null,
    isAdmin: false,
    token: null,
    userID: null,
    userName: null
  });

  const addCardsToCache = React.useCallback(
    async (scryfall_ids) => {
      const newCards = [];

      for (const scryfall_id of scryfall_ids) {
        if (!scryfallCardDataCache.current[scryfall_id]) {
          newCards.push({ id: scryfall_id });
        }
      }

      // according to scryfall api documentation, "A maximum of 75 card references may be submitted per request."
      const numberOfScryfallRequests = Math.ceil(newCards.length / 75);
      const scryfallRequestArrays = [];

      for (
        let requestNumber = 0;
        requestNumber < numberOfScryfallRequests;
        requestNumber++
      ) {
        scryfallRequestArrays.push(newCards.splice(0, 75));
      }

      for (let request of scryfallRequestArrays) {
        await sendRequest({
          body: {
            identifiers: request
          },
          callback: async (data) => {
            for (const card of data.data) {
              scryfallCardDataCache.current[card.id] = await cacheScryfallData(
                card
              );
            }
          },
          url: 'https://api.scryfall.com/cards/collection'
        });
      }
    },
    [sendRequest]
  );

  const storeUserInfo = React.useCallback(
    async function (email, password) {
      // store on server
      await sendRequest({
        callback: ({ _id, avatar, name, admin, token }) => {
          // store in running application
          setAuthenticationState({
            avatar,
            isAdmin: admin,
            token,
            userID: _id,
            userName: name
          });

          // store in browser
          Cookies.set('authentication_token', token);
          Cookies.set('avatar', avatar);
          Cookies.set('is_admin', admin);
          Cookies.set('user_id', _id);
          Cookies.set('user_name', name);
        },
        load: true,
        operation: 'login',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  email: "${email}",
                  password: "${password}"
                ) {
                  _id
                  avatar
                  name
                  admin
                  token
                }
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  const clearUserInfo = React.useCallback(() => {
    // clear from server
    sendRequest({
      operation: 'logoutAllDevices',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}
            }
          `
        };
      }
    });

    // clear from running application
    setAuthenticationState({
      avatar: null,
      isAdmin: false,
      token: null,
      userID: null,
      userName: null
    });

    // clear from browser
    for (const cookie of [
      'is_admin',
      'authentication_token',
      'avatar',
      'user_id',
      'user_name'
    ]) {
      Cookies.remove(cookie);
    }
  }, [sendRequest]);

  React.useEffect(() => {
    if (Cookies.get('authentication_token')) {
      setAuthenticationState({
        avatar: Cookies.get('avatar'),
        isAdmin: Cookies.get('is_admin') === 'true',
        token: Cookies.get('authentication_token'),
        userID: Cookies.get('user_id'),
        userName: Cookies.get('user_name')
      });
    }
  }, []);

  return (
    <ErrorContext.Provider
      value={{
        setErrorMessages
      }}
    >
      <AuthenticationContext.Provider
        value={{
          ...authenticationState,
          clearUserInfo,
          isLoggedIn: !!authenticationState.token,
          storeUserInfo
        }}
      >
        <CardCacheContext.Provider
          value={{
            addCardsToCache,
            scryfallCardDataCache
          }}
        >
          <BrowserRouter>
            <Navigation />
            <main className={classes.main}>
              <React.Suspense fallback={<LoadingSpinner />}>
                <ErrorDialog
                  clearAll={() => setErrorMessages([])}
                  clearOne={() =>
                    setErrorMessages((prevState) =>
                      prevState.slice(0, prevState.length - 1)
                    )
                  }
                  messages={errorMessages}
                />
                <Switch>
                  <Route path="/" exact>
                    <Home />
                  </Route>
                  <Route path="/account/:accountID">
                    <ContextualizedAccountPage />
                  </Route>
                  <Route path="/blog/:blogPostID">
                    <BlogPost />
                  </Route>
                  <Route path="/blog">
                    <Blog />
                  </Route>
                  <Route path="/classy">
                    <Classy />
                  </Route>
                  <Route path="/cube/:cubeID">
                    <ContextualizedCubePage />
                  </Route>
                  <Route path="/deck/:deckID">
                    <ContextualizedDeckPage />
                  </Route>
                  <Route path="/event/:eventID">
                    <ContextualizedEventPage />
                  </Route>
                  <Route path="/match/:matchID">
                    <ContextualizedMatchPage />
                  </Route>
                  <Route path="/reset/:resetToken">
                    <PasswordReset />
                  </Route>
                  <Route path="/resources" exact>
                    <Resources />
                  </Route>
                </Switch>
              </React.Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </CardCacheContext.Provider>
      </AuthenticationContext.Provider>
    </ErrorContext.Provider>
  );
}
