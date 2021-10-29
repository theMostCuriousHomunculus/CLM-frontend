import React from 'react';
import MUIPaper from '@mui/material/Paper';
import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import MUITypography from '@mui/material/Typography';
import arrayMove from 'array-move';
import { createClient } from 'graphql-ws';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import EventInfo from '../components/Event Page/EventInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import SortableList from '../components/Event Page/SortableList';
import { AuthenticationContext } from '../contexts/authentication-context';
import { EventContext } from '../contexts/event-context';

export default function Event() {
  const { token, userId } = React.useContext(AuthenticationContext);
  const {
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
  } = React.useContext(EventContext);

  const [selectedCard, setSelectedCard] = React.useState({
    _id: null,
    image: null,
    back_image: null,
    name: null
  });
  const [tabNumber, setTabNumber] = React.useState(0);
  const others = eventState.players.filter((plr) => plr.account._id !== userId);

  React.useEffect(
    function () {
      async function initialize() {
        await fetchEventByID();
      }

      initialize();

      const client = createClient({
        connectionParams: {
          authToken: token,
          eventID: eventState._id
        },
        url: process.env.REACT_APP_WS_URL
      });

      async function subscribe() {
        function onNext(update) {
          setEventState(update.data.subscribeEvent);
        }

        await new Promise((resolve, reject) => {
          client.subscribe(
            {
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
            }
          );
        });
      }

      subscribe(
        (result) => console.log(result),
        (error) => console.log(error)
      );

      return client.dispose;
    },
    [token, eventState._id, eventQuery, fetchEventByID, setEventState]
  );

  function onSortEnd({ collection, newIndex, oldIndex }) {
    if (newIndex !== oldIndex) {
      setMyState((prevState) => ({
        ...prevState,
        [collection]: arrayMove(prevState[collection], oldIndex, newIndex)
      }));
    }
  }

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          selectCard(selectedCard._id);
          setSelectedCard({
            _id: null,
            image: null,
            back_image: null,
            name: null
          });
        }}
        open={!!selectedCard._id}
        title={`Are you sure you want to draft ${selectedCard.name}?`}
        toggleOpen={() =>
          setSelectedCard({
            _id: null,
            image: null,
            back_image: null,
            name: null
          })
        }
      >
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            alt={selectedCard.name}
            src={selectedCard.image}
            style={{ height: 264 }}
          />
          {selectedCard.back_image && (
            <img
              alt={selectedCard.name}
              src={selectedCard.back_image}
              style={{ height: 264 }}
            />
          )}
        </div>
      </ConfirmationDialog>

      <EventInfo />

      {!eventState.finished && (
        <React.Fragment>
          <MUITabs
            indicatorColor="primary"
            onChange={(event, newTabNumber) => setTabNumber(newTabNumber)}
            style={{ margin: 4 }}
            textColor="primary"
            value={tabNumber}
            variant="fullWidth"
          >
            <MUITab label="Current Pack" />
            <MUITab label="My Picks" />
          </MUITabs>

          {tabNumber === 0 && myState.current_pack && (
            <MUIPaper>
              <MUITypography variant="h3">Select a Card to Draft</MUITypography>
              <SortableList
                axis="xy"
                cards={myState.current_pack}
                clickFunction={(cardData) =>
                  setSelectedCard({
                    _id: cardData._id,
                    back_image: cardData.back_image,
                    image: cardData.image,
                    name: cardData.name
                  })
                }
                collection="current_pack"
                distance={2}
                onSortEnd={onSortEnd}
              />
            </MUIPaper>
          )}

          {tabNumber === 0 && !myState.current_pack && (
            <MUIPaper>
              <MUITypography variant="h3">
                Other drafters are still making their picks...
              </MUITypography>
              <MUITypography variant="body1">
                Yell at them to hurry up!
              </MUITypography>
              <MUITypography variant="body1">
                While you're waiting, review the picks you've already made.
              </MUITypography>
            </MUIPaper>
          )}

          {tabNumber === 1 && (
            <React.Fragment>
              <BasicLandAdder
                submitFunction={(cardData) =>
                  addBasics(cardData, 'mainboard', 1)
                }
              />
              <DeckDisplay
                add={addBasics}
                authorizedID={myState.account._id}
                deck={{
                  mainboard: myState.mainboard,
                  sideboard: myState.sideboard
                }}
                remove={removeBasics}
                toggle={toggleMainboardSideboardEvent}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      )}

      {eventState.finished && (
        <React.Fragment>
          <CardPoolDownloadLinks me={myState} others={others} />
          <BasicLandAdder
            submitFunction={(cardData) => addBasics(cardData, 'mainboard', 1)}
          />
          <DeckDisplay
            add={addBasics}
            authorizedID={myState.account._id}
            deck={{
              mainboard: myState.mainboard,
              sideboard: myState.sideboard
            }}
            remove={removeBasics}
            toggle={toggleMainboardSideboardEvent}
          />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}
