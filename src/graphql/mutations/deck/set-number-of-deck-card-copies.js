import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncSetNumberOfDeckCardCopies({
  headers: { DeckID },
  queryString,
  signal,
  variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($mainboard_count: Int!, $maybeboard_count: Int!, $scryfall_id: String!, $sideboard_count: Int!) {
          setNumberOfDeckCardCopies (mainboard_count: $mainboard_count, maybeboard_count: $maybeboard_count, scryfall_id: $scryfall_id, sideboard_count: $sideboard_count) ${queryString}
        }
      `,
      variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
    },
    headers: { DeckID },
    signal
  });
}

export function syncSetNumberOfDeckCardCopies({
  headers: { DeckID },
  variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($mainboard_count: Int!, $maybeboard_count: Int!, $scryfall_id: String!, $sideboard_count: Int!) {
          setNumberOfDeckCardCopies (mainboard_count: $mainboard_count, maybeboard_count: $maybeboard_count, scryfall_id: $scryfall_id, sideboard_count: $sideboard_count) {
            _id
          }
        }
      `,
      variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
    },
    headers: { DeckID }
  });
}

export default function setNumberOfDeckCardCopies({
  headers: { DeckID },
  queryString,
  signal,
  variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
}) {
  if (queryString) {
    return (async function () {
      return await asyncSetNumberOfDeckCardCopies({
        headers: { DeckID },
        queryString,
        signal,
        variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
      });
    })();
  } else {
    syncSetNumberOfDeckCardCopies({
      headers: { DeckID },
      variables: { mainboard_count, maybeboard_count, scryfall_id, sideboard_count }
    });
  }
}
