import React from 'react';
import { createClient } from 'graphql-ws';
// import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MagicCard from '../components/Event Page/MagicCard';
import MatchLog from '../components/Match Page/MatchLog';
import PlayerInfo from '../components/Match Page/PlayerInfo';
import { AuthenticationContext } from '../contexts/authentication-context';
import {
  adjustEnergyCounters,
  adjustLifeTotal,
  adjustPoisonCounters,
  desiredMatchInfo,
  dragCard,
  fetchMatchByID,
  tapUntapCard
} from '../requests/GraphQL/match-requests.js';

// const useStyles = makeStyles({

// });

const Match = () => {

  const authentication = React.useContext(AuthenticationContext);
  // const classes = useStyles();
  const matchID = useParams().matchId;
  const [errorMessage, setErrorMessage] = React.useState();
  const [draggingCardID, setDraggingCardID] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [match, setMatch] = React.useState({
    game_winners: [],
    log: [],
    players: [
      {
        account: {
          _id: "A",
          avatar: "",
          name: ""
        },
        battlefield: [],
        energy: 0,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: 20,
        mainboard: [],
        poison: 0,
        sideboard: [],
        temporary: []
      },
      {
        account: {
          _id: "B",
          avatar: "",
          name: ""
        },
        battlefield: [],
        energy: 0,
        exile: [],
        graveyard: [],
        hand: [],
        library: [],
        life: 20,
        mainboard: [],
        poison: 0,
        sideboard: [],
        temporary: []
      }
    ],
    stack: []
  });
  const participant = match.players.some(plr => plr.account._id === authentication.userId);
  const me = participant ?
    match.players.find(plr => plr.account._id === authentication.userId) :
    match.players[0];
  const opponent = participant ?
    match.players.find(plr => plr.account._id !== authentication.userId) :
    match.players[1];

  React.useEffect(function () {

    async function initialize () {
      try {
        setLoading(true);
        const matchData = await fetchMatchByID(matchID, authentication.token);
        setMatch(matchData);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setLoading(false);
      }
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: authentication.token,
        matchID
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setMatch(update.data.joinMatch);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            joinMatch {
              ${desiredMatchInfo}
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
  }, [authentication.token, matchID]);

  async function handleAdjustEnergyCounters (energy) {
    try {
      await adjustEnergyCounters(energy, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleAdjustLifeTotal (life) {
    try {
      await adjustLifeTotal(life, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleAdjustPoisonCounters (poison) {
    try {
      await adjustPoisonCounters(poison, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDragCard (cardID, xCoordinate, yCoordinate) {
    try {
      await dragCard(cardID, xCoordinate, yCoordinate, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleTapCard (card) {
    try {
      await tapUntapCard(card._id, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <div style={{ display: 'flex' }}>
        <div style={{ padding: 8, width: '85%' }}>
          <div
            onDragOver={event => event.preventDefault()}
            onDrop={(event) => {
              handleDragCard(draggingCardID, (event.nativeEvent.offsetX * 100 / event.currentTarget.offsetWidth), (event.nativeEvent.offsetY * 100 / event.currentTarget.offsetHeight));
            }}
            style={{ height: 400, position: 'relative' }}
          >
            {match.players[0].mainboard.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  clickFunction={handleTapCard}
                  cursor='move'
                  draggable={true}
                  dragStartFunction={() => setDraggingCardID(card._id)}
                  dragEndFunction={() => setDraggingCardID(null)}
                  key={card._id}
                  style={{
                    left: `${card.x_coordinate}%`,
                    position: 'absolute',
                    top: `${card.y_coordinate}%`
                  }}
                />
              )
            })}
          </div>
          <PlayerInfo
            handleAdjustEnergyCounters={handleAdjustEnergyCounters}
            handleAdjustLifeTotal={handleAdjustLifeTotal}
            handleAdjustPoisonCounters={handleAdjustPoisonCounters}
            player={me}
          />
        </div>

        {/*<div style={{ border: '1px solid black', borderRadius: 4, width: '15%' }}>
          <h3 style={{ textDecoration: 'underline' }}>Match Log</h3>
          {match.log.map((update, index) => <p key={`log-update-${index + 1}`}>{index + 1}) {update}</p>)}
          </div>*/}
        <MatchLog log={match.log} />
      </div>
    </React.Fragment>
  );
};

export default Match;