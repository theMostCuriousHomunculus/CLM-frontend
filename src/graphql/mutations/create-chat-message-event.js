import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function createChatMessageEvent({ headers, variables: { body } }) {
  fancyFetch({
    body: {
      query: `
        mutation($body: String!) {
          createChatMessageEvent (body: $body) {
            _id
          }
        }
      `,
      variables: { body }
    },
    headers
  });
}

export async function asyncCreateChatMessageEvent() {}
