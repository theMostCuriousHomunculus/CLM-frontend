import { createContext } from 'react';

export const AuthenticationContext = createContext({
  avatar: null,
  clearUserInfo: () => {},
  isAdmin: false,
  isLoggedIn: false,
  storeUserInfo: () => {},
  token: null,
  userID: null,
  userName: null
});
