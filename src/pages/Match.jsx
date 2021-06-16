import React from 'react';
import MUISlider from '@material-ui/core/Slider';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import CardMenu from '../components/Match Page/CardMenu';
import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MatchLog from '../components/Match Page/MatchLog';
import PlayerInfo from '../components/Match Page/PlayerInfo';
import TheStack from '../components/Match Page/TheStack';
import { AuthenticationContext } from '../contexts/authentication-context';
import {
  adjustEnergyCounters,
  adjustLifeTotal,
  adjustPoisonCounters,
  desiredMatchInfo,
  dragCard,
  drawCard,
  fetchMatchByID,
  rollDice,
  shuffleLibrary,
  tapUntapCards,
  transferCard
} from '../requests/GraphQL/match-requests.js';

const useStyles = makeStyles({
  matchScreenFlexContainer: {
    display: 'flex',
    margin: 4,
    '& > *': {
      margin: 4
    }
  },
  playZoneContainer: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0
  }
});

export default function Match () {

  const authentication = React.useContext(AuthenticationContext);
  const [cardSize, setCardSize] = React.useState(63*88*2);
  const classes = useStyles();
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
  const player = participant ?
    match.players.find(plr => plr.account._id === authentication.userId) :
    match.players[0];
  let opponent;
  
  if (participant && match.players.length === 2) {
    opponent = match.players.find(plr => plr.account._id !== authentication.userId);
  } else if (!participant && match.players.length === 2) {
    opponent = match.players[1];
  } else {
    opponent = null;
  }

  const [rightClickedCard, setRightClickedCard] = React.useState({
    _id: null,
    anchorElement: null,
    origin: null,
    visibility: []
  });
  const topZIndex = Math.max(...player.battlefield.map(crd => crd.z_index)) + 1;

  async function handleAdjustEnergyCounters (energy) {
    try {
      await adjustEnergyCounters(energy, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const handleAdjustLifeTotal = React.useCallback(async function (life) {
    try {
      await adjustLifeTotal(life, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleAdjustPoisonCounters = React.useCallback(async function  (poison) {
    try {
      await adjustPoisonCounters(poison, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleDragCard = React.useCallback(async function (xCoordinate, yCoordinate) {
    try {
      await dragCard(draggingCardID, xCoordinate, yCoordinate, topZIndex, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [draggingCardID, topZIndex, matchID, authentication.token]);

  const handleDrawCard = React.useCallback(async function () {
    try {
      await drawCard(matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleRollDice = React.useCallback(async function  (sides) {
    try {
      await rollDice(sides, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleShuffleLibrary = React.useCallback(async function () {
    try {
      await shuffleLibrary(matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleTapUntapCards = React.useCallback(async function  (cardIDs) {
    try {
      await tapUntapCards(cardIDs, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }, [matchID, authentication.token]);

  const handleTransferCard = React.useCallback(async function  (destinationZone, index, reveal, shuffle) {
    try {
      setRightClickedCard(prevState => ({
        ...prevState,
        anchorElement: null
      }));
      await transferCard(rightClickedCard._id,
        destinationZone,
        index,
        rightClickedCard.origin,
        reveal,
        shuffle,
        matchID,
        authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setRightClickedCard({
        _id: null,
        anchorElement: null,
        origin: null,
        visibility: []
      });
    }
  }, [rightClickedCard, matchID, authentication.token]);

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

  React.useEffect(() => {
    function handleHotKeys (event) {

      if (event.altKey && event.shiftKey && event.key === 'D') {
        handleDrawCard();
      }

      if (event.altKey && event.shiftKey && event.key === 'S') {
        handleShuffleLibrary();
      }

      if (event.altKey && event.shiftKey && event.key === 'U') {
        handleTapUntapCards(player.battlefield.filter(crd => crd.tapped).map(crd => crd._id));
      }
    }

    document.addEventListener("keydown", handleHotKeys);

    return () => document.removeEventListener("keydown", handleHotKeys);
  }, [handleDrawCard, handleShuffleLibrary, handleTapUntapCards, player.battlefield])

  return (
    loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <CardMenu
        handleTransferCard={handleTransferCard}
        rightClickedCard={rightClickedCard}
        setRightClickedCard={setRightClickedCard}
      />

      {match.stack.length > 0 &&
        <TheStack
          setRightClickedCard={setRightClickedCard}
          stack={match.stack}
        />
      }

      <div className={classes.matchScreenFlexContainer}>
        <div style={{ display: 'flex', flexShrink: 0 }}>
          <MUITypography style={{ transform: 'rotate(180deg)', writingMode: 'vertical-lr' }} variant='subtitle1'>
            Adjust Card Size
          </MUITypography>
          <MUISlider
            aria-labelledby='vertical-slider'
            max={63*88*3}
            min={63*88}
            onChange={(event, newValue) => setCardSize(newValue)}
            orientation='vertical'
            value={cardSize}
          />
        </div>

        <div className={classes.playZoneContainer}>
          {/*Opponent's zones*/}

          <PlayerInfo
            cardSize={cardSize}
            handleAdjustEnergyCounters={handleAdjustEnergyCounters}
            handleAdjustLifeTotal={handleAdjustLifeTotal}
            handleAdjustPoisonCounters={handleAdjustPoisonCounters}
            handleDragCard={handleDragCard}
            handleRollDice={handleRollDice}
            handleTapUntapCards={handleTapUntapCards}
            setDraggingCardID={setDraggingCardID}
            setRightClickedCard={setRightClickedCard}
            player={player}
          />
        </div>

        <MatchLog log={match.log} />
      </div>
    </React.Fragment>
  );
};