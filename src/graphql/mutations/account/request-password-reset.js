import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncRequestPasswordReset({ signal, variables: { email } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($email: String!) {
          requestPasswordReset (email: $email)
        }
      `,
      variables: { email }
    },
    signal
  });
}

export function syncRequestPasswordReset({ variables: { email } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($email: String!) {
          requestPasswordReset (email: $email)
        }
      `,
      variables: { email }
    }
  });
}

export default function requestPasswordReset({ signal, variables: { email } }) {
  if (signal) {
    return (async function () {
      return await asyncRequestPasswordReset({
        signal,
        variables: { email }
      });
    })();
  } else {
    syncRequestPasswordReset({
      variables: { email }
    });
  }
}
