import {
  asyncFancyFetch,
  syncFancyFetch
} from '../../../functions/fancy-fetches';

export async function asyncEditCube({
  headers: { CubeID },
  queryString,
  signal,
  variables: { description, image, name, published }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($description: String, $image: String, $name: String, $published: Boolean) {
          editCube (description: $description, image: $image, name: $name, published: $published) ${queryString}
        }
      `,
      variables: { description, image, name, published }
    },
    headers: { CubeID },
    signal
  });
}

export function syncEditCube({
  headers: { CubeID },
  variables: { description, image, name, published }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($description: String, $image: String, $name: String, $published: Boolean) {
          editCube (description: $description, image: $image, name: $name, published: $published) {
            _id
          }
        }
      `,
      variables: { description, image, name, published }
    },
    headers: { CubeID }
  });
}

export default function editCube({
  headers: { CubeID },
  queryString,
  signal,
  variables: { description, image, name, published }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditCube({
        headers: { CubeID },
        queryString,
        signal,
        variables: { description, image, name, published }
      });
    })();
  } else {
    syncEditCube({
      headers: { CubeID },
      variables: { description, image, name, published }
    });
  }
}
