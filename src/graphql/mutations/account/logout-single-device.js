import { asyncFancyFetch, syncFancyFetch } from '../../../functions/fancy-fetches';

export async function asyncLogoutSingleDevice({ signal, variables: { endpoint } }) {
  return await asyncFancyFetch({
    body: {
      query: `
        mutation($endpoint: String) {
          logoutSingleDevice (endpoint: $endpoint)
        }
      `,
      variables: { endpoint }
    },
    signal
  });
}

export function syncLogoutSingleDevice({ variables: { endpoint } }) {
  syncFancyFetch({
    body: {
      query: `
        mutation($endpoint: String) {
          logoutSingleDevice (endpoint: $endpoint)
        }
      `,
      variables: { endpoint }
    }
  });
}

export default async function logoutSingleDevice({ signal }) {
  // unsubscribe from push notifications if subscribed
  let subscription;

  if ('Notification' in window && 'serviceWorker' in navigator) {
    const swreg = await navigator.serviceWorker.ready;
    subscription = await swreg.pushManager.getSubscription();
    if (subscription) {
      try {
        await subscription.unsubscribe();
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }

  // if the logged in user had a push subscription, remove it and the token from the server
  if (signal) {
    return (async function () {
      return await asyncLogoutSingleDevice({
        signal,
        variables: { endpoint: subscription.endpoint }
      });
    })();
  } else {
    syncLogoutSingleDevice({
      variables: { endpoint: subscription.endpoint }
    });
  }
}
