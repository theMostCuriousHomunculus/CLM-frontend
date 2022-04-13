import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncSubmitPasswordReset({
  queryString,
  signal,
  variables: { email, password, reset_token }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $password: String!, $reset_token: String!) {
          submitPasswordReset (email: $email, password: $password, reset_token: $reset_token) ${queryString}
        }
      `,
      variables: { email, password, reset_token }
    },
    signal
  });
}

export function syncSubmitPasswordReset({ variables: { email, password, reset_token } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $password: String!, $reset_token: String!) {
          submitPasswordReset (email: $email, password: $password, reset_token: $reset_token) {
            _id
          }
        }
      `,
      variables: { email, password, reset_token }
    }
  });
}

export default function submitPasswordReset({
  queryString,
  signal,
  variables: { email, password, reset_token }
}) {
  if (queryString) {
    return (async function () {
      return await asyncSubmitPasswordReset({
        queryString,
        signal,
        variables: { email, password, reset_token }
      });
    })();
  } else {
    syncSubmitPasswordReset({
      variables: { email, password, reset_token }
    });
  }
}
