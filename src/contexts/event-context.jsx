import React, { createContext, useContext, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import usePopulate from '../hooks/populate-hook';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Event from '../pages/Event';
import RTCPeerConnectionConfig from '../constants/rtc-peer-connection-config';
import { AuthenticationContext } from './Authentication';
import { CardCacheContext } from './CardCache';
import { createAnswerEvent } from '../graphql/mutations/create-answer-event';
import { fancyFetch } from '../functions/fancy-fetch';
import { sendICECandidate } from '../graphql/mutations/send-ICE-candidate';
import { sendRTCSessionDescription } from '../graphql/mutations/send-RTC-session-description';

export const EventContext = createContext({
  loading: false,
  eventState: {
    _id: null,
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
  peerConnectionsRef: { current: [] }
});

export default function ContextualizedEventPage() {
  const { eventID } = useParams();
  const { addCardsToCache } = useContext(CardCacheContext);
  const { userID } = useContext(AuthenticationContext);
  const [eventState, setEventState] = useState({
    _id: eventID,
    finished: false,
    host: {
      _id: null,
      avatar: null,
      name: '...'
    },
    name: null,
    players: []
  });
  const peerConnectionsRef = useRef([]);
  const cardQuery = `
    _id
    scryfall_id
  `;
  const eventQuery = `
    _id
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
      answers {
        remote_account {
          _id
        }
        sdp
        type
      }
      current_pack {
        ${cardQuery}
      }
      ice_candidates {
        candidate
        sdpMLineIndex
        sdpMid
        usernameFragment
      }
      mainboard {
        ${cardQuery}
      }
      offers {
        remote_account {
          _id
        }
        sdp
        type
      }
      sideboard {
        ${cardQuery}
      }
    }
  `;
  const { loading, sendRequest } = useRequest();
  const { populateCachedScryfallData } = usePopulate();

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

    /* const me = data.players.find((plr) => plr.account._id === userID);

    for (let offerIndex = 0; offerIndex < me.offers.length; offerIndex++) {
      const { remote_account, type, sdp } = me.offers[offerIndex];
      const remoteAccountIndex = data.players.findIndex(
        (plr) => plr.account._id === remote_account._id
      );

      if (!peerConnectionsRef.current[remoteAccountIndex].remoteDescription) {
        console.log('initial offer received');
        await peerConnectionsRef.current[
          remoteAccountIndex
        ].setRemoteDescription({ type, sdp });
        console.log('initial remote description set');
        const answer = await peerConnectionsRef.current[
          remoteAccountIndex
        ].createAnswer();
        console.log('initial answer set');
        await peerConnectionsRef.current[
          remoteAccountIndex
        ].setLocalDescription(answer);
        console.log('initial local description set');

        // createAnswerEvent({
        //   headers: { EventID: eventID },
        //   accountID: data.players[remoteAccountIndex].account._id,
        //   sdp: answer.sdp
        // });
        sendRTCSessionDescription({
          variables: {
            accountID: data.players[remoteAccountIndex].account._id,
            room: eventID,
            sdp: answer.sdp,
            type: answer.type
          }
        })
      } else {
        const newPeerConnection = new RTCPeerConnection(
          RTCPeerConnectionConfig
        );

        newPeerConnection.account = data.players[remoteAccountIndex].account;
        newPeerConnection.onicecandidate = onIceCandidate;
        newPeerConnection.onnegotiationneeded = onNegotiationNeeded;

        const oldPeerConnection =
          peerConnectionsRef.current[remoteAccountIndex];
        peerConnectionsRef.current[remoteAccountIndex] = newPeerConnection;
        oldPeerConnection.close();
        await peerConnectionsRef.current[
          remoteAccountIndex
        ].setRemoteDescription({ type, sdp });
        console.log('new peer connection object created; old destroyed');
        const answer = await peerConnectionsRef.current[
          remoteAccountIndex
        ].createAnswer();
        console.log('new answer created');
        await peerConnectionsRef.current[
          remoteAccountIndex
        ].setLocalDescription(answer);
        console.log('new local description set');

        createAnswerEvent({
          headers: { EventID: eventID },
          accountID: data.players[remoteAccountIndex].account._id,
          sdp: answer.sdp
        });
      }
    }

    for (let answerIndex = 0; answerIndex < me.answers.length; answerIndex++) {
      const { remote_account, type, sdp } = me.answers[answerIndex];
      const remoteAccountIndex = data.players.findIndex(
        (plr) => plr.account._id === remote_account._id
      );

      await peerConnectionsRef.current[remoteAccountIndex].setRemoteDescription(
        { type, sdp }
      );
      console.log('remote description set');
    }

    for (
      let playerIndex = 0;
      playerIndex < data.players.length;
      playerIndex++
    ) {
      // if (
      //   !!peerConnectionsRef.current[playerIndex] &&
      //   data.players[playerIndex].ice_candidates &&
      //   eventState.players[playerIndex]
      // ) {
      //   for (
      //     let candidateIndex =
      //       eventState.players[playerIndex].ice_candidates.length;
      //     candidateIndex < data.players[playerIndex].ice_candidates.length;
      //     candidateIndex++
      //   ) {
      //     peerConnectionsRef.current[playerIndex].addIceCandidate(
      //       data.players[playerIndex].ice_candidates[candidateIndex]
      //     );
      //   }
      // }
      for (
        let candidateIndex = 0;
        candidateIndex < data.players[playerIndex].ice_candidates.length;
        candidateIndex++
      ) {
        if (!!peerConnectionsRef.current[playerIndex]) {
          peerConnectionsRef.current[playerIndex].addIceCandidate(
            data.players[playerIndex].ice_candidates[candidateIndex]
          );
          console.log('ice candidate added');
        }
      }
    }*/

    setEventState(data);
  }

  function onIceCandidate(event) {
    if (!event.candidate) {
      return;
    }
    console.log('ice candidate found');
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
    console.log('negotiation needed');
    const { _id: accountID } = this.account;
    const offer = await this.createOffer();
    await this.setLocalDescription(offer);

    sendRequest({
      headers: { EventID: eventID },
      operation: 'createOfferEvent',
      get body() {
        return {
          query: `
            mutation($accountID: ID!, $sdp: String!) {
              ${this.operation} (accountID: $accountID, sdp: $sdp) {
                ${eventQuery}
              }
            }
          `,
          variables: {
            accountID,
            sdp: offer.sdp
          }
        };
      }
    });
  }

  async function fetchEventByID() {
    await sendRequest({
      callback: async (data) => {
        updateEventState(data);
        for (let index = 0; index < data.players.length; index++) {
          if (data.players[index].account._id !== userID) {
            const newPeerConnection = new RTCPeerConnection(
              RTCPeerConnectionConfig
            );

            newPeerConnection.account = data.players[index].account;
            newPeerConnection.onicecandidate = onIceCandidate;
            newPeerConnection.onnegotiationneeded = onNegotiationNeeded;
            peerConnectionsRef.current[index] = newPeerConnection;
          } else {
            peerConnectionsRef.current[index] = null;
          }
        }
      },
      headers: { EventID: eventID },
      load: true,
      operation: 'fetchEventByID',
      get body() {
        return {
          query: `
              query {
                ${this.operation} {
                  ${eventQuery}
                }
              }
            `
        };
      }
    });
  }

  useSubscribe({
    cleanup: () => {
      for (const peerConnection of peerConnectionsRef.current) {
        if (peerConnection) {
          peerConnection.close();
        }
      }
    },
    headers: { eventID },
    queryString: eventQuery,
    setup: fetchEventByID,
    subscriptionType: 'subscribeEvent',
    update: updateEventState
  });

  return (
    <EventContext.Provider
      value={{
        loading,
        eventState,
        peerConnectionsRef
      }}
    >
      <Event />
    </EventContext.Provider>
  );
}
