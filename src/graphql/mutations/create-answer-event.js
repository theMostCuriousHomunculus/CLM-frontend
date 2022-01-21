import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function createAnswerEvent({ headers, accountID, sdp }) {
  fancyFetch({
    body: {
      query: `
        mutation($accountID: ID!, $sdp: String!) {
          createAnswerEvent (accountID: $accountID, sdp: $sdp) {
            _id
          }
        }
      `,
      variables: { accountID, sdp }
    },
    headers
  });
}

export async function asyncCreateAnswerEvent() {}
