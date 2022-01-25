import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncSelectCard({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardID }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          selectCard (cardID: $cardID) ${queryString}
        }
      `,
      variables: { cardID }
    },
    headers: { EventID },
    signal
  });
}

export function syncSelectCard({
  headers: { EventID },
  variables: { cardID }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          selectCard (cardID: $cardID) {
            _id
          }
        }
      `,
      variables: { cardID }
    },
    headers: { EventID }
  });
}

export default function selectCard({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardID }
}) {
  if (queryString) {
    return (async function () {
      asyncSelectCard({
        headers: { EventID },
        queryString,
        signal,
        variables: { cardID }
      });
    })();
  } else {
    syncSelectCard({
      headers: { EventID },
      variables: { cardID }
    });
  }
}
