import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncRegister({ queryString, signal, variables: { email, name, password } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $name: String!, $password: String!) {
          register (email: $email, name: $name, password: $password) ${queryString}
        }
      `,
      variables: { email, name, password }
    },
    signal
  });
}

export function syncRegister({ variables: { email, name, password } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($email: String!, $name: String!, $password: String!) {
          register (email: $email, name: $name, password: $password) {
            _id
          }
        }
      `,
      variables: { email, name, password }
    }
  });
}

export default function register({ queryString, signal, variables: { email, name, password } }) {
  if (queryString) {
    return (async function () {
      return await asyncRegister({
        queryString,
        signal,
        variables: { email, name, password }
      });
    })();
  } else {
    syncRegister({
      variables: { email, name, password }
    });
  }
}
