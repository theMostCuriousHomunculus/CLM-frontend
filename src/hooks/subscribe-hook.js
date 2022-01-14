import { useCallback, useContext } from 'react';
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';

export default function useSubscribe() {
  const requestSubscription = useCallback(
    function ({
      headers = {},
      queryString = '',
      setup = () => null,
      subscriptionType = '',
      update = () => null
    }) {
      async function initialize() {
        await setup();
      }

      initialize();

      const client = createClient({
        connectionParams: {
          authToken: Cookies.get('authentication_token'),
          ...headers
        },
        url: process.env.REACT_APP_WS_URL
      });

      async function subscribe() {
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
      }

      subscribe(
        (result) => console.log(result),
        (error) => console.log(error)
      );

      return client.dispose;
    },
    [Cookies.get('authentication_token')]
  );

  return { requestSubscription };
}
