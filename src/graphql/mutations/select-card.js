import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function selectCard({ headers, cardID }) {
  fancyFetch({
    body: {
      query: `
        mutation($cardID: ID!) {
          selectCard (cardID: $cardID) {
            _id
          }
        }
      `,
      variables: { cardID }
    },
    headers
  });
}

export async function asyncAddBasics() {}
