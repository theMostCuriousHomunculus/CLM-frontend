import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncAddCardToCube({
  headers: { CubeID },
  queryString,
  signal,
  variables: { componentID, scryfall_id }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($componentID: String!, $scryfall_id: String!) {
          addCardToCube (componentID: $componentID, scryfall_id: $scryfall_id) ${queryString}
        }
      `,
      variables: { componentID, scryfall_id }
    },
    headers: { CubeID },
    signal
  });
}

export function syncAddCardToCube({
  headers: { CubeID },
  variables: { componentID, scryfall_id }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($componentID: String!, $scryfall_id: String!) {
          addCardToCube (componentID: $componentID, scryfall_id: $scryfall_id) {
            _id
          }
        }
      `,
      variables: { componentID, scryfall_id }
    },
    headers: { CubeID }
  });
}

export default function addCardToCube({
  headers: { CubeID },
  queryString,
  signal,
  variables: { componentID, scryfall_id }
}) {
  if (queryString) {
    return (async function () {
      return await asyncAddCardToCube({
        headers: { CubeID },
        queryString,
        signal,
        variables: { componentID, scryfall_id }
      });
    })();
  } else {
    syncAddCardToCube({
      headers: { CubeID },
      variables: { componentID, scryfall_id }
    });
  }
}
