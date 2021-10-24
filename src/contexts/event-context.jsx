import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Event from '../pages/Event';
import { AuthenticationContext } from './authentication-context';

export const EventContext = createContext({
  loading: false,
  eventQuery: '',
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
  fetchEventByID: () => null,
  removeBasics: () => null,
  selectCard: () => null,
  toggleMainboardSideboardEvent: () => null
});

export default function ContextualizedEventPage() {
  const { userId } = React.useContext(AuthenticationContext);
  const [eventState, setEventState] = React.useState({
    _id: useParams().eventId,
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
    back_image
    cmc
    collector_number
    color_identity
    image
    keywords
    mana_cost
    mtgo_id
    name
    oracle_id
    scryfall_id
    set
    set_name
    tcgplayer_id
    type_line
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
      {
        cmc,
        collector_number,
        color_identity,
        image,
        keywords,
        mana_cost,
        mtgo_id,
        name,
        oracle_id,
        tcgplayer_id,
        scryfall_id,
        set,
        set_name,
        type_line
      },
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
                input: {
                  card: {
                    cmc: ${cmc},
                    collector_number: ${collector_number},
                    color_identity: [${color_identity.map(
                      (ci) => '"' + ci + '"'
                    )}],
                    image: "${image}",
                    keywords: [${keywords.map((kw) => '"' + kw + '"')}],
                    mana_cost: "${mana_cost}",
                    ${
                      Number.isInteger(mtgo_id)
                        ? 'mtgo_id: ' + mtgo_id + ',\n'
                        : ''
                    }
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    ${
                      Number.isInteger(tcgplayer_id)
                        ? 'tcgplayer_id: ' + tcgplayer_id + ',\n'
                        : ''
                    } 
                    scryfall_id: "${scryfall_id}",
                    set: "${set}",
                    set_name: "${set_name}",
                    type_line: "${type_line}"
                  },
                  component: ${component},
                  numberOfCopies: ${numberOfCopies}
                }
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
        callback: (data) => setEventState(data),
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
    [eventQuery, eventState._id, sendRequest]
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
                input: {
                  cardIDs: [${cardIDs.map((cardID) => '"' + cardID + '"')}],
                  component: ${component}
                }
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

  return (
    <EventContext.Provider
      value={{
        loading,
        eventQuery,
        eventState,
        myState,
        setEventState,
        setMyState,
        addBasics,
        fetchEventByID,
        removeBasics,
        selectCard,
        toggleMainboardSideboardEvent
      }}
    >
      <Event />
    </EventContext.Provider>
  );
}
