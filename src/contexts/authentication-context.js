import { createContext } from 'react';

export const AuthenticationContext = createContext({
  avatar: null,
  isAdmin: false,
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  name: null,
  token: null,
  userId: null
});