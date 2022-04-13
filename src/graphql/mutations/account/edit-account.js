import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncEditAccount({
  queryString,
  signal,
  variables: { avatar, email, measurement_system, name, radius }
}) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($avatar: String, $email: String, $measurement_system: MeasurementSystemEnum, $name: String, $radius: Int) {
          editAccount (avatar: $avatar, email: $email, measurement_system: $measurement_system, name: $name, radius: $radius) ${queryString}
        }
      `,
      variables: {
        avatar,
        email,
        measurement_system,
        name,
        radius
      }
    },
    signal
  });
}

export function syncEditAccount({
  variables: { avatar, email, measurement_system, name, radius }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($avatar: String, $email: String, $measurement_system: MeasurementSystemEnum, $name: String, $radius: Int) {
          editAccount (avatar: $avatar, email: $email, measurement_system: $measurement_system, name: $name, radius: $radius) {
            _id
          }
        }
      `,
      variables: {
        avatar,
        email,
        measurement_system,
        name,
        radius
      }
    }
  });
}

export default function editAccount({
  queryString,
  signal,
  variables: { avatar, email, measurement_system, name, radius }
}) {
  if (queryString) {
    return (async function () {
      return await asyncEditAccount({
        queryString,
        signal,
        variables: {
          avatar,
          email,
          measurement_system,
          name,
          radius
        }
      });
    })();
  } else {
    syncEditAccount({
      variables: {
        avatar,
        email,
        measurement_system,
        name,
        radius
      }
    });
  }
}
