import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function fetchBlogPostByID({ headers: { BlogPostID }, queryString, signal }) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          fetchBlogPostByID ${queryString}
        }
      `
    },
    headers: { BlogPostID },
    signal
  });
}
