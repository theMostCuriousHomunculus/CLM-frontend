import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function sendRTCSessionDescription({
  variables: { accountIDs, room, sdp, type }
}) {
  fancyFetch({
    body: {
      query: `
        mutation($accountIDs: [ID]!, $room: String!, $sdp: String!, $type: RTCSessionDescriptionTypeEnum!) {
          sendRTCSessionDescription (accountIDs: $accountIDs, room: $room, sdp: $sdp, type: $type)
        }
      `,
      variables: { accountIDs, room, sdp, type }
    }
  });
  console.log('RTCSessionDescription sent!');
}

export async function asyncSendRTCSessionDescription() {}
