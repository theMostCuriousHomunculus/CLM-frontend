import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncAddBasics({
  headers: { EventID },
  queryString,
  signal,
  variables: { component, name, numberOfCopies, scryfall_id }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($component: DeckComponentEnum!, $name: String!, $numberOfCopies: Int!, $scryfall_id: String!) {
          addBasics (component: $component, name: $name, numberOfCopies: $numberOfCopies, scryfall_id: $scryfall_id) ${queryString}
        }
      `,
      variables: { component, name, numberOfCopies, scryfall_id }
    },
    headers: { EventID },
    signal
  });
}

export function syncAddBasics({
  headers: { EventID },
  variables: { component, name, numberOfCopies, scryfall_id }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($component: DeckComponentEnum!, $name: String!, $numberOfCopies: Int!, $scryfall_id: String!) {
          addBasics (component: $component, name: $name, numberOfCopies: $numberOfCopies, scryfall_id: $scryfall_id) {
            _id
          }
        }
      `,
      variables: { component, name, numberOfCopies, scryfall_id }
    },
    headers: { EventID }
  });
}

export default function addBasics({
  headers: { EventID },
  queryString,
  signal,
  variables: { component, name, numberOfCopies, scryfall_id }
}) {
  if (queryString) {
    syncAddBasics({
      headers: { EventID },
      variables: {
        component,
        name,
        numberOfCopies,
        scryfall_id
      }
    });
  } else {
    return (async function () {
      return await asyncAddBasics({
        headers: { EventID },
        queryString,
        signal,
        variables: { component, name, numberOfCopies, scryfall_id }
      });
    })();
  }
}
