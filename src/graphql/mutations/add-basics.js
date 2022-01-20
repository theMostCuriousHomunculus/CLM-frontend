import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function addBasics({
  headers,
  component,
  name,
  numberOfCopies,
  scryfall_id
}) {
  fancyFetch({
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
    headers
  });
}

export async function asyncAddBasics() {}
