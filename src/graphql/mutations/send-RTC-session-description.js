import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function sendRTCSessionDescription({
  variables: { accountID, room, sdp, type }
}) {
  fancyFetch({
    body: {
      query: `
        mutation($accountID: ID!, $room: String!, $sdp: String!, $type: RTCSessionDescriptionTypeEnum!) {
          sendRTCSessionDescription (accountID: $accountID, room: $room, sdp: $sdp, type: $type)
        }
      `,
      variables: { accountID, room, sdp, type }
    }
  });
}

export async function asyncSendRTCSessionDescription() {}
