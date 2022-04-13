import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncRespondToBudRequest({
  queryString,
  signal,
  variables: { other_user_id, response }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!, $response: BudRequestResponseEnum!) {
          respondToBudRequest (other_user_id: $other_user_id) ${queryString}
        }
      `,
      variables: { other_user_id, response }
    },
    signal
  });
}

export function syncRespondToBudRequest({ variables: { other_user_id, response } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!, $response: BudRequestResponseEnum!) {
          respondToBudRequest (other_user_id: $other_user_id) {
            _id
          }
        }
      `,
      variables: { other_user_id, response }
    }
  });
}

export default function respondToBudRequest({
  queryString,
  signal,
  variables: { other_user_id, response }
}) {
  if (queryString) {
    return (async function () {
      return await asyncRespondToBudRequest({
        queryString,
        signal,
        variables: { other_user_id, response }
      });
    })();
  } else {
    syncRespondToBudRequest({
      variables: { other_user_id, response }
    });
  }
}
