import React, { useContext, useState } from 'react';
import MUIGrid from '@mui/material/Grid';
import MUITab from '@mui/material/Tab';
import MUITabs from '@mui/material/Tabs';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import { useParams } from 'react-router-dom';

import AutoScrollMessages from '../components/miscellaneous/AutoScrollMessages';
import BasicLandAdder from '../components/miscellaneous/BasicLandAdder';
import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import EventInfo from '../components/Event Page/EventInfo';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { EventContext } from '../contexts/event-context';
import { addBasics } from '../graphql/mutations/add-basics';
import { createChatMessageEvent } from '../graphql/mutations/create-chat-message-event';
import { selectCard } from '../graphql/mutations/select-card';

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
  const { eventID } = useParams();
  const { eventState, loading, me } = useContext(EventContext);
  const [selectedCard, setSelectedCard] = useState({
    _id: null,
    image: null,
    back_image: null,
    name: null
  });
  const [finishedTabNumber, setFinishedTabNumber] = useState(0);
  const [ongoingTabNumber, setOngoingTabNumber] = useState(0);
  const classes = useStyles();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (me) {
    return (
      <React.Fragment>
        <ConfirmationDialog
          confirmHandler={() => {
            selectCard({
              headers: { EventID: eventID },
              cardID: selectedCard._id
            });
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
          <React.Fragment>
            <MUITabs
              aria-label="ongoing-event-tabs"
              onChange={(event, newTabNumber) =>
                setOngoingTabNumber(newTabNumber)
              }
              style={{ margin: 4 }}
              value={ongoingTabNumber}
              variant="fullWidth"
            >
              <MUITab label="Current Pack" />
              <MUITab label="My Picks" />
              <MUITab label="Chat" />
            </MUITabs>

            {ongoingTabNumber === 0 && me.current_pack && (
              <MUIGrid container justifyContent="center" spacing={1}>
                {me.current_pack.map((card) => (
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

            {ongoingTabNumber === 0 && !me.current_pack && (
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

            {ongoingTabNumber === 1 && (
              <DeckDisplay
                authorizedID={me.account._id}
                deck={{
                  mainboard: me.mainboard,
                  sideboard: me.sideboard
                }}
              />
            )}

            {ongoingTabNumber === 2 && (
              <AutoScrollMessages
                messages={eventState.chat_log}
                submitFunction={(value) =>
                  createChatMessageEvent({
                    headers: { EventID: eventID },
                    variables: { body: value }
                  })
                }
                title="Group Chat"
              />
            )}
          </React.Fragment>
        )}

        {eventState.finished && (
          <React.Fragment>
            <MUITabs
              aria-label="finished-event-tabs"
              onChange={(event, newTabNumber) =>
                setFinishedTabNumber(newTabNumber)
              }
              style={{ margin: 4 }}
              value={finishedTabNumber}
              variant="fullWidth"
            >
              <MUITab label="My Picks" />
              <MUITab label="Chat" />
            </MUITabs>

            {finishedTabNumber === 0 && (
              <React.Fragment>
                <CardPoolDownloadLinks />
                <BasicLandAdder
                  labelText="Add basic lands to your deck"
                  submitFunction={(cardData) => {
                    addBasics({
                      component: 'mainboard',
                      headers: { EventID: eventID },
                      name: cardData.name,
                      numberOfCopies: 1,
                      scryfall_id: cardData.scryfall_id
                    });
                  }}
                />
                <DeckDisplay
                  authorizedID={me.account._id}
                  deck={{
                    mainboard: me.mainboard,
                    sideboard: me.sideboard
                  }}
                />
              </React.Fragment>
            )}

            {finishedTabNumber === 1 && (
              <AutoScrollMessages
                messages={eventState.chat_log}
                submitFunction={(value) =>
                  createChatMessageEvent({
                    headers: { EventID: eventID },
                    variables: { body: value }
                  })
                }
                title="Group Chat"
              />
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }

  return null;
}
