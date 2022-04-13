import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncLogin({ queryString, signal, variables: { email, password } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $password: String!) {
          login (email: $email, password: $password) ${queryString}
        }
      `,
      variables: { email, password }
    },
    signal
  });
}

export function syncLogin({ variables: { email, password } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $password: String!) {
          login (email: $email, password: $password) {
            _id
          }
        }
      `,
      variables: { email, password }
    }
  });
}

export default function login({ queryString, signal, variables: { email, password } }) {
  if (queryString) {
    return (async function () {
      return await asyncLogin({
        queryString,
        signal,
        variables: { email, password }
      });
    })();
  } else {
    syncLogin({
      variables: { email, password }
    });
  }
}
