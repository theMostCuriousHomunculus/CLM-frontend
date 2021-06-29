import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Match from '../pages/Match';

export const MatchContext = createContext({
  loading: false,
  matchQuery: '',
  matchState: null,
  setMatchState: () => null,
  adjustEnergyCounters: () => null,
  adjustLifeTotal: () => null,
  adjustPoisonCounters: () => null,
  changeFaceDownImage: () => null,
  concedeGame: () => null,
  createCopies: () => null,
  createTokens: () => null,
  dragCard: () => null,
  drawCard: () => null,
  fetchMatchByID: () => null,
  flipCard: () => null,
  flipCoin: () => null,
  gainControlOfCard: () => null,
  revealCard: () => null,
  rollDice: () => null,
  shuffleLibrary: () => null,
  tapUntapCards: () => null,
  transferCard: () => null,
  turnCard: () => null,
  viewCard: () => null,
  viewZone: () => null
});

export default function ContextualizedMatchPage() {

  const [matchState, setMatchState] = React.useState({
    _id: useParams().matchId,
    game_winners: [],
    log: [],
    players: [
      {
        account: {
          _id: "A",
          avatar: "",
          name: "..."
        },
        battlefield: [],
        energy: 0,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: 20,
        mainboard: [],
        poison: 0,
        sideboard: [],
        temporary: []
      },
      {
        account: {
          _id: "B",
          avatar: "",
          name: "..."
        },
        battlefield: [],
        energy: 0,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: 20,
        mainboard: [],
        poison: 0,
        sideboard: [],
        temporary: []
      }
    ],
    stack: []
  });
  const matchQuery = `
    _id
    game_winners {
      _id
      avatar
      name
    }
    log
    players {
      account {
        _id
        avatar
        name
      }
      battlefield {
        _id
        back_image
        controller {
          _id
        }
        counters {
          counterAmount
          counterType
        }
        face_down
        face_down_image
        flipped
        image
        isCopyToken
        name
        owner {
          _id
        }
        tapped
        targets {
          _id
        }
        tokens {
          name
          scryfall_id
        }
        visibility {
          _id
        }
        x_coordinate
        y_coordinate
        z_index
      }
      energy
      exile {
        _id
        back_image
        controller {
          _id
        }
        counters {
          counterAmount
          counterType
        }
        face_down
        face_down_image
        flipped
        image
        name
        owner {
          _id
        }
        targets {
          _id
        }
        tokens {
          name
          scryfall_id
        }
        visibility {
          _id
        }
      }
      graveyard {
        _id
        back_image
        controller {
          _id
        }
        counters {
          counterAmount
          counterType
        }
        face_down_image
        flipped
        image
        name
        owner {
          _id
        }
        targets {
          _id
        }
        tokens {
          name
          scryfall_id
        }
        visibility {
          _id
        }
      }
      hand {
        _id
        back_image
        controller {
          _id
        }
        face_down
        face_down_image
        flipped
        image
        name
        owner {
          _id
        }
        targets {
          _id
        }
        tokens {
          name
          scryfall_id
        }
        visibility {
          _id
        }
      }
      library {
        _id
        back_image
        controller {
          _id
        }
        face_down
        face_down_image
        image
        name
        owner {
          _id
        }
        visibility {
          _id
        }
      }
      life
      poison
      mainboard {
        _id
        back_image
        image
        name
      }
      sideboard {
        _id
        back_image
        controller {
          _id
        }
        face_down_image
        image
        name
        owner {
          _id
        }
        visibility {
          _id
        }
      }
      temporary {
        _id
        back_image
        controller {
          _id
        }
        face_down_image
        image
        index
        isCopyToken
        name
        owner {
          _id
        }
        visibility {
          _id
        }
      }
    }
    stack {
      _id
      back_image
      controller {
        _id
      }
      counters {
        counterAmount
        counterType
      }
      face_down
      face_down_image
      image
      isCopyToken
      name
      owner {
        _id
      }
      targets {
        _id
      }
      tokens {
        name
        scryfall_id
      }
      visibility {
        _id
      }
    }
  `;
  const { loading, sendRequest } = useRequest();

  const adjustEnergyCounters = React.useCallback(async function (energy) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'adjustEnergyCounters',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(energy: ${energy}) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const adjustLifeTotal = React.useCallback(async function (life) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'adjustLifeTotal',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(life: ${life}) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const adjustPoisonCounters = React.useCallback(async function (poison) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'adjustPoisonCounters',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(poison: ${poison}) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const changeFaceDownImage = React.useCallback(async function (cardID, faceDownImage, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'changeFaceDownImage',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  faceDownImage: ${faceDownImage},
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const concedeGame = React.useCallback(async function () {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'concedeGame',
      get body() {
        return {
          query: `
            mutation: {
              ${this.operation} {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const createCopies = React.useCallback(async function (cardID, controllerID, numberOfCopies, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'createCopies',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  controllerID: "${controllerID}",
                  numberOfCopies: ${numberOfCopies},
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  // TODO Implement
  const createTokens = React.useCallback(async function (numberOfTokens, scryfallID) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'createTokens',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  numberOfCopies: ${numberOfTokens},
                  scryfallID: "${scryfallID}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const dragCard = React.useCallback(async function (cardID, xCoordinate, yCoordinate, zIndex) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'dragCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  xCoordinate: ${xCoordinate},
                  yCoordinate: ${yCoordinate},
                  zIndex: ${zIndex}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const drawCard = React.useCallback(async function () {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'drawCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const fetchMatchByID = React.useCallback(async function () {
    await sendRequest({
      callback: data => setMatchState(data),
      headers: { MatchID: matchState._id },
      load: true,
      operation: 'fetchMatchByID',
      get body() {
        return {
          query: `
            query {
              ${this.operation} {
                ${matchQuery}
              }
            }
          `
        }
      }
    });
  }, [matchQuery, matchState._id, sendRequest]);

  // TODO: Implement
  const flipCard = React.useCallback(async function (cardID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'flipCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const flipCoin = React.useCallback(async function () {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'flipCoin',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const gainControlOfCard = React.useCallback(async function (cardID, controllerID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'gainControlOfCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  controllerID: "${controllerID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const revealCard = React.useCallback(async function (cardID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'revealCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const rollDice = React.useCallback(async function  (sides) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'rollDice',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(sides: ${sides}) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const shuffleLibrary = React.useCallback(async function () {
    await sendRequest({
      headers: { MatchID: matchState._id},
      operation: 'shuffleLibrary',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const tapUntapCards = React.useCallback(async function  (cardIDs) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'tapUntapCards',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardIDs: [${cardIDs.map(id => '"' + id + '"')}]
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  // TODO: Improve
  const transferCard = React.useCallback(async function (cardID, destinationZone, originZone, reveal, shuffle, index) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'transferCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  destinationZone: ${destinationZone},
                  ${Number.isInteger(index) ? 'index: ' + index + ',\n' : ''}
                  originZone: ${originZone},
                  reveal: ${reveal},
                  shuffle: ${shuffle}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const turnCard = React.useCallback(async function (cardID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'turnCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  const viewCard = React.useCallback(async function (cardID, controllerID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'viewCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  controllerID: "${controllerID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  // TODO: Implement
  const viewZone = React.useCallback(async function (controllerID, zone) {
    await sendRequest({
      headers: { MatchID: matchState._id },
      operation: 'viewZone',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  controllerID: "${controllerID}",
                  zone: ${zone}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [matchState._id, sendRequest]);

  return (
    <MatchContext.Provider
      value={{
        loading,
        matchQuery,
        matchState,
        setMatchState,
        adjustEnergyCounters,
        adjustLifeTotal,
        adjustPoisonCounters,
        changeFaceDownImage,
        concedeGame,
        createCopies,
        createTokens,
        dragCard,
        drawCard,
        fetchMatchByID,
        flipCard,
        flipCoin,
        gainControlOfCard,
        revealCard,
        rollDice,
        shuffleLibrary,
        tapUntapCards,
        transferCard,
        turnCard,
        viewCard,
        viewZone
      }}
    >
      <Match />
    </MatchContext.Provider>
  );
};