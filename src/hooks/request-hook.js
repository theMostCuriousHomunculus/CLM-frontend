import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { AuthenticationContext } from '../contexts/authentication-context';
import { ErrorContext } from '../contexts/error-context';

export default function useRequest () {

  const { setErrorMessages } = useContext(ErrorContext);
  const { token } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);

  const activeRequests = useRef([]);

  const sendRequest = useCallback(async function ({
    url = process.env.REACT_APP_GRAPHQL_HTTP_URL,
    method = 'POST',
    operation = null,
    body = null,
    headers = {}
  }) {

    if (token && url === process.env.REACT_APP_GRAPHQL_HTTP_URL) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(body);
    }
      
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

      let responseData;

      if (response.status === 204) {
        // 204 is successful response but no content
        responseData = {};
      } else {
        responseData = await response.json();
      }

      activeRequests.current = activeRequests.current.filter(controller => controller !== abortController);

      if (responseData.errors) {
        for (const error of responseData.errors) {
          setErrorMessages(prevState => [...prevState, error.message]);
        }
        throw new Error();
      } else if (!response.ok) {
        throw new Error(responseData.message);
      } else if (operation) {
        return responseData.data[operation];
      } else {
        return responseData;
      }

    } catch (error) {
      if (error.message) {
        setErrorMessages(prevState => [...prevState, error.message]);
      }
      throw error;
    } finally {
      setLoading(false);
    }

  }, [setErrorMessages, token]);

  useEffect(() => {
    return () => activeRequests.current.forEach(controller => controller.abort());
  }, []);

  return { loading, sendRequest };
};