import React, { createContext, useState } from 'react';

export const ErrorContext = createContext({
  errorMessages: [],
  setErrorMessages: () => {
    // don't return anything
  }
});

export function ErrorProvider({ children }) {
  const [errorMessages, setErrorMessages] = useState([]);

  return (
    <ErrorContext.Provider
      value={{
        errorMessages,
        setErrorMessages
      }}
    >
      {children}
    </ErrorContext.Provider>
  );
}
