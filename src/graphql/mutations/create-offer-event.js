import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function createOfferEvent({ headers, accountID, sdp }) {
  fancyFetch({
    body: {
      query: `
        mutation($accountID: ID!, $sdp: String!) {
          createOfferEvent (accountID: $accountID, sdp: $sdp) {
            _id
          }
        }
      `,
      variables: { accountID, sdp }
    },
    headers
  });
}

export async function asyncCreateOfferEvent() {}
