import React from 'react';
import MUISlider from '@material-ui/core/Slider';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
// import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MagicCard from '../components/miscellaneous/MagicCard';
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
  const battlefieldRef = React.useRef();
  const [cardSize, setCardSize] = React.useState(5544);
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
  const topZIndex = Math.max(...me.mainboard.map(crd => crd.z_index)) + 1;

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
      await dragCard(cardID, xCoordinate, yCoordinate, topZIndex, matchID, authentication.token);
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

      <div style={{ margin: 8, display: 'flex' }}>
        <div style={{ display: 'flex' }}>
          <MUITypography style={{ transform: 'rotate(180deg)', writingMode: 'vertical-lr' }} variant='caption'>
            Adjust Card Size
          </MUITypography>
          <MUISlider
            aria-labelledby='vertical-slider'
            max={63*88*4}
            min={63*88}
            onChange={(event, newValue) => setCardSize(newValue)}
            orientation='vertical'
            value={cardSize}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, margin: '0 8px' }}>
          <div
            style={{
              borderRadius: 4,
              border: '1px solid black',
              flexGrow: 1,
              overflow: 'hidden',
              position: 'relative',
              transform: 'rotate(180deg)'
            }}
          >
            {match.players[0].battlefield.map(card => {
              return (
                <MagicCard
                  absolute={true}
                  cardData={card}
                  key={`${card._id}-mirror`}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    height: cardSize * (88 / (63 * 88)),
                    transform: card.tapped ? 'rotate(90deg)' : '',
                    width: cardSize * (63 / (63 * 88))
                  }}
                />
              )
            })}
          </div>
          <div
            onDragOver={event => event.preventDefault()}
            onDrop={(event) => {
              if (event.nativeEvent.path[0] === battlefieldRef.current) {
                handleDragCard(draggingCardID,
                  (event.nativeEvent.offsetX * 100 / battlefieldRef.current.offsetWidth),
                  (event.nativeEvent.offsetY * 100 / battlefieldRef.current.offsetHeight));
              } else {
                // the user dropped the card on top of another card
                handleDragCard(draggingCardID,
                  ((parseFloat(event.nativeEvent.path[1].style.left) * battlefieldRef.current.offsetWidth)
                  + (event.nativeEvent.offsetX * 100)) / battlefieldRef.current.offsetWidth,
                  ((parseFloat(event.nativeEvent.path[1].style.top) * battlefieldRef.current.offsetHeight)
                  + (event.nativeEvent.offsetY * 100)) / battlefieldRef.current.offsetHeight);
              }
            }}
            ref={battlefieldRef}
            style={{ borderRadius: 4, border: '1px solid black', flexGrow: 1, overflow: 'hidden', position: 'relative' }}
          >
            {match.players[0].battlefield.map(card => {
              return (
                <MagicCard
                  absolute={true}
                  cardData={card}
                  clickFunction={handleTapCard}
                  draggable={true}
                  dragStartFunction={() => setDraggingCardID(card._id)}
                  dragEndFunction={() => setDraggingCardID(null)}
                  key={card._id}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    cursor: 'move',
                    height: cardSize * (88 / (63 * 88)),
                    transform: card.tapped ? 'rotate(90deg)' : '',
                    width: cardSize * (63 / (63 * 88))
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

        <MatchLog log={match.log} />
      </div>
    </React.Fragment>
  );
};

export default Match;