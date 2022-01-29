import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncDeleteCube({
  headers: { CubeID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation {
          deleteCube ${queryString}
        }
      `
    },
    headers: { CubeID },
    signal
  });
}

export function syncDeleteCube({ headers: { CubeID } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation {
          deleteCube {
            _id
          }
        }
      `
    },
    headers: { CubeID }
  });
}

export default function deleteCube({
  headers: { CubeID },
  queryString,
  signal
}) {
  if (queryString) {
    return (async function () {
      return await asyncDeleteCube({
        headers: { CubeID },
        queryString,
        signal
      });
    })();
  } else {
    syncDeleteCube({ headers: { CubeID } });
  }
}
