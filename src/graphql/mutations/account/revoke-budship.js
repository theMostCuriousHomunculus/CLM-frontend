import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncRevokeBudship({ queryString, signal, variables: { other_user_id } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!) {
          revokeBudship (other_user_id: $other_user_id) ${queryString}
        }
      `,
      variables: { other_user_id }
    },
    signal
  });
}

export function syncRevokeBudship({ variables: { other_user_id } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($other_user_id: String!) {
          revokeBudship (other_user_id: $other_user_id) {
            _id
          }
        }
      `,
      variables: { other_user_id }
    }
  });
}

export default function revokeBudship({ queryString, signal, variables: { other_user_id } }) {
  if (queryString) {
    return (async function () {
      return await asyncRevokeBudship({
        queryString,
        signal,
        variables: { other_user_id }
      });
    })();
  } else {
    syncRevokeBudship({
      variables: { other_user_id }
    });
  }
}
