import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncEditModule({
  headers: { CubeID },
  queryString,
  signal,
  variables: { moduleID, name }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($moduleID: ID!, $name: String) {
          editModule (moduleID: $moduleID, name: $name) ${queryString}
        }
      `,
      variables: { moduleID, name }
    },
    headers: { CubeID },
    signal
  });
}

export function syncEditModule({
  headers: { CubeID },
  variables: { moduleID, name }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($moduleID: ID!, $name: String) {
          editModule (moduleID: $moduleID, name: $name) {
            _id
          }
        }
      `,
      variables: { moduleID, name }
    },
    headers: { CubeID }
  });
}

export default function editModule({
  headers: { CubeID },
  queryString,
  signal,
  variables: { moduleID, name }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditModule({
        headers: { CubeID },
        queryString,
        signal,
        variables: { moduleID, name }
      });
    })();
  } else {
    syncEditModule({
      headers: { CubeID },
      variables: { moduleID, name }
    });
  }
}
