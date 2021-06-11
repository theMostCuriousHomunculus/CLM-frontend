import React from 'react';
import { createClient } from 'graphql-ws';
// import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MagicCard from '../components/Event Page/MagicCard';
import PlayerInfo from '../components/Match Page/PlayerInfo';
import { AuthenticationContext } from '../contexts/authentication-context';
import { desiredMatchInfo, fetchMatchByID, tapUntapCard } from '../requests/GraphQL/match-requests.js';

// const useStyles = makeStyles({

// });

const Match = () => {

  const authentication = React.useContext(AuthenticationContext);
  // const classes = useStyles();
  const matchID = useParams().matchId;
  const [errorMessage, setErrorMessage] = React.useState();
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
        {match.players[0].mainboard.map(card => {
          return (
            <MagicCard
              cardData={card}
              clickFunction={handleTapCard}
              key={card._id}
            />
          )
        })}
      </div>
      <PlayerInfo player={me} />
    </React.Fragment>
  );
};

export default Match;