import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncInitiateBudRequest({
  queryString,
  signal,
  variables: { other_user_id }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!) {
          initiateBudRequest (other_user_id: $other_user_id) ${queryString}
        }
      `,
      variables: { other_user_id }
    },
    signal
  });
}

export function syncInitiateBudRequest({ variables: { other_user_id } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!) {
          initiateBudRequest (other_user_id: $other_user_id) {
            _id
          }
        }
      `,
      variables: { other_user_id }
    }
  });
}

export default function initiateBudRequest({ queryString, signal, variables: { other_user_id } }) {
  if (queryString) {
    return (async function () {
      return await asyncInitiateBudRequest({
        queryString,
        signal,
        variables: { other_user_id }
      });
    })();
  } else {
    syncInitiateBudRequest({
      variables: { other_user_id }
    });
  }
}
