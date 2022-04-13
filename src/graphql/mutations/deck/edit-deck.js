import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncEditDeck({
  headers: { DeckID },
  queryString,
  signal,
  variables: { description, format, image, name, published }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($description: String, $format: FormatEnum, $image: String, $name: String, $published: Boolean) {
          editDeck (description: $description, format: $format, image: $image, name: $name, published: $published) ${queryString}
        }
      `,
      variables: { description, format, image, name, published }
    },
    headers: { DeckID },
    signal
  });
}

export function syncEditDeck({
  headers: { DeckID },
  variables: { description, format, image, name, published }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($description: String, $format: FormatEnum, $image: String, $name: String, $published: Boolean) {
          editDeck (description: $description, format: $format, image: $image, name: $name, published: $published) {
            _id
          }
        }
      `,
      variables: { description, format, image, name, published }
    },
    headers: { DeckID }
  });
}

export default function editDeck({
  headers: { DeckID },
  queryString,
  signal,
  variables: { description, format, image, name, published }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditDeck({
        headers: { DeckID },
        queryString,
        signal,
        variables: { description, format, image, name, published }
      });
    })();
  } else {
    syncEditDeck({
      headers: { DeckID },
      variables: { description, format, image, name, published }
    });
  }
}
