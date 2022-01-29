import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncDeleteDeck({
  headers: { DeckID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation {
          deleteDeck ${queryString}
        }
      `
    },
    headers: { DeckID },
    signal
  });
}

export function syncDeleteDeck({ headers: { DeckID } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation {
          deleteDeck {
            _id
          }
        }
      `
    },
    headers: { DeckID }
  });
}

export default function deleteDeck({
  headers: { DeckID },
  queryString,
  signal
}) {
  if (queryString) {
    return (async function () {
      return await asyncDeleteDeck({
        headers: { DeckID },
        queryString,
        signal
      });
    })();
  } else {
    syncDeleteDeck({ headers: { DeckID } });
  }
}
