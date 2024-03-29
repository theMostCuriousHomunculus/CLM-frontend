import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import Cookies from 'js-cookie';

import { ErrorContext } from '../contexts/Error';

export default function useRequest() {
  const { setErrorMessages } = useContext(ErrorContext);
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
      if (
        url === process.env.REACT_APP_HTTP_URL &&
        !!Cookies.get('authentication_token')
      ) {
        headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
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
    [Cookies.get('authentication_token'), setErrorMessages]
  );

  // const sendRequest = useCallback(
  //   async function ({
  //     body,
  //     headers = {},
  //     method = 'POST',
  //     url = process.env.REACT_APP_HTTP_URL
  //   }) {
  //     if (
  //       url === process.env.REACT_APP_HTTP_URL &&
  //       !!Cookies.get('authentication_token')
  //     ) {
  //       headers.Authorization = `Bearer ${Cookies.get('authentication_token')}`;
  //     }

  //     if (!!body && !headers['Content-Type']) {
  //       headers['Content-Type'] = 'application/json';
  //     }

  //     setLoading(true);

  //     try {
  //       const abortController = new AbortController();
  //       activeRequests.current.push(abortController);

  //       const rawResponse = await fetch(url, {
  //         method,
  //         body: JSON.stringify(body),
  //         headers,
  //         signal: abortController.signal
  //       });

  //       let parsedResponse;

  //       if (rawResponse.status === 204) {
  //         // 204 is successful response but no content
  //         parsedResponse = {};
  //       } else {
  //         parsedResponse = await rawResponse.json();
  //       }

  //       activeRequests.current = activeRequests.current.filter(
  //         (controller) => controller !== abortController
  //       );

  //       if (parsedResponse.errors) {
  //         setErrorMessages((prevState) => [...prevState, ...parsedResponse.errors]);
  //       } else {
  //         return parsedResponse;
  //       }
  //     } catch (error) {
  //       setErrorMessages((prevState) => [...prevState, error.message]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   },
  //   [Cookies.get('authentication_token'), setErrorMessages]
  // );

  useEffect(() => {
    return () => {
      activeRequests.current.forEach((controller) => controller.abort());
    };
  }, []);

  return { loading, sendRequest };
}
