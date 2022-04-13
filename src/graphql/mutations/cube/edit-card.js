import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncEditCard({
  headers: { CubeID },
  queryString,
  signal,
  variables: {
    cardID,
    componentID,
    cmc,
    color_identity,
    notes,
    scryfall_id,
    type_line
  }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!, $componentID: ID!, $cmc: Int, $color_identity: [String!], $notes: String, $scryfall_id: String, $type_line: String) {
          editCard (cardID: $cardID, componentID: $componentID, cmc: $cmc, color_identity: $color_identity, notes: $notes, scryfall_id: $scryfall_id, type_line: $type_line) ${queryString}
        }
      `,
      variables: {
        cardID,
        componentID,
        cmc,
        color_identity,
        notes,
        scryfall_id,
        type_line
      }
    },
    headers: { CubeID },
    signal
  });
}

export function syncEditCard({
  headers: { CubeID },
  variables: {
    cardID,
    componentID,
    cmc,
    color_identity,
    notes,
    scryfall_id,
    type_line
  }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($cardID: ID!, $componentID: ID!, $cmc: Int, $color_identity: [String!], $notes: String, $scryfall_id: String, $type_line: String) {
          editCard (cardID: $cardID, componentID: $componentID, cmc: $cmc, color_identity: $color_identity, notes: $notes, scryfall_id: $scryfall_id, type_line: $type_line) {
            _id
          }
        }
      `,
      variables: {
        cardID,
        componentID,
        cmc,
        color_identity,
        notes,
        scryfall_id,
        type_line
      }
    },
    headers: { CubeID }
  });
}

export default function editCard({
  headers: { CubeID },
  queryString,
  signal,
  variables: {
    cardID,
    componentID,
    cmc,
    color_identity,
    notes,
    scryfall_id,
    type_line
  }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditCard({
        headers: { CubeID },
        queryString,
        signal,
        variables: {
          cardID,
          componentID,
          cmc,
          color_identity,
          notes,
          scryfall_id,
          type_line
        }
      });
    })();
  } else {
    syncEditCard({
      headers: { CubeID },
      variables: {
        cardID,
        componentID,
        cmc,
        color_identity,
        notes,
        scryfall_id,
        type_line
      }
    });
  }
}
