import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncCloneDeck({ headers: { DeckID }, queryString, signal }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation {
          cloneDeck ${queryString}
        }
      `
    },
    headers: { DeckID },
    signal
  });
}

export function syncCloneDeck({ headers: { DeckID } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation {
          cloneDeck {
            _id
          }
        }
      `
    },
    headers: { DeckID }
  });
}

export default function cloneDeck({ headers: { DeckID }, queryString, signal }) {
  if (queryString) {
    return (async function () {
      return await asyncCloneDeck({
        headers: { DeckID },
        queryString,
        signal
      });
    })();
  } else {
    syncCloneDeck({
      headers: { DeckID }
    });
  }
}
