import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUIPaper from '@material-ui/core/Paper';
import MUITab from '@material-ui/core/Tab';
import MUITabs from '@material-ui/core/Tabs';
import MUITooltip from '@material-ui/core/Tooltip';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import CardPoolDownloadLinks from '../components/Event Page/CardPoolDownloadLinks';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import PicksDisplay from '../components/Event Page/PicksDisplay';
import SelectConfirmationDialog from '../components/Event Page/SelectConfirmationDialog';
import SmallAvatar from '../components/miscellaneous/SmallAvatar';
import SortableList from '../components/Event Page/SortableList';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { fetchEventByID, moveCard, selectCard, sortCard } from '../requests/GraphQL/event-requests.js';

const useStyles = makeStyles({
  paper: {
    marginLeft: 8,
    marginRight: 8
  },
  tabs: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: 4
  }
});

const Event = () => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const eventID = useParams().eventId;
  const [dialogDisplayed, setDialogDisplayed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();
  const [event, setEvent] = React.useState({
    finished: false,
    host: {},
    name: '',
    players: [{
      account: {
        _id: authentication.userId
      },
      chaff: [],
      current_pack: null,
      mainboard: [],
      sideboard: []
    }]
  });
  const [loading, setLoading] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState();
  const [tabNumber, setTabNumber] = React.useState(0);

  React.useEffect(function () {

    async function initialize () {
      try {
        setLoading(true);
        const eventData = await fetchEventByID(eventID, authentication.token);
  
        setEvent(eventData);
        console.log(eventData);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();

    const client = createClient({
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setEvent(update.data.joinEvent);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            joinEvent(_id: "${eventID}") {
              finished
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
  }, [authentication.token, eventID]);

  async function onMoveCard (cardID, destination, origin) {
    try {
      const eventData = await moveCard(cardID, destination, eventID, origin, authentication.token);
      
      setEvent(eventData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function onSelectCard (cardID) {
    try {
      const eventData = await selectCard(cardID, eventID, authentication.token);

      setEvent(eventData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function onSortEnd ({ collection, newIndex, oldIndex }) {
    try {
      const eventData = await sortCard(collection, eventID, newIndex, oldIndex, authentication.token);
      
      setEvent(eventData);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <SelectConfirmationDialog
        card={selectedCard}
        open={dialogDisplayed}
        selectCardHandler={(cardID) => onSelectCard(cardID)}
        toggleOpen={() => setDialogDisplayed(false)}
      />

      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">{event.name}</MUITypography>}
        />
        <MUICardContent>
          <MUIGrid container justify="space-around" spacing={2}>
            {event.players.map(function (player) {
              return (
                <MUIGrid
                  container
                  item
                  justify="center"
                  key={player.account._id}
                  xs={6}
                  sm={4}
                  md={3}
                  lg={2}
                  xl={1}
                >
                  <MUITooltip title={player.account.name}>
                    <Link to={`/account/${player.account._id}`}>
                      <SmallAvatar
                        alt={player.account.name}
                        src={player.account.avatar}
                      />
                    </Link>
                  </MUITooltip>
                </MUIGrid>
              );
            })}
          </MUIGrid>
        </MUICardContent>
      </MUICard>

      {// displays if the event is a draft and is not yet finished
        !event.finished &&
        <React.Fragment>
          <MUIPaper className={classes.paper}>
            <MUITabs
              className={classes.tabs}
              indicatorColor="primary"
              onChange={(event, newTabNumber) => setTabNumber(newTabNumber)}
              textColor="primary"
              value={tabNumber}
              variant="fullWidth"
            >
              <MUITab label="Current Pack" />
              <MUITab label="My Picks" />
            </MUITabs>
          </MUIPaper>

          {tabNumber === 0 &&
            event.players.some(plr => plr.current_pack) &&
            <MUICard>
              <MUICardHeader
                disableTypography={true}
                title={<MUITypography variant="subtitle1">Select a Card to Draft</MUITypography>}
              />
              <SortableList
                axis="xy"
                cards={event.players.find(plr => plr.account._id === authentication.userId).current_pack}
                clickFunction={(cardData) => {
                  setSelectedCard(cardData);
                  setDialogDisplayed(true);
                }}
                fromCollection="current_pack"
                moveCard={() => null}
                onSortEnd={onSortEnd}
                toCollection1={null}
                toCollection2={null}
              />
            </MUICard>
          }

          {tabNumber === 0 &&
            !event.players.some(plr => plr.current_pack) &&
            <MUICard>
            <MUICardHeader
              disableTypography={true}
              title={<MUITypography variant="h5">Other drafters are still making their picks...</MUITypography>}
            />
              <MUICardContent>
                <MUITypography variant="body1">
                  Yell at them to hurry up!
                </MUITypography>
                <MUITypography variant="body1">
                  While you're waiting, review the picks you've already made.
                </MUITypography>
              </MUICardContent>
            </MUICard>
          }

          {tabNumber === 1 &&
            <PicksDisplay
              eventState={event}
              moveCard={onMoveCard}
              onSortEnd={onSortEnd}
            />
          }
        </React.Fragment>
      }

      {// displays once the event is finished
        event.finished &&
        <React.Fragment>
          <CardPoolDownloadLinks players={event.players} />

          <PicksDisplay
            eventState={event}
            moveCard={onMoveCard}
            onSortEnd={onSortEnd}
          />
        </React.Fragment>
      }

      {errorMessage &&
        <MUITypography variant="body1">{errorMessage}</MUITypography>
      }
    </React.Fragment>
  );
};

export default Event;