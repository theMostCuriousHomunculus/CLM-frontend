import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import MUITab from '@material-ui/core/Tab';
import MUITabs from '@material-ui/core/Tabs';
import MUITypography from '@material-ui/core/Typography';
import arrayMove from 'array-move';
import { createClient } from 'graphql-ws';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import InfoSection from '../components/Event Page/InfoSection';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import PicksDisplay from '../components/Event Page/PicksDisplay';
import SelectConfirmationDialog from '../components/Event Page/SelectConfirmationDialog';
import SortableList from '../components/Event Page/SortableList';
import { AuthenticationContext } from '../contexts/authentication-context';

export default function Event () {

  const authentication = React.useContext(AuthenticationContext);
  const eventID = useParams().eventId;
  const { loading, sendRequest } = useRequest();
  const [dialogDisplayed, setDialogDisplayed] = React.useState(false);
  const [event, setEvent] = React.useState({
    finished: false,
    host: {},
    name: '',
    players: [{
      account: {
        _id: authentication.userId,
        avatar: '',
        name: ''
      },
      chaff: [],
      current_pack: null,
      mainboard: [],
      sideboard: []
    }]
  });
  const [selectedCard, setSelectedCard] = React.useState();
  const [tabNumber, setTabNumber] = React.useState(0);
  const me = event.players.find(plr => plr.account._id === authentication.userId);
  const others = event.players.filter(plr => plr.account._id !== authentication.userId);

  React.useEffect(function () {

    const desiredEventInfo = `
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
        chaff {
          _id
          back_image
          image
          mtgo_id
          name
        }
        current_pack {
          _id
          back_image
          image
          name
        }
        mainboard {
          _id
          back_image
          image
          mtgo_id
          name
        }
        sideboard {
          _id
          back_image
          image
          mtgo_id
          name
        }
      }
    `;

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
                  ${desiredEventInfo}
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
        authToken: authentication.token,
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
              ${desiredEventInfo}
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
  }, [authentication.token, eventID, sendRequest]);

  async function onMoveCard (cardID, destination, origin) {
    await sendRequest({
      headers: { EventID: eventID },
      operation: 'moveCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}"
                  destination: ${destination}
                  origin: ${origin}
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
      <SelectConfirmationDialog
        card={selectedCard}
        open={dialogDisplayed}
        selectCardHandler={cardID => onSelectCard(cardID)}
        toggleOpen={() => setDialogDisplayed(false)}
      />

      <InfoSection event={event} />

      {// displays if the event is a draft and is not yet finished
        !event.finished &&
        <MUIPaper style={{ overflow: 'hidden' }}>
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
            <React.Fragment>
              <MUITypography variant="h3">Select a Card to Draft</MUITypography>
              <SortableList
                axis="xy"
                cards={me.current_pack}
                clickFunction={cardData => {
                  setSelectedCard(cardData);
                  setDialogDisplayed(true);
                }}
                distance={2}
                fromCollection="current_pack"
                onSortEnd={onSortEnd}
                otherCollections={[]}
              />
            </React.Fragment>
          }

          {tabNumber === 0 &&
            !me.current_pack &&
            <React.Fragment>
              <MUITypography variant="h3">Other drafters are still making their picks...</MUITypography>
              <MUITypography variant="body1">
                Yell at them to hurry up!
              </MUITypography>
              <MUITypography variant="body1">
                While you're waiting, review the picks you've already made.
              </MUITypography>
            </React.Fragment>
          }

          {tabNumber === 1 &&
            <PicksDisplay
              moveCard={onMoveCard}
              onSortEnd={onSortEnd}
              player={me}
            />
          }
        </MUIPaper>
      }

      {// displays once the event is finished
        event.finished &&
        <React.Fragment>
          <CardPoolDownloadLinks me={me} others={others} />

          <MUIPaper style={{ overflow: 'hidden' }}>
            <PicksDisplay
              moveCard={onMoveCard}
              onSortEnd={onSortEnd}
              player={me}
            />
          </MUIPaper>
        </React.Fragment>
      }
    </React.Fragment>
  );
};