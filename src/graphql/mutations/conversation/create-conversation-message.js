import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncCreateConversationMessage({
  headers,
  queryString,
  signal,
  variables: { body, participants }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($body: String!, $participants: [String]) {
          createConversationMessage (body: $body, participants: $participants) ${queryString}
        }
      `,
      variables: { body, participants }
    },
    headers,
    signal
  });
}

export function syncCreateConversationMessage({ headers, variables: { body, participants } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($body: String!, $participants: [String]) {
          createConversationMessage (body: $body, participants: $participants) {
            _id
          }
        }
      `,
      variables: { body, participants }
    },
    headers
  });
}

export default function createConversationMessage({
  headers,
  queryString,
  signal,
  variables: { body, participants }
}) {
  let ConversationID;

  if (headers) {
    ConversationID = headers.ConversationID;
  }

  if (queryString) {
    return (async function () {
      return await asyncCreateConversationMessage({
        headers: ConversationID ? { ConversationID } : {},
        queryString,
        signal,
        variables: { body, participants }
      });
    })();
  } else {
    syncCreateConversationMessage({
      headers: ConversationID ? { ConversationID } : {},
      variables: { body, participants }
    });
  }
}
