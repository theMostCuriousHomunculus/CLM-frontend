import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncToggleMainboardSideboardEvent({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardID }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          toggleMainboardSideboardEvent (cardID: $cardID) ${queryString}
        }
      `,
      variables: { cardID }
    },
    headers: { EventID },
    signal
  });
}

export function syncToggleMainboardSideboardEvent({
  headers: { EventID },
  variables: { cardID }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          toggleMainboardSideboardEvent (cardID: $cardID) {
            _id
          }
        }
      `,
      variables: { cardID }
    },
    headers: { EventID }
  });
}

export default function toggleMainboardSideboardEvent({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardID }
}) {
  if (queryString) {
    return (async function () {
      return await asyncToggleMainboardSideboardEvent({
        headers: { EventID },
        queryString,
        signal,
        variables: { cardID }
      });
    })();
  } else {
    syncToggleMainboardSideboardEvent({
      headers: { EventID },
      variables: { cardID }
    });
  }
}
