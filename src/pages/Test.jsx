import React from 'react';
import { createClient } from 'graphql-ws';

function Test() {

  const [count, setCount] = React.useState();

  React.useEffect(function () {
    const client = createClient({
      url: `ws://localhost:5000/graphql`
    });

    async function subscribe () {
      function onNext(update) {
        setCount(update.data.count);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: 'subscription { count }'
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      })
    }
    subscribe(result => console.log(result), error => console.log(error));
  }, []);

  return (
    <div>
      <h1>Subscription with GraphQL, beotch!</h1>
      {count}
    </div>
  );
};

export default Test;