import { useEffect } from 'react';
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';

export default function useSubscribe({
  cleanup = () => null,
  headers = {},
  queryString = '',
  setup = () => null,
  subscriptionType = '',
  update = () => null
}) {
  useEffect(() => {
    (async function () {
      await setup();
    })();

    const client = createClient({
      connectionParams: {
        authToken: Cookies.get('authentication_token'),
        ...headers
      },
      url: process.env.REACT_APP_WS_URL
    });

    (async function () {
      function onNext(message) {
        update(message.data[subscriptionType]);
      }

      await new Promise((resolve, reject) => {
        const query = `subscription {\n${subscriptionType} {\n${queryString}\n}\n}`;
        client.subscribe(
          { query },
          {
            complete: resolve,
            error: reject,
            next: onNext
          }
        );
      });
    })();

    return () => {
      cleanup();
      client.dispose();
    };
  }, [Cookies.get('authentication_token')]);
}
