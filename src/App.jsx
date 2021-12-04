import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
const Classy = React.lazy(() => import('./pages/Classy'));
const ContextualizedBlogPostPage = React.lazy(() =>
  import('./contexts/blog-post-context')
);
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
  const { loading, sendRequest } = useRequest();
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

  const storeUserInfo = React.useCallback(function ({
    _id,
    avatar,
    name,
    admin,
    token
  }) {
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
  []);

  const login = React.useCallback(
    async function (email, password) {
      await sendRequest({
        callback: storeUserInfo,
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
                  admin
                  avatar
                  name
                  token
                }
              }
            `
          };
        }
      });
    },
    [sendRequest, storeUserInfo]
  );

  const logout = React.useCallback(() => {
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

    // stop watching user's location
    if (Cookies.get('geolocation_id')) {
      navigator.geolocation.clearWatch(Cookies.get('geolocation_id'));
    }

    // clear from browser
    for (const cookie of [
      'is_admin',
      'authentication_token',
      'avatar',
      'geolocation_id',
      'user_id',
      'user_name'
    ]) {
      Cookies.remove(cookie);
    }
  }, [sendRequest]);

  const register = React.useCallback(
    async function (email, name, password) {
      const avatar = {
        prints_search_uri: null,
        printings: []
      };

      await sendRequest({
        callback: (data) => {
          avatar.prints_search_uri = data.prints_search_uri;
        },
        load: true,
        method: 'GET',
        url: 'https://api.scryfall.com/cards/random'
      });

      await sendRequest({
        callback: (data) => {
          avatar.printings = data.data;
        },
        load: true,
        method: 'GET',
        url: avatar.prints_search_uri
      });

      const randomIndex = Math.floor(Math.random() * avatar.printings.length);

      await sendRequest({
        callback: storeUserInfo,
        load: true,
        operation: 'register',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  avatar: "${avatar.printings[randomIndex].image_uris.art_crop}",
                  email: "${email}",
                  name: "${name}",
                  password: "${password}"
                ) {
                  _id
                  admin
                  avatar
                  name
                  token
                }
              }
            `
          };
        }
      });
    },
    [sendRequest, storeUserInfo]
  );

  const requestPasswordReset = React.useCallback(
    async function (email) {
      await sendRequest({
        callback: () => {
          setErrorMessages((prevState) => {
            return [
              ...prevState,
              'A link to reset your password has been sent.  Please check your email inbox and your spam folder.'
            ];
          });
        },
        load: true,
        operation: 'requestPasswordReset',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(email: "${email}")
              }
            `
          };
        }
      });
    },
    [sendRequest]
  );

  const submitPasswordReset = React.useCallback(
    async function (email, password, reset_token) {
      await sendRequest({
        callback: storeUserInfo,
        load: true,
        operation: 'submitPasswordReset',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  email: "${email}"
                  password: "${password}"
                  reset_token: "${reset_token}"
                ) {
                  _id
                  admin
                  avatar
                  name
                  token
                }
              }
            `
          };
        }
      });
    },
    [sendRequest, storeUserInfo]
  );

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
          isLoggedIn: !!authenticationState.token,
          loading,
          login,
          logout,
          register,
          requestPasswordReset,
          submitPasswordReset
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
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route
                    path="/account/:accountID"
                    element={<ContextualizedAccountPage />}
                  />
                  <Route
                    path="/blog/:blogPostID"
                    element={<ContextualizedBlogPostPage />}
                  />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/classy" element={<Classy />} />
                  <Route
                    path="/cube/:cubeID"
                    element={<ContextualizedCubePage />}
                  />
                  <Route
                    path="/deck/:deckID"
                    element={<ContextualizedDeckPage />}
                  />
                  <Route
                    path="/event/:eventID"
                    element={<ContextualizedEventPage />}
                  />
                  <Route
                    path="/match/:matchID"
                    element={<ContextualizedMatchPage />}
                  />
                  <Route
                    path="/reset/:resetToken"
                    element={<PasswordReset />}
                  />
                  <Route path="/resources" element={<Resources />} />
                </Routes>
              </React.Suspense>
            </main>
            <Footer />
          </BrowserRouter>
        </CardCacheContext.Provider>
      </AuthenticationContext.Provider>
    </ErrorContext.Provider>
  );
}
