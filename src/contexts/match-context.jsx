import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Match from '../pages/Match';
import { AuthenticationContext } from './authentication-context';

export const MatchContext = createContext({
  loading: false,
  bottomPlayerState: {
    account: {
      _id: null,
      avatar: null,
      name: null
    },
    battlefield: [],
    energy: null,
    exile: [],
    graveyard: [],
    hand: [],
    library: [],
    life: null,
    mainboard: [],
    poison: null,
    sideboard: [],
    temporary: []
  },
  matchState: {
    _id: null,
    game_winners: [],
    log: [],
    players: [
      {
        account: {
          _id: null,
          avatar: null,
          name: null
        },
        battlefield: [],
        energy: null,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: null,
        mainboard: [],
        poison: null,
        sideboard: [],
        temporary: []
      },
      {
        account: {
          _id: null,
          avatar: null,
          name: null
        },
        battlefield: [],
        energy: null,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: null,
        mainboard: [],
        poison: null,
        sideboard: [],
        temporary: []
      }
    ],
    stack: []
  },
  numberInputDialogInfo: {
    buttonText: null,
    defaultValue: null,
    inputLabel: null,
    title: null,
    updateFunction: null
  },
  topPlayerState: {
    account: {
      _id: null,
      avatar: null,
      name: null
    },
    battlefield: [],
    energy: null,
    exile: [],
    graveyard: [],
    hand: [],
    library: [],
    life: null,
    mainboard: [],
    poison: null,
    sideboard: [],
    temporary: []
  },
  setBottomPlayerState: () => null,
  setMatchState: () => null,
  setNumberInputDialogInfo: () => null,
  adjustCounters: () => null,
  adjustEnergyCounters: () => null,
  adjustLifeTotal: () => null,
  adjustPoisonCounters: () => null,
  changeFaceDownImage: () => null,
  concedeGame: () => null,
  createCopies: () => null,
  createTokens: () => null,
  destroyCopyToken: () => null,
  dragCard: () => null,
  drawCard: () => null,
  flipCard: () => null,
  flipCoin: () => null,
  gainControlOfCard: () => null,
  mulligan: () => null,
  ready: () => null,
  revealCard: () => null,
  rollDice: () => null,
  shuffleLibrary: () => null,
  tapUntapCards: () => null,
  toggleMainboardSideboardMatch: () => null,
  transferCard: () => null,
  turnCard: () => null,
  viewCard: () => null,
  viewZone: () => null
});

