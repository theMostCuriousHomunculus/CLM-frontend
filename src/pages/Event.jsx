import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { CSVLink } from "react-csv";
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

import io from "socket.io-client";
import SelectConfirmationDialogue from '../components/Event Page/SelectConfirmationDialog';

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
}

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  cardImage: {
    height: 300
  },
  cardImageContainer: {
    margin: '0 auto',
    padding: 0,
    width: 'fit-content'
  },
  downloadLink: {
    fontSize: '1.6rem'
  },
  flexGrow: {
    flexGrow: 1
  },
  gridContainer: {
    margin: 0,
    width: '100%'
  }
});

const Event = () => {

  const authentication = React.useContext(AuthenticationContext);
  const { sendRequest } = useRequest();
  const classes = useStyles();
  const eventId = useParams().eventId;
  const [dialogueDisplayed, setDialogueDisplayed] = React.useState(false);
  const [playerUsername, setPlayerUsername] = React.useState(undefined);
  const [errorMessage, setErrorMessage] = React.useState(undefined);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [socket, setSocket] = React.useState(undefined);

  const [eventState, dispatch] = React.useReducer(eventReducer, {
    players: [],
    name: '',
    other_players_card_pools: [],
    pack: [],
    card_pool: []
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
        setPlayerUsername(accountData.name);
      } catch (error) {
        console.log(error);
      }
    }
    fetchData();
    setErrorMessage(undefined);
    setSocket(io(`${process.env.REACT_APP_BACKEND_URL.replace('/api', '')}`));
  }, [authentication.token, authentication.userId, sendRequest]);

  React.useEffect(function () {
    if (socket) {

      socket.emit('join', eventId, authentication.userId);

      socket.on('admittance', function (eventInfo) {
        updateEventHandler(eventInfo);
      });

      socket.on('bounce', function (error) {
        setErrorMessage(error);
      });

      socket.on('updateEventStatus', function (eventInfo) {
        updateEventHandler(eventInfo);
      });

      return function () {
        socket.emit('leave', eventId, authentication.userId);
        socket.disconnect();
      }
    }
  }, [authentication.userId, eventId, socket]);

  function updateEventHandler (data) {
    dispatch({ type: 'UPDATE_EVENT', value: data });
  }

  function selectCardHandler (cardId) {
    socket.emit('selectCard', cardId, eventId, authentication.userId);
  }

  return (
    <React.Fragment>
      {socket &&
        <div>
          <SelectConfirmationDialogue
            card={selectedCard}
            open={dialogueDisplayed}
            selectCardHandler={selectCardHandler}
            toggleOpen={() => setDialogueDisplayed(false)}
          />
          <React.Fragment>
            {eventState.name &&
              <React.Fragment>
                <MUICard>
                  <MUICardHeader title={<MUITypography variant="h2">{eventState.name}</MUITypography>} />
                  <MUICardContent>
                    <MUIGrid container justify="space-around" spacing={2}>
                      {eventState.players.map(function (player) {
                        return (
                          <MUIGrid
                            item
                            key={player.playerId}
                            xs={6}
                            sm={4}
                            md={3}
                            lg={2}
                            xl={1}
                          >
                            <Link to={`/account/${player.playerId}`}>
                              <MUIAvatar
                                alt={player.name}
                                className={classes.avatarSmall}
                                src={player.avatar}
                              />
                            </Link>
                          </MUIGrid>
                        );
                      })}
                    </MUIGrid>
                  </MUICardContent>
                </MUICard>
                <MUIGrid className={classes.gridContainer} container justify="space-between" spacing={2}>
                  {eventState.pack.map(function (card) {
                    return (
                      <MUIGrid
                        item
                        key={card._id}
                        xs={12}
                        sm={card.back_image ? 12 : 6}
                        md={card.back_image ? 8 : 4}
                        lg={card.back_image ? 6 : 3}
                        xl={card.back_image ? 4 : 2}
                      >
                        <MUIButton
                          className={classes.cardImageContainer}
                          onClick={() => {
                            setSelectedCard(card);
                            setDialogueDisplayed(true)
                          }}>
                          <img alt={card.name} className={classes.cardImage} src={card.image} />
                          {card.back_image &&
                            <img alt={card.name} className={classes.cardImage} src={card.back_image} />
                          }
                        </MUIButton>
                      </MUIGrid>
                    );
                  })}
                  {// displays if the drafter who passes to this drafter has not yet made his pick
                    eventState.pack.length === 0 &&
                    eventState.card_pool.length === 0 &&
                    <MUIGrid item xs={12}>
                      <MUITypography variant="body1">
                        Other drafters are still making their picks; yell at them to hurry up!
                      </MUITypography>
                    </MUIGrid>
                  }
                  {// displays once the drafter has made all their picks (or immediately if it is a sealed event)
                    eventState.card_pool.length > 0 &&
                    <React.Fragment>
                      <MUIGrid item xs={12}>
                        <CSVLink
                          className={classes.downloadLink}
                          data={eventState.card_pool.reduce(function (a, c) {
                            return c && c.mtgo_id ? a + " ,1," + c.mtgo_id + ", , , , \n" : a;
                          }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                          filename={`${eventState.name + " - " + playerUsername}.csv`}
                          target="_blank"
                        >
                          Download your card pool in CSV format for MTGO play!
                        </CSVLink>
                        {eventState.other_players_card_pools.map(function (plr) {
                          return (
                            <React.Fragment key={plr.playerId}>
                              <br />
                              <CSVLink
                                className={classes.downloadLink}
                                data={plr.card_pool.reduce(function (a, c) {
                                  return c && c.mtgo_id ? a + " ,1," + c + ", , , , \n" : a;
                                }, "Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium\n")}
                                filename={`${eventState.name + " - " + plr.name}.csv`}
                                target="_blank"
                              >
                                Download {plr.name}'s card pool in CSV format for MTGO play!
                              </CSVLink>
                            </React.Fragment>
                          );
                        })}
                      </MUIGrid>
                      <React.Fragment>
                        {eventState.card_pool.map(function (card, index) {
                          return (
                            <MUIGrid
                              item
                              key={`cardpool-${index}`}
                              xs={12}
                              sm={card && card.back_image ? 12 : 6}
                              md={card && card.back_image ? 8 : 4}
                              lg={card && card.back_image ? 6 : 3}
                              xl={card && card.back_image ? 4 : 2}
                            >
                              {card &&
                                <MUICard className={classes.cardImageContainer}>
                                  <img alt={card.name} className={classes.cardImage} src={card.image} />
                                  {card.back_image &&
                                    <img alt={card.name} className={classes.cardImage} src={card.back_image} />
                                  }
                                </MUICard>
                              }
                            </MUIGrid>
                          );
                        })}
                      </React.Fragment>
                    </React.Fragment>
                  }
                </MUIGrid>
              </React.Fragment>
            }
          </React.Fragment>
          {errorMessage &&
            <MUITypography variant="body1">{errorMessage}</MUITypography>
          }
        </div>
      }
    </React.Fragment>
  );
};

export default Event;