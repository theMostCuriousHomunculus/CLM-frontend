import { syncFancyFetch } from '../../functions/fancy-fetches';

export default function sendICECandidate({
  variables: {
    accountIDs,
    candidate,
    room,
    sdpMLineIndex,
    sdpMid,
    usernameFragment
  }
}) {
  syncFancyFetch({
    body: {
      query: `
        mutation($accountIDs: [ID]!, $candidate: String!, $room: String!, $sdpMLineIndex: Int!, $sdpMid: String!, $usernameFragment: String!) {
          sendICECandidate (accountIDs: $accountIDs, candidate: $candidate, room: $room, sdpMLineIndex: $sdpMLineIndex, sdpMid: $sdpMid, usernameFragment: $usernameFragment)
        }
      `,
      variables: {
        accountIDs,
        candidate,
        room,
        sdpMLineIndex,
        sdpMid,
        usernameFragment
      }
    }
  });
}
