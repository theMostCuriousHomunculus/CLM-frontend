import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncCloneCube({
  headers: { CubeID },
  queryString,
  signal
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation {
          cloneCube ${queryString}
        }
      `
    },
    headers: { CubeID },
    signal
  });
}

export function syncCloneCube({ headers: { CubeID } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation {
          cloneCube {
            _id
          }
        }
      `
    },
    headers: { CubeID }
  });
}

export default function cloneCube({
  headers: { CubeID },
  queryString,
  signal
}) {
  if (queryString) {
    return (async function () {
      return await asyncCloneCube({
        headers: { CubeID },
        queryString,
        signal
      });
    })();
  } else {
    syncCloneCube({
      headers: { CubeID }
    });
  }
}
