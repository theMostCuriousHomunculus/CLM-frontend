import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function fetchAccountByID({
  headers: { AccountID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          fetchAccountByID ${queryString}
        }
      `
    },
    headers: { AccountID },
    signal
  });
}
