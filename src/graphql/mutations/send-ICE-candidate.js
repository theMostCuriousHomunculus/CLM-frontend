import { fancyFetch, asyncFancyFetch } from '../../functions/fancy-fetch';

export function sendICECandidate({
  variables: {
    accountIDs,
    candidate,
    room,
    sdpMLineIndex,
    sdpMid,
    usernameFragment
  }
}) {
  fancyFetch({
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

export async function asyncSendICECandidate() {}
