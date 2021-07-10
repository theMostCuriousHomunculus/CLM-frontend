import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import MUITab from '@material-ui/core/Tab';
import MUITabs from '@material-ui/core/Tabs';
import MUITypography from '@material-ui/core/Typography';
import arrayMove from 'array-move';
import { createClient } from 'graphql-ws';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import InfoSection from '../components/Event Page/InfoSection';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
// import PicksDisplay from '../components/Event Page/PicksDisplay';
import SortableList from '../components/Event Page/SortableList';
import { AuthenticationContext } from '../contexts/authentication-context';

export default function Event () {

  const { token, userId } = React.useContext(AuthenticationContext);
  const eventID = useParams().eventId;
  const { loading, sendRequest } = useRequest();
  const [event, setEvent] = React.useState({
    finished: false,
    host: {},
    name: null,
    players: [{
      account: {
        _id: userId,
        avatar: null,
        name: '...'
      },
      current_pack: [],
      mainboard: [],
      sideboard: []
    }]
  });
  const [selectedCard, setSelectedCard] = React.useState({
    _id: null,
    image: null,
    back_image: null,
    name: null
  });
  const [tabNumber, setTabNumber] = React.useState(0);
  const me = event.players.find(plr => plr.account._id === userId);
  const others = event.players.filter(plr => plr.account._id !== userId);

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

  React.useEffect(function () {

    async function initialize () {
      await sendRequest({
        callback: (data) => {
          setEvent(data);
        },
        headers: { EventID: eventID },
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
          }
        }
      });
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: token,
        eventID
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setEvent(update.data.subscribeEvent);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            subscribeEvent {
              ${eventQuery}
            }
          }`
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      })
    }

    subscribe(result => console.log(result), error => console.log(error));

    return client.dispose;
  }, [token, eventID, eventQuery, sendRequest]);

  const addBasics = React.useCallback(async function ({
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
  }, component, numberOfCopies) {
    await sendRequest({
      headers: { EventID: eventID },
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
                    color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                    image: "${image}",
                    keywords: [${keywords.map(kw => '"' + kw + '"')}],
                    mana_cost: "${mana_cost}",
                    ${Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',\n' : ''}
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    ${Number.isInteger(tcgplayer_id) ? 'tcgplayer_id: ' + tcgplayer_id + ',\n' : ''} 
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
        }
      }
    });
  }, [sendRequest, eventID]);

  const removeBasics = React.useCallback(async function (cardIDs, component) {
    await sendRequest({
      headers: { EventID: eventID },
      operation: 'removeBasics',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardIDs: [${cardIDs.map(cardID => '"' + cardID + '"')}],
                  component: ${component}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    })
  }, [eventID, sendRequest]);

  const toggleMainboardSideboardEvent = React.useCallback(async function (cardID) {
    await sendRequest({
      headers: { EventID: eventID },
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
        }
      }
    });
  }, [eventID, sendRequest]);

  async function onSelectCard (cardID) {
    await sendRequest({
      headers: { EventID: eventID },
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
        }
      }
    });
  }

  async function onSortEnd ({ collection, newIndex, oldIndex }) {
    if (newIndex !== oldIndex) {
      const meIndex = event.players.indexOf(me);
      setEvent(prevState => ({
        ...prevState,
        players: prevState.players.slice(0, meIndex).concat([{
          ...me,
          [collection]: arrayMove(me[collection], oldIndex, newIndex)
        }]).concat(prevState.players.slice(meIndex + 1))
      }));
      await sendRequest({
        headers: { EventID: eventID },
        operation: 'sortCard',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  input: {
                    collection: ${collection}
                    newIndex: ${newIndex}
                    oldIndex: ${oldIndex}
                  }
                ) {
                  _id
                }
              }
            `
          }
        }
      });
    }
  }

  return (loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          onSelectCard(selectedCard._id);
          setSelectedCard({
            _id: null,
            image: null,
            back_image: null,
            name: null
          });
        }}
        open={!!selectedCard._id}
        title={`Are you sure you want to draft ${selectedCard.name}?`}
        toggleOpen={() => setSelectedCard({
          _id: null,
          image: null,
          back_image: null,
          name: null
        })}
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img alt={selectedCard.name} src={selectedCard.image} style={{ height: 264 }} />
          {selectedCard.back_image &&
            <img alt={selectedCard.name} src={selectedCard.back_image} style={{ height: 264 }} />
          }
        </div>
      </ConfirmationDialog>

      <InfoSection
        name={event.name}
        players={event.players.map(plr => plr.account)}
      />

      {!event.finished &&
        <React.Fragment>
          <MUITabs
            indicatorColor="primary"
            onChange={(event, newTabNumber) => setTabNumber(newTabNumber)}
            textColor="primary"
            value={tabNumber}
            variant="fullWidth"
          >
            <MUITab label="Current Pack" />
            <MUITab label="My Picks" />
          </MUITabs>

          {tabNumber === 0 &&
            me.current_pack &&
            <MUIPaper>
              <MUITypography variant="h3">Select a Card to Draft</MUITypography>
              <SortableList
                axis="xy"
                cards={me.current_pack}
                clickFunction={cardData => setSelectedCard({
                  _id: cardData._id,
                  back_image: cardData.back_image,
                  image: cardData.image,
                  name: cardData.name
                })}
                distance={2}
                fromCollection="current_pack"
                onSortEnd={onSortEnd}
                otherCollections={[]}
              />
            </MUIPaper>
          }

          {tabNumber === 0 &&
            !me.current_pack &&
            <MUIPaper>
              <MUITypography variant="h3">Other drafters are still making their picks...</MUITypography>
              <MUITypography variant="body1">
                Yell at them to hurry up!
              </MUITypography>
              <MUITypography variant="body1">
                While you're waiting, review the picks you've already made.
              </MUITypography>
            </MUIPaper>
          }

          {tabNumber === 1 &&
            <React.Fragment>
              <BasicLandAdder submitFunction={cardData => addBasics(cardData, 'mainboard', 1)} />
              <DeckDisplay
                add={addBasics}
                authorizedID={me.account._id}
                deck={{ mainboard: me.mainboard, sideboard: me.sideboard }}
                remove={removeBasics}
                toggle={toggleMainboardSideboardEvent}
              />
            </React.Fragment>
          }
        </React.Fragment>
      }

      {event.finished &&
        <React.Fragment>
          <CardPoolDownloadLinks me={me} others={others} />
          <BasicLandAdder submitFunction={cardData => addBasics(cardData, 'mainboard', 1)} />
          <DeckDisplay
            add={addBasics}
            authorizedID={me.account._id}
            deck={{ mainboard: me.mainboard, sideboard: me.sideboard }}
            remove={removeBasics}
            toggle={toggleMainboardSideboardEvent}
          />
        </React.Fragment>
      }
    </React.Fragment>
  );
};