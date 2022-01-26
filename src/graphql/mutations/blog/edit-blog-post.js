import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncEditBlogPost({
  headers: { BlogPostID },
  queryString,
  signal,
  variables: { body, image, published, subtitle, title }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($body: String, $image: String, $published: Boolean, $subtitle: String, $title: String) {
          editBlogPost (body: $body, image: $image, published: $published, subtitle: $subtitle, title: $title) ${queryString}
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
    headers: { BlogPostID },
    signal
  });
}

export function syncEditBlogPost({
  headers: { BlogPostID },
  variables: { body, image, published, subtitle, title }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($body: String, $image: String, $published: Boolean, $subtitle: String, $title: String) {
          editBlogPost (body: $body, image: $image, published: $published, subtitle: $subtitle, title: $title) {
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
    },
    headers: { BlogPostID }
  });
}

export default function editBlogPost({
  headers: { BlogPostID },
  queryString,
  signal,
  variables: { body, image, published, subtitle, title }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditBlogPost({
        headers: { BlogPostID },
        queryString,
        signal,
        variables: { body, image, published, subtitle, title }
      });
    })();
  } else {
    syncEditBlogPost({
      headers: { BlogPostID },
      variables: { body, image, published, subtitle, title }
    });
  }
}
