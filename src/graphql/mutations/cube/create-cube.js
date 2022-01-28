import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncCreateCube({
  queryString,
  signal,
  variables: { cobraID, description, name }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($cobraID: String, $description: String, $name: String!) {
          createCube (cobraID: $cobraID, description: $description, name: $name) ${queryString}
        }
      `,
      variables: { cobraID, description, name }
    },
    signal
  });
}

export function syncCreateCube({ variables: { cobraID, description, name } }) {
  syncFancyFetch({
    body: {
      query: `
      mutation($cobraID: String, $description: String, $name: String!) {
        createCube (cobraID: $cobraID, description: $description, name: $name) {
            _id
          }
        }
      `,
      variables: { cobraID, description, name }
    }
  });
}

export default function createCube({
  queryString,
  signal,
  variables: { cobraID, description, name }
}) {
  if (queryString) {
    return (async function () {
      return await asyncCreateCube({
        queryString,
        signal,
        variables: { cobraID, description, name }
      });
    })();
  } else {
    syncCreateCube({
      variables: { cobraID, description, name }
    });
  }
}
