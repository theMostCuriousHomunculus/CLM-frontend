import { useEffect } from 'react';
import { createClient } from 'graphql-ws';
import Cookies from 'js-cookie';

export default function useSubscribe({
  cleanup = () => null,
  condition = true,
  connectionInfo = {},
  dependencies = [],
  queryString = '',
  setup = () => null,
  subscriptionType = '',
  update = () => null
}) {
  useEffect(() => {
    if (condition) {
      (async function () {
        await setup();
      })();

      const client = createClient({
        connectionParams: {
          authToken: Cookies.get('authentication_token'),
          ...connectionInfo
        },
        url: process.env.REACT_APP_WS_URL
      });

      (async function () {
        function onNext(message) {
          if (message.data) {
            update(message.data[subscriptionType]);
          } else {
            console.log(message);
          }
        }

        await new Promise((resolve, reject) => {
          client.subscribe(
            {
              query: `
                subscription {
                  ${subscriptionType} ${queryString}
                }
              `
            },
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
    }
  }, [Cookies.get('authentication_token'), ...dependencies]);
}
