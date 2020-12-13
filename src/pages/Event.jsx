import React from 'react';
import arrayMove from 'array-move';
import io from 'socket.io-client';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUIPaper from '@material-ui/core/Paper';
import MUITab from '@material-ui/core/Tab';
import MUITabs from '@material-ui/core/Tabs';
import MUITooltip from '@material-ui/core/Tooltip';
import MUITypography from '@material-ui/core/Typography';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import PicksDisplay from '../components/Event Page/PicksDisplay';
import SelectConfirmationDialog from '../components/Event Page/SelectConfirmationDialog';
import SmallAvatar from '../components/miscellaneous/SmallAvatar';
import SortableList from '../components/Event Page/SortableList';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_EVENT':
      return {
        ...state,
        ...action.value
      };
    default:
      return state;
  }
};

const useStyles = makeStyles({
  downloadLink: {
    marginLeft: 8
  },
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
  const { sendRequest } = useRequest();
  const classes = useStyles();
  const eventId = useParams().eventId;
  const [dialogDisplayed, setDialogDisplayed] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();
  // this needs to be removed; should not send an http request for this, just send back this info using websockets
  const [playerUsername, setPlayerUsername] = React.useState();
  const [selectedCard, setSelectedCard] = React.useState();
  const [socket, setSocket] = React.useState();
  const [tabNumber, setTabNumber] = React.useState(0);

  const [eventState, dispatch] = React.useReducer(eventReducer, {
    chaff: [],
    finished: false,
    mainboard: [],
    name: '',
    other_players_card_pools: [],
    pack: [],
    players: [],
    sideboard: []
  });

  React.useEffect(function () {
    async function fetchData () {
      try {
        const accountData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/account/${authentication.userId}`,
          'GET',
          null,
          { Authorization: 'Bearer ' + authentication.token }
        );
        setPlayerUsername(accountData.user.name);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setErrorMessage(null);
    setSocket(io(`${process.env.REACT_APP_BACKEND_URL.replace('/api', '')}`,
      { query: { eventId, userId: authentication.userId } }));
  }, [authentication.token, authentication.userId, eventId, sendRequest]);

  React.useEffect(function () {
    if (socket) {

      socket.emit('join');

      socket.on('admittance', function (eventInfo) {
        dispatch({ type: 'UPDATE_EVENT', value: eventInfo });
      });

      socket.on('error', function (error) {
        setErrorMessage(error.message);
      });

      socket.on('updateEventStatus', function (eventInfo) {
        dispatch({ type: 'UPDATE_EVENT', value: eventInfo });
      });

      return function () {
        socket.emit('leave');
        socket.disconnect(true);
      }
    }
  }, [authentication.userId, eventId, socket]);

  function moveCard (cardId, fromCards, toCards) {
    const fromCardsClone = [...eventState[fromCards]];
    const indexOfCard = fromCardsClone.findIndex(function (card) {
      return card._id === cardId;
    });
    const cardToMove = fromCardsClone.splice(indexOfCard, 1);
    const toCardsClone = [...eventState[toCards]].concat(cardToMove);

    dispatch({
      type: 'UPDATE_EVENT',
      value: {
        [fromCards]: fromCardsClone,
        [toCards]: toCardsClone
      }
    });

    socket.emit('moveCard', cardId, fromCards, toCards);
  }

  function onSortEnd ({ collection, newIndex, oldIndex }) {
    dispatch({
      type: 'UPDATE_EVENT',
      value: {
        [collection]: arrayMove(eventState[collection], oldIndex, newIndex)
      }
    });

    if (collection !== 'pack') {
      socket.emit('sortCard', collection, newIndex, oldIndex);
    }
  };

  return (
    <React.Fragment>
      {socket &&
        <React.Fragment>
          <SelectConfirmationDialog
            card={selectedCard}
            open={dialogDisplayed}
            selectCardHandler={(cardId) => socket.emit('selectCard', cardId)}
            toggleOpen={() => setDialogDisplayed(false)}
          />

          <MUICard>
            <MUICardHeader
              disableTypography={true}
              title={<MUITypography variant="h5">{eventState.name}</MUITypography>}
            />
            <MUICardContent>
              <MUIGrid container justify="space-around" spacing={2}>
                {eventState.players.map(function (player) {
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
            !eventState.finished &&
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
                eventState.pack.length > 0 &&
                <MUICard>
                  <MUICardHeader
                    disableTypography={true}
                    title={<MUITypography variant="subtitle1">Select a Card to Draft</MUITypography>}
                  />
                  <SortableList
                    axis="xy"
                    cards={eventState.pack}
                    clickFunction={(cardData) => {
                      setSelectedCard(cardData);
                      setDialogDisplayed(true);
                    }}
                    fromCollection="pack"
                    moveCard={() => null}
                    onSortEnd={onSortEnd}
                    toCollection1={null}
                    toCollection2={null}
                  />
                </MUICard>
              }

              {tabNumber === 0 &&
                eventState.pack.length === 0 &&
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
                  eventState={eventState}
                  moveCard={moveCard}
                  onSortEnd={onSortEnd}
                />
              }
            </React.Fragment>
          }

          {// displays once the event is finished
            eventState.finished &&
            <React.Fragment>
              <MUITypography variant="body1">
                <CSVLink
                  className={classes.downloadLink}
                  data={eventState.chaff.concat(eventState.mainboard).concat(eventState.sideboard).reduce(function (a, c) {
                    return c && c.mtgo_id ? a + " ,1," + c.mtgo_id + ", , , , \n" : a;
                  }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                  filename={`${eventState.name} - ${playerUsername}.csv`}
                  target="_blank"
                >
                  Download your card pool in CSV format for MTGO play!
                </CSVLink>
              </MUITypography>
              {eventState.other_players_card_pools.map(function (plr) {
                return (
                  <MUITypography variant="body1">
                    <CSVLink
                      className={classes.downloadLink}
                      data={plr.card_pool.reduce(function (a, c) {
                        return a + " ,1," + c + ", , , , \n";
                      }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                      filename={`${eventState.name} - ${plr.account.name}.csv`}
                      key={plr.account._id}
                      target="_blank"
                    >
                      Download {plr.account.name}'s card pool in CSV format for MTGO play!
                    </CSVLink>
                  </MUITypography>
                );
              })}

              <PicksDisplay
                eventState={eventState}
                moveCard={moveCard}
                onSortEnd={onSortEnd}
              />
            </React.Fragment>
          }

          {errorMessage &&
            <MUITypography variant="body1">{errorMessage}</MUITypography>
          }
        </React.Fragment>
      }
    </React.Fragment>
  );
};

export default Event;