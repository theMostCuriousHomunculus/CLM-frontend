import { syncFancyFetch } from '../../functions/fancy-fetches';

export default function sendRTCSessionDescription({
  variables: { accountIDs, room, sdp, type }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($accountIDs: [ID]!, $room: String!, $sdp: String!, $type: RTCSessionDescriptionTypeEnum!) {
          sendRTCSessionDescription (accountIDs: $accountIDs, room: $room, sdp: $sdp, type: $type)
        }
      `,
      variables: { accountIDs, room, sdp, type }
    }
  });
}
