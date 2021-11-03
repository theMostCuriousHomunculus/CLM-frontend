import { createContext } from 'react';

export const AuthenticationContext = createContext({
  avatar: null,
  isAdmin: false,
  isLoggedIn: false,
  loading: false,
  login: () => null,
  logout: () => null,
  register: () => null,
  requestPasswordReset: () => null,
  submitPasswordReset: () => null,
  token: null,
  userID: null,
  userName: null
});
