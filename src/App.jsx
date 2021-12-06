import React from 'react';
import Cookies from 'js-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { makeStyles } from '@mui/styles';

import ErrorDialog from './components/miscellaneous/ErrorDialog';
import Footer from './components/miscellaneous/Footer';
import LoadingSpinner from './components/miscellaneous/LoadingSpinner';
import Navigation from './components/Main Navigation/Navigation';

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
  const classes = useStyles();

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
    <BrowserRouter>
      <Navigation />
      <main className={classes.main}>
        <React.Suspense fallback={<LoadingSpinner />}>
          <ErrorDialog />
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
            <Route path="/cube/:cubeID" element={<ContextualizedCubePage />} />
            <Route path="/deck/:deckID" element={<ContextualizedDeckPage />} />
            <Route
              path="/event/:eventID"
              element={<ContextualizedEventPage />}
            />
            <Route
              path="/match/:matchID"
              element={<ContextualizedMatchPage />}
            />
            <Route path="/reset/:resetToken" element={<PasswordReset />} />
            <Route path="/resources" element={<Resources />} />
          </Routes>
        </React.Suspense>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
