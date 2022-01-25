import { asyncFancyFetch } from '../../../functions/fancy-fetches';

export default async function fetchEventByID({
  headers: { EventID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        query {
          fetchEventByID ${queryString}
        }
      `
    },
    headers: { EventID },
    signal
  });
}
