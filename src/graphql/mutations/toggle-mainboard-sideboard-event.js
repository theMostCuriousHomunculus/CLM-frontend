import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function toggleMainboardSideboardEvent({ headers, cardID }) {
  fancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          toggleMainboardSideboardEvent (cardID: $cardID) {
            _id
          }
        }
      `,
      variables: { cardID }
    },
    headers
  });
}

export async function asyncToggleMainboardSideboardEvent() {}
