import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function searchCard({ queryString, signal, variables: { search } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        query($search: String) {
          searchCard (search: $search) ${queryString}
        }
      `,
      variables: { search }
    },
    signal
  });
}
