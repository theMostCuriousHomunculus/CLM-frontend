import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Event from '../pages/Event';
import { AuthenticationContext } from './authentication-context';
import { CardCacheContext } from './card-cache-context';

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
        current_pack: [],
        mainboard: [],
        sideboard: []
      }
    ]
  },
  myState: {
    account: {
      _id: null,
      avatar: null,
      name: null
    },
    current_pack: [],
    mainboard: [],
    sideboard: []
  },
  setEventState: () => null,
  setMyState: () => null,
  addBasics: () => null,
  removeBasics: () => null,
  selectCard: () => null,
  toggleMainboardSideboardEvent: () => null
});

export default function ContextualizedEventPage() {
  const { eventID } = useParams();
  const { addCardsToCache, scryfallCardDataCache } =
    React.useContext(CardCacheContext);
  const { userId } = React.useContext(AuthenticationContext);
  const [eventState, setEventState] = React.useState({
    _id: eventID,
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
          _id: userId,
          avatar: null,
          name: '...'
        },
        current_pack: [],
        mainboard: [],
        sideboard: []
      }
    ]
  });
  const [myState, setMyState] = React.useState({
    account: {
      _id: userId,
      avatar: null,
      name: null
    },
    current_pack: [],
    mainboard: [],
    sideboard: []
  });
  const cardQuery = `
    _id
    name
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
  const { loading, sendRequest } = useRequest();
  const { requestSubscription } = useSubscribe();

  React.useEffect(() => {
    const me = eventState.players.find((plr) => plr.account._id === userId);
    const updateNeeded =
      (me.current_pack ? me.current_pack.length : -1) !==
        (myState.current_pack ? myState.current_pack.length : -1) ||
      me.mainboard.length !== myState.mainboard.length ||
      me.sideboard.length !== myState.sideboard.length;

    if (updateNeeded) setMyState(me);
  }, [eventState, myState, userId]);

  const addBasics = React.useCallback(
    async function (
      { name, oracle_id, scryfall_id },
      component,
      numberOfCopies
    ) {
      await sendRequest({
        headers: { EventID: eventState._id },
        operation: 'addBasics',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                component: ${component},
                name: "${name}",
                numberOfCopies: ${numberOfCopies},
                oracle_id: "${oracle_id}",
                scryfall_id: "${scryfall_id}"
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [eventState._id, sendRequest]
  );

  const fetchEventByID = React.useCallback(
    async function () {
      await sendRequest({
        callback: async function (data) {
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
              player.current_pack.forEach((card, index, array) => {
                array[index] = {
                  ...scryfallCardDataCache.current[card.scryfall_id],
                  ...card
                };
              });
            }

            if (player.mainboard) {
              player.mainboard.forEach((card, index, array) => {
                array[index] = {
                  ...scryfallCardDataCache.current[card.scryfall_id],
                  ...card
                };
              });
            }

            if (player.sideboard) {
              player.sideboard.forEach((card, index, array) => {
                array[index] = {
                  ...scryfallCardDataCache.current[card.scryfall_id],
                  ...card
                };
              });
            }
          }

          setEventState(data);
        },
        headers: { EventID: eventState._id },
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
    },
    [
      addCardsToCache,
      eventQuery,
      eventState._id,
      scryfallCardDataCache,
      sendRequest
    ]
  );

  const removeBasics = React.useCallback(
    async function (cardIDs, component) {
      await sendRequest({
        headers: { EventID: eventState._id },
        operation: 'removeBasics',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardIDs: [${cardIDs.map((cardID) => '"' + cardID + '"')}],
                component: ${component}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [eventState._id, sendRequest]
  );

  const selectCard = React.useCallback(
    async function (cardID) {
      await sendRequest({
        headers: { EventID: eventState._id },
        operation: 'selectCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(_id: "${cardID}") {
                _id
              }
            }
          `
          };
        }
      });
    },
    [eventState._id, sendRequest]
  );

  const toggleMainboardSideboardEvent = React.useCallback(
    async function (cardID) {
      await sendRequest({
        headers: { EventID: eventState._id },
        operation: 'toggleMainboardSideboardEvent',
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
    [eventState._id, sendRequest]
  );

  React.useEffect(() => {
    requestSubscription({
      headers: { eventID },
      queryString: eventQuery,
      setup: fetchEventByID,
      subscriptionType: 'subscribeEvent',
      update: setEventState
    });
  }, [eventID, eventQuery, fetchEventByID, requestSubscription]);

  return (
    <EventContext.Provider
      value={{
        loading,
        eventState,
        myState,
        setEventState,
        setMyState,
        addBasics,
        removeBasics,
        selectCard,
        toggleMainboardSideboardEvent
      }}
    >
      <Event />
    </EventContext.Provider>
  );
}
