import { useCallback, useContext } from 'react';
import { createClient } from 'graphql-ws';

import { AuthenticationContext } from '../contexts/authentication-context';

export default function useSubscribe() {
  const { token } = useContext(AuthenticationContext);

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
          authToken: token,
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
    [token]
  );

  return { requestSubscription };
}
