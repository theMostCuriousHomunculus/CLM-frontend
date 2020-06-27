import { useCallback, useEffect, useRef, useState } from 'react';

export const useRequest = () => {

  const [errorMessage, setErrorMessage] = useState();
  const [loading, setLoading] = useState(false);

  const activeRequests = useRef([]);

  const sendRequest = useCallback(async function (url, method = 'GET', body = null, headers = {}) {
      
    setLoading(true);
    const abortController = new AbortController();
    activeRequests.current.push(abortController);

    try {
      const response = await fetch(url, {
        method,
        body,
        headers,
        signal: abortController.signal
      });

      const responseData = await response.json();

      activeRequests.current = activeRequests.current.filter(
        abrtCntrlr => abrtCntrlr !== abortController
      );
      
      if (!response.ok) {
        throw new Error(responseData.message);
      };

      setLoading(false);
      return responseData;
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
      throw error;
    };
  }, []);

  function clearError() {
    setErrorMessage(null);
  };

  useEffect(() => {
    return () => {
      activeRequests.current.forEach(abrtCntrlr => abrtCntrlr.abort());
    };
  }, []);

  return { loading, errorMessage, sendRequest, clearError };
};