import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncCreateBlogPost({
  queryString,
  signal,
  variables: { body, image, published, subtitle, title }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($body: String!, $image: String!, $published: Boolean, $subtitle: String, $title: String!) {
          createBlogPost (body: $body, image: $image, published: $published, subtitle: $subtitle, title: $title) ${queryString}
        }
      `,
      variables: {
        body,
        image,
        published,
        subtitle,
        title
      }
    },
    signal
  });
}

export function syncCreateBlogPost({
  variables: { body, image, published, subtitle, title }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($body: String!, $image: String!, $published: Boolean, $subtitle: String, $title: String!) {
          createBlogPost (body: $body, image: $image, published: $published, subtitle: $subtitle, title: $title) {
            _id
          }
        }
      `,
      variables: {
        body,
        image,
        published,
        subtitle,
        title
      }
    }
  });
}

export default function createBlogPost({
  queryString,
  signal,
  variables: { body, image, published, subtitle, title }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateBlogPost({
        queryString,
        signal,
        variables: { body, image, published, subtitle, title }
      });
    })();
  } else {
    syncCreateBlogPost({
      variables: { body, image, published, subtitle, title }
    });
  }
}
