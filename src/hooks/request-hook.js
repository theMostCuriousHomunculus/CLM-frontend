import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { AuthenticationContext } from '../contexts/Authentication';
import { ErrorContext } from '../contexts/Error';

export default function useRequest() {
  const { setErrorMessages } = useContext(ErrorContext);
  const { isLoggedIn, token } = useContext(AuthenticationContext);
  const [loading, setLoading] = useState(false);
  const activeRequests = useRef([]);

  const sendRequest = useCallback(
    async function ({
      body = null,
      callback = () => null,
      headers = {},
      load = false,
      method = 'POST',
      operation = null,
      url = process.env.REACT_APP_HTTP_URL
    }) {
      if (url === process.env.REACT_APP_HTTP_URL && isLoggedIn) {
        headers.Authorization = `Bearer ${token}`;
      }

      if (body && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(body);
      }

      if (load) {
        setLoading(true);
      }

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

        activeRequests.current = activeRequests.current.filter(
          (controller) => controller !== abortController
        );

        if (responseData.errors) {
          for (const error of responseData.errors) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          }
        } else if (operation) {
          await callback(responseData.data[operation]);
        } else {
          await callback(responseData);
        }
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
    },
    [setErrorMessages]
  );

  useEffect(() => {
    return () =>
      activeRequests.current.forEach((controller) => controller.abort());
  }, []);

  return { loading, sendRequest };
}
