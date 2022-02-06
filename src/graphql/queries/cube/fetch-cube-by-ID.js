import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function fetchCubeByID({
  headers: { CubeID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          fetchCubeByID ${queryString}
        }
      `
    },
    headers: { CubeID },
    signal
  });
}
