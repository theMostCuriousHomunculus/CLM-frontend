import { asyncFancyFetch, syncFancyFetch } from '../../functions/fancy-fetches';

export async function asyncCreateEventChatMessage({
  headers: { EventID },
  queryString,
  signal,
  variables: { body }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($body: String!) {
          createEventChatMessage (body: $body) ${queryString}
        }
      `,
      variables: { body }
    },
    headers: { EventID },
    signal
  });
}

export function syncCreateEventChatMessage({
  headers: { EventID },
  variables: { body }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($body: String!) {
          createEventChatMessage (body: $body) {
            _id
          }
        }
      `,
      variables: { body }
    },
    headers: { EventID }
  });
}

export default function createEventChatMessage({
  headers: { EventID },
  queryString,
  signal,
  variables: { body }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateEventChatMessage({
        headers: { EventID },
        queryString,
        signal,
        variables: { body }
      });
    })();
  } else {
    syncCreateEventChatMessage({
      headers: { EventID },
      variables: { body }
    });
  }
}
