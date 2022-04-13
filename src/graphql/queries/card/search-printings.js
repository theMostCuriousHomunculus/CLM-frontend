import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function searchPrintings({ queryString, signal, variables: { oracle_id } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        query($oracle_id: String) {
          searchPrintings (oracle_id: $oracle_id) ${queryString}
        }
      `,
      variables: { oracle_id }
    },
    signal
  });
}
