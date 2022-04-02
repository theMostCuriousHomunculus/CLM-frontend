import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function authenticate({ queryString, signal }) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          authenticate ${queryString}
        }
      `
    },
    signal
  });
}
