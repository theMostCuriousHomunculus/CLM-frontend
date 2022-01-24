import { asyncFancyFetch, syncFancyFetch } from '../../functions/fancy-fetches';

export async function asyncRemoveBasics({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardIDs, component }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cardIDs: [ID]!, $component: DeckComponentEnum!) {
          removeBasics (cardIDs: $cardIDs, component: $component) ${queryString}
        }
      `,
      variables: { cardIDs, component }
    },
    headers: { EventID },
    signal
  });
}

export function syncRemoveBasics({
  headers: { EventID },
  variables: { cardIDs, component }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($cardIDs: [ID]!, $component: DeckComponentEnum!) {
          removeBasics (cardIDs: $cardIDs, component: $component) {
            _id
          }
        }
      `,
      variables: { cardIDs, component }
    },
    headers: { EventID }
  });
}

export default function removeBasics({
  headers: { EventID },
  queryString,
  signal,
  variables: { cardIDs, component }
}) {
  if (queryString) {
    return (async function () {
      return await asyncRemoveBasics({
        headers: { EventID },
        queryString,
        signal,
        variables: { cardIDs, component }
      });
    })();
  } else {
    syncRemoveBasics({
      headers: { EventID },
      variables: { cardIDs, component }
    });
  }
}
