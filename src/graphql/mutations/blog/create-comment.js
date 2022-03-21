import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncCreateComment({
  headers: { BlogPostID },
  queryString,
  signal,
  variables: { body }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($body: String!) {
          createComment (body: $body) ${queryString}
        }
      `,
      variables: { body }
    },
    headers: { BlogPostID },
    signal
  });
}

export function syncCreateComment({ headers: { BlogPostID }, variables: { body } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($body: String!) {
          createComment (body: $body) {
            _id
          }
        }
      `,
      variables: { body }
    },
    headers: { BlogPostID }
  });
}

export default function createComment({
  headers: { BlogPostID },
  queryString,
  signal,
  variables: { body }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateComment({
        headers: { BlogPostID },
        queryString,
        signal,
        variables: { body }
      });
    })();
  } else {
    syncCreateComment({
      headers: { BlogPostID },
      variables: { body }
    });
  }
}
