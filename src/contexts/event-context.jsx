import React, { createContext, useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import fetchEventByID from '../graphql/queries/event/fetch-event-by-ID';
import sendICECandidate from '../graphql/mutations/send-ICE-candidate';
import sendRTCSessionDescription from '../graphql/mutations/send-RTC-session-description';
import usePopulate from '../hooks/populate-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Event from '../pages/Event';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import RTCPeerConnectionConfig from '../constants/rtc-peer-connection-config';
import { AuthenticationContext } from './Authentication';
import { CardCacheContext } from './CardCache';
import { ErrorContext } from './Error';

export const EventContext = createContext({
  abortControllerRef: { current: new AbortController() },
  eventState: {
    _id: null,
    chat_log: [],
    finished: false,
    host: {
      _id: null,
      avatar: null,
      name: '...'
    },
    name: null,
    players: [
      {
        account: {
          _id: null,
          avatar: null,
          name: '...'
        },
        answers: [],
        current_pack: [],
        ice_candidates: [],
        mainboard: [],
        offers: [],
        sideboard: []
      }
    ]
  },
  loading: false,
  me: {
    account: {
      _id: null,
      avatar: null,
      name: '...'
    },
    answers: [],
    current_pack: [],
    ice_candidates: [],
    mainboard: [],
    offers: [],
    sideboard: []
  },
  peerConnectionsRef: { current: [] }
});

export default function ContextualizedEventPage() {
  const { eventID } = useParams();
  const { userID } = useContext(AuthenticationContext);
  const { addCardsToCache } = useContext(CardCacheContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const { populateCachedScryfallData } = usePopulate();
  const abortControllerRef = useRef(new AbortController());
  const peerConnectionsRef = useRef([]);
  const [eventState, setEventState] = useState({
    _id: eventID,
    chat_log: [],
    finished: false,
    host: {
      _id: null,
      avatar: null,
      name: '...'
    },
    name: null,
    players: []
  });
  const [loading, setLoading] = useState(true);

  const cardQuery = `
  _id
  scryfall_id
`;
  const eventQuery = `
  _id
  chat_log {
    _id
    author {
      _id
      avatar
      name
    }
    body
    createdAt
  }
  finished
  host {
    _id
  }
  name
  players {
    account {
      _id
      avatar
      name
    }
    current_pack {
      ${cardQuery}
    }
    mainboard {
      ${cardQuery}
    }
    sideboard {
      ${cardQuery}
    }
  }
`;

  async function updateEventState(data) {
    const cardSet = new Set();

    for (const player of data.players) {
      if (player.current_pack) {
        for (const card of player.current_pack) {
          cardSet.add(card.scryfall_id);
        }
      }

      if (player.mainboard) {
        for (const card of player.mainboard) {
          cardSet.add(card.scryfall_id);
        }
      }

      if (player.sideboard) {
        for (const card of player.sideboard) {
          cardSet.add(card.scryfall_id);
        }
      }
    }

    await addCardsToCache([...cardSet]);

    for (const player of data.players) {
      if (player.current_pack) {
        player.current_pack.forEach(populateCachedScryfallData);
      }

      if (player.mainboard) {
        player.mainboard.forEach(populateCachedScryfallData);
      }

      if (player.sideboard) {
        player.sideboard.forEach(populateCachedScryfallData);
      }
    }

    setEventState(data);
  }

  async function handleIncomingWebRTCMessage(data) {
    const playerIndex = eventState.players.findIndex(
      (player) => player.account._id === data.remote_account._id
    );
    if (Number.isInteger(playerIndex) && !!peerConnectionsRef.current[playerIndex]) {
      switch (data.__typename) {
        case 'ICECandidate':
          const { candidate, sdpMLineIndex, sdpMid, usernameFragment } = data;
          peerConnectionsRef.current[playerIndex].addIceCandidate({
            candidate,
            sdpMLineIndex,
            sdpMid,
            usernameFragment
          });
          break;
        case 'RTCSessionDescription':
          const { sdp, type } = data;
          switch (type) {
            case 'offer':
              await peerConnectionsRef.current[playerIndex].setRemoteDescription({ type, sdp });
              const answer = await peerConnectionsRef.current[playerIndex].createAnswer();
              await peerConnectionsRef.current[playerIndex].setLocalDescription(answer);
              sendRTCSessionDescription({
                variables: {
                  accountIDs: [eventState.players[playerIndex].account._id],
                  room: eventID,
                  sdp: answer.sdp,
                  type: answer.type
                }
              });
              break;
            case 'answer':
              peerConnectionsRef.current[playerIndex].setRemoteDescription({
                type,
                sdp
              });
              break;
            default:
              setErrorMessages((prevState) => [
                ...prevState,
                'Unknown message type received from server.'
              ]);
          }
          break;
        default:
          setErrorMessages((prevState) => [
            ...prevState,
            'Unknown message type received from server.'
          ]);
      }
    }
  }

  function onIceCandidate(event) {
    if (!event.candidate) {
      return;
    }

    const {
      candidate: {
        address,
        candidate,
        component,
        foundation,
        port,
        priority,
        protocol,
        relatedAddress,
        relatedPort,
        sdpMLineIndex,
        sdpMid,
        tcpType,
        type,
        usernameFragment
      }
    } = event;

    sendICECandidate({
      variables: {
        accountIDs: eventState.players
          .map((player) => player.account._id)
          .filter((id) => id !== userID),
        candidate,
        room: eventID,
        sdpMLineIndex,
        sdpMid,
        usernameFragment
      }
    });
  }

  async function onNegotiationNeeded() {
    const offer = await this.createOffer();
    await this.setLocalDescription(offer);
    sendRTCSessionDescription({
      variables: {
        accountIDs: eventState.players
          .map((player) => player.account._id)
          .filter((id) => id !== userID),
        room: eventID,
        sdp: offer.sdp,
        type: offer.type
      }
    });
  }

  useSubscribe({
    cleanup: () => abortControllerRef.current.abort(),
    connectionInfo: { eventID },
    dependencies: [eventID, userID],
    queryString: eventQuery,
    setup: async () => {
      try {
        abortControllerRef.current = new AbortController();
        const data = await fetchEventByID({
          headers: { EventID: eventID },
          queryString: `{${eventQuery}}`,
          signal: abortControllerRef.current.signal
        });
        await updateEventState(data.data.fetchEventByID);
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
      } finally {
        setLoading(false);
      }
    },
    subscriptionType: 'subscribeEvent',
    update: updateEventState
  });

  useSubscribe({
    cleanup: () => {
      for (const peerConnection of peerConnectionsRef.current) {
        if (peerConnection) {
          peerConnection.close();
        }
      }
    },
    connectionInfo: { room: eventID },
    dependencies: [
      eventID,
      eventState.players.map((player) => player.account._id).toString(),
      userID
    ],
    queryString: `
      __typename
      ... on ICECandidate {
        candidate
        remote_account {
          _id
        }
        sdpMLineIndex
        sdpMid
        usernameFragment
      }
      ... on RTCSessionDescription {
        remote_account {
          _id
        }
        sdp
        type
      }
    `,
    setup: () => {
      peerConnectionsRef.current = [];
      for (let index = 0; index < eventState.players.length; index++) {
        if (eventState.players[index].account._id !== userID) {
          const newPeerConnection = new RTCPeerConnection(RTCPeerConnectionConfig);

          newPeerConnection.onicecandidate = onIceCandidate;
          newPeerConnection.onnegotiationneeded = onNegotiationNeeded;
          peerConnectionsRef.current[index] = newPeerConnection;
        }
      }
    },
    subscriptionType: 'subscribeWebRTC',
    update: handleIncomingWebRTCMessage
  });

  return (
    <EventContext.Provider
      value={{
        abortControllerRef,
        eventState,
        me: eventState.players.find((player) => player.account._id === userID),
        peerConnectionsRef
      }}
    >
      {loading ? <LoadingSpinner /> : <Event />}
    </EventContext.Provider>
  );
}
