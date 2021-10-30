import { createContext } from 'react';

export const AuthenticationContext = createContext({
  isAdmin: false,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null,
  userId: null
});
