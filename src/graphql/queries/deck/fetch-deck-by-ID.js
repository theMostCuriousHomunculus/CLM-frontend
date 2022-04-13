import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function fetchDeckByID({ headers: { DeckID }, queryString, signal }) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          fetchDeckByID ${queryString}
        }
      `
    },
    headers: { DeckID },
    signal
  });
}
