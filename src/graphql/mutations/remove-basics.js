import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function removeBasics({ headers, cardIDs, component }) {
  fancyFetch({
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
    headers
  });
}

export async function asyncRemoveBasics() {}