export default function ContextualizedMatchPage() {
  const { userID } = React.useContext(AuthenticationContext);
  const { matchID } = useParams();
  const [matchState, setMatchState] = React.useState({
    _id: matchID,
    game_winners: [],
    log: [],
    players: [
      {
        account: {
          _id: 'A',
          avatar: '',
          name: '...'
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
          _id: 'B',
          avatar: '',
          name: '...'
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
  const [numberInputDialogInfo, setNumberInputDialogInfo] = React.useState({
    buttonText: null,
    defaultValue: null,
    inputLabel: null,
    title: null,
    updateFunction: null
  });
  const [bottomPlayerState, setBottomPlayerState] = React.useState(
    matchState.players[0]
  );
  const [topPlayerState, setTopPlayerState] = React.useState(
    matchState.players[1]
  );
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
        flipped
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
        cmc
        back_image
        image
        mana_cost
        name
        scryfall_id
        set
        type_line
        visibility {
          _id
        }
      }
      sideboard {
        _id
        back_image
        cmc
        image
        mana_cost
        name
        scryfall_id
        set
        type_line
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
        isCopyToken
        library_position
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
      visibility {
        _id
      }
    }
  `;
  const { loading, sendRequest } = useRequest();
  const { requestSubscription } = useSubscribe();

  React.useEffect(() => {
    // this allows a more smooth drag and drop experience
    const me = matchState.players.find(
      (player) => player.account._id === userID
    );

    if (me) {
      if (JSON.stringify(bottomPlayerState) !== JSON.stringify(me))
        setBottomPlayerState(me);

      const opponent = matchState.players.find(
        (player) => player.account._id !== userID
      );

      if (JSON.stringify(topPlayerState) !== JSON.stringify(opponent))
        setTopPlayerState(opponent);
    }

    if (!me) {
      setBottomPlayerState(matchState.players[0]);
      setTopPlayerState(matchState.players[1]);
    }
  }, [matchState, userID]);

  const adjustCounters = React.useCallback(
    async function (cardID, counterAmount, counterType, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'adjustCounters',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                counterAmount: ${counterAmount},
                counterType: "${counterType}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const adjustEnergyCounters = React.useCallback(
    async function (energy) {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const adjustLifeTotal = React.useCallback(
    async function (life) {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const adjustPoisonCounters = React.useCallback(
    async function (poison) {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const changeFaceDownImage = React.useCallback(
    async function (cardID, faceDownImage, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'changeFaceDownImage',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                faceDownImage: ${faceDownImage},
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const concedeGame = React.useCallback(
    async function () {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'concedeGame',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const createCopies = React.useCallback(
    async function (cardID, controllerID, numberOfCopies, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'createCopies',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                controllerID: "${controllerID}",
                numberOfCopies: ${numberOfCopies},
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const createTokens = React.useCallback(
    async function ({ back_image, image, name }, numberOfTokens) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'createTokens',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                ${back_image ? 'back_image: "' + back_image + '",\n' : ''}
                image: "${image}",
                name: "${name}",
                numberOfTokens: ${numberOfTokens}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const destroyCopyToken = React.useCallback(
    async function (cardID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'destroyCopyToken',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const dragCard = React.useCallback(
    async function (cardID, xCoordinate, yCoordinate, zIndex) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'dragCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                xCoordinate: ${xCoordinate},
                yCoordinate: ${yCoordinate},
                zIndex: ${zIndex}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const drawCard = React.useCallback(
    async function () {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const fetchMatchByID = React.useCallback(
    async function () {
      await sendRequest({
        callback: (data) => setMatchState(data),
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
          };
        }
      });
    },
    [matchQuery, matchState._id, sendRequest]
  );

  const flipCard = React.useCallback(
    async function (cardID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'flipCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const flipCoin = React.useCallback(
    async function () {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const gainControlOfCard = React.useCallback(
    async function (cardID, controllerID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'gainControlOfCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                controllerID: "${controllerID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const mulligan = React.useCallback(
    async function () {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'mulligan',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const ready = React.useCallback(
    async function () {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'ready',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation} {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const revealCard = React.useCallback(
    async function (cardID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'revealCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const rollDice = React.useCallback(
    async function (sides) {
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const shuffleLibrary = React.useCallback(
    async function () {
      await sendRequest({
        headers: { MatchID: matchState._id },
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
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const tapUntapCards = React.useCallback(
    async function (cardIDs) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'tapUntapCards',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardIDs: [${cardIDs.map((id) => '"' + id + '"')}]
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const toggleMainboardSideboardMatch = React.useCallback(
    async function (cardID) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'toggleMainboardSideboardMatch',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(cardID: "${cardID}") {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  // TODO: Improve
  const transferCard = React.useCallback(
    async function (
      cardID,
      destinationZone,
      originZone,
      reveal,
      shuffle,
      index
    ) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'transferCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                destinationZone: ${destinationZone},
                ${Number.isInteger(index) ? 'index: ' + index + ',\n' : ''}
                originZone: ${originZone},
                reveal: ${reveal},
                shuffle: ${shuffle}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const turnCard = React.useCallback(
    async function (cardID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'turnCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  const viewCard = React.useCallback(
    async function (cardID, controllerID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'viewCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                controllerID: "${controllerID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  // TODO: Expand
  const viewZone = React.useCallback(
    async function (controllerID, zone) {
      await sendRequest({
        headers: { MatchID: matchState._id },
        operation: 'viewZone',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                controllerID: "${controllerID}",
                zone: ${zone}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [matchState._id, sendRequest]
  );

  React.useEffect(() => {
    requestSubscription({
      headers: { matchID },
      queryString: matchQuery,
      setup: fetchMatchByID,
      subscriptionType: 'subscribeMatch',
      update: setMatchState
    });
  }, [matchID, matchQuery, fetchMatchByID, requestSubscription]);

  return (
    <MatchContext.Provider
      value={{
        loading,
        bottomPlayerState,
        matchState,
        numberInputDialogInfo,
        topPlayerState,
        setBottomPlayerState,
        setMatchState,
        setNumberInputDialogInfo,
        adjustCounters,
        adjustEnergyCounters,
        adjustLifeTotal,
        adjustPoisonCounters,
        changeFaceDownImage,
        concedeGame,
        createCopies,
        createTokens,
        destroyCopyToken,
        dragCard,
        drawCard,
        flipCard,
        flipCoin,
        gainControlOfCard,
        mulligan,
        ready,
        revealCard,
        rollDice,
        shuffleLibrary,
        tapUntapCards,
        toggleMainboardSideboardMatch,
        transferCard,
        turnCard,
        viewCard,
        viewZone
      }}
    >
      <Match />
    </MatchContext.Provider>
  );
}
