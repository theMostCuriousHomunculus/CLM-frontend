import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncCreateDeck({
  queryString,
  signal,
  variables: { description, existingListID, format, name }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($description: String, $existingListID: String, $format: FormatEnum, $name: String!) {
          createDeck (description: $description, existingListID: $existingListID, format: $format, name: $name) ${queryString}
        }
      `,
      variables: { description, existingListID, format, name }
    },
    signal
  });
}

export function syncCreateDeck({
  variables: { description, existingListID, format, name }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($description: String, $existingListID: String, $format: FormatEnum, $name: String!) {
          createDeck (description: $description, existingListID: $existingListID, format: $format, name: $name) {
            _id
          }
        }
      `,
      variables: { description, existingListID, format, name }
    }
  });
}

export default function createDeck({
  queryString,
  signal,
  variables: { description, existingListID, format, name }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateDeck({
        queryString,
        signal,
        variables: { description, existingListID, format, name }
      });
    })();
  } else {
    syncCreateDeck({
      variables: { description, existingListID, format, name }
    });
  }
}
