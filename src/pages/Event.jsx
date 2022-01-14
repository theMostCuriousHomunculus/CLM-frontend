import React, { useContext, useState } from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import EventInfo from '../components/Event Page/EventInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { AuthenticationContext } from '../contexts/Authentication';
import { EventContext } from '../contexts/event-context';

const useStyles = makeStyles({
  selectableCard: {
    borderRadius: 16,
    cursor: 'pointer'
  },
  selectedCard: {
    borderRadius: 16
  }
});

export default function Event() {
  const { userID } = useContext(AuthenticationContext);
  const {
    loading,
    eventState,
    myState,
    addBasics,
    removeBasics,
    selectCard,
    toggleMainboardSideboardEvent
  } = useContext(EventContext);
  const [selectedCard, setSelectedCard] = useState({
    _id: null,
    image: null,
    back_image: null,
    name: null
  });
  const [tabNumber, setTabNumber] = useState(0);
  const classes = useStyles();
  const others = eventState.players.filter((plr) => plr.account._id !== userID);

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
            className={classes.selectedCard}
            src={selectedCard.image}
            width={300}
          />
          {selectedCard.back_image && (
            <img
              alt={selectedCard.name}
              className={classes.selectedCard}
              src={selectedCard.back_image}
              width={300}
            />
          )}
        </div>
      </ConfirmationDialog>

      <EventInfo />

      {!eventState.finished && (
        <MUICard>
          <MUICardHeader
            title={
              <MUITabs
                aria-label="ongoing-event-tabs"
                onChange={(event, newTabNumber) => setTabNumber(newTabNumber)}
                style={{ margin: 4 }}
                value={tabNumber}
                variant="fullWidth"
              >
                <MUITab label="Current Pack" />
                <MUITab label="My Picks" />
              </MUITabs>
            }
          />

          <MUICardContent>
            {tabNumber === 0 && myState.current_pack && (
              <MUIGrid container justifyContent="center" spacing={1}>
                {myState.current_pack.map((card) => (
                  <MUIGrid
                    container
                    justifyContent="center"
                    item
                    key={card._id}
                    xs={12}
                    md={6}
                    lg={4}
                  >
                    <img
                      alt={card.name}
                      className={classes.selectableCard}
                      onClick={() =>
                        setSelectedCard({
                          _id: card._id,
                          back_image: card.back_image,
                          image: card.image,
                          name: card.name
                        })
                      }
                      src={card.image}
                      width={300}
                    />
                  </MUIGrid>
                ))}
              </MUIGrid>
            )}

            {tabNumber === 0 && !myState.current_pack && (
              <React.Fragment>
                <MUITypography variant="h3">
                  Other drafters are still making their picks...
                </MUITypography>
                <MUITypography variant="body1">
                  Yell at them to hurry up! Also tell them to turn notifications
                  on so they will be alerted when they have a selection to make.
                </MUITypography>
              </React.Fragment>
            )}

            {tabNumber === 1 && (
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
            )}
          </MUICardContent>
        </MUICard>
      )}

      {eventState.finished && (
        <React.Fragment>
          <CardPoolDownloadLinks me={myState} others={others} />
          <BasicLandAdder
            labelText="Add basic lands to your deck"
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
