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
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [token, setToken] = React.useState(null);
  const [userId, setUserId] = React.useState(null);

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
      login(
        Cookies.get('is_admin') === 'true',
        Cookies.get('authentication_token'),
        Cookies.get('user_id')
      );
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
      </ErrorContext.Provider>
    </AuthenticationContext.Provider>
  );
}
