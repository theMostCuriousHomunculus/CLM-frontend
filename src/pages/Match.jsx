import React from 'react';
import MUIHelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MUIIconButton from '@material-ui/core/IconButton'
import MUISlider from '@material-ui/core/Slider';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import CardMenu from '../components/Match Page/CardMenu';
import HelpDialog from '../components/Match Page/HelpDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MatchLog from '../components/Match Page/MatchLog';
import NumberInputDialog from '../components/miscellaneous/NumberInputDialog';
import PlayZone from '../components/Match Page/PlayZone';
import TheStack from '../components/Match Page/TheStack';
import ZoneInspectionDialog from '../components/Match Page/ZoneInspectionDialog';
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
import PlayerMenu from '../components/Match Page/PlayerMenu';

const useStyles = makeStyles({
  matchScreenFlexContainer: {
    display: 'flex',
    '& > *': {
      margin: 4
    }
  }
});

export default function Match () {

  const authentication = React.useContext(AuthenticationContext);
  const [cardSize, setCardSize] = React.useState(63*88*2);
  const classes = useStyles();
  const [clickedPlayer, setClickedPlayer] = React.useState({
    _id: null,
    anchorElement: null,
    position: null
  });
  const [displayedZones, setDisplayedZones] = React.useState({
    bottomExile: true,
    bottomGraveyard: true,
    bottomHand: true,
    bottomLibrary: true,
    topExile: true,
    topGraveyard: true,
    topHand: true,
    topLibrary: true
  });
  const [helpDisplayed, setHelpDisplayed] = React.useState(false);
  const matchID = useParams().matchId;
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
  const [numberInputDialogInfo, setNumberInputDialogInfo] = React.useState({
    buttonText: null,
    defaultValue: null,
    inputLabel: null,
    title: null,
    updateFunction: null
  });
  const participant = match.players.some(plr => plr.account._id === authentication.userId);
  const bottomPlayer = participant ?
    match.players.find(plr => plr.account._id === authentication.userId) :
    match.players[0];
  let topPlayer;
  
  if (participant && match.players.length === 2) {
    topPlayer = match.players.find(plr => plr.account._id !== authentication.userId);
  } else if (!participant && match.players.length === 2) {
    topPlayer = match.players[1];
  } else {
    topPlayer = null;
  }

  const [rightClickedCard, setRightClickedCard] = React.useState({
    _id: null,
    anchorElement: null,
    controller: null,
    origin: null,
    owner: null,
    visibility: []
  });
  const [zoneName, setZoneName] = React.useState(null);

  async function handleAdjustEnergyCounters (energy) {
    try {
      await adjustEnergyCounters(energy, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleAdjustLifeTotal = React.useCallback(async function (life) {
    try {
      await adjustLifeTotal(life, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleAdjustPoisonCounters = React.useCallback(async function  (poison) {
    try {
      await adjustPoisonCounters(poison, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleDragCard = React.useCallback(async function (cardID, xCoordinate, yCoordinate, zIndex) {
    try {
      await dragCard(cardID, xCoordinate, yCoordinate, zIndex, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleDrawCard = React.useCallback(async function () {
    try {
      await drawCard(matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleRollDice = React.useCallback(async function  (sides) {
    try {
      await rollDice(sides, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleShuffleLibrary = React.useCallback(async function () {
    try {
      await shuffleLibrary(matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
    }
  }, [matchID, authentication.token]);

  const handleTapUntapCards = React.useCallback(async function  (cardIDs) {
    try {
      await tapUntapCards(cardIDs, matchID, authentication.token);
    } catch (error) {
      console.log(error.message);
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
      console.log(error.message);
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
        console.log(error.message);
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

    return client.dispose;
  }, [authentication.token, matchID]);

  React.useEffect(() => {
    function handleHotKeys (event) {

      if (event.altKey && event.shiftKey && event.key === 'D') {
        handleDrawCard();
      }

      if (event.altKey && event.shiftKey && event.key === 'R') {
        setNumberInputDialogInfo({
          buttonText: "Roll",
          defaultValue: 6,
          inputLabel: "Number of Sides",
          title: "Roll Dice",
          updateFunction: (updatedValue) => handleRollDice(updatedValue)
        });
      }

      if (event.altKey && event.shiftKey && event.key === 'S') {
        handleShuffleLibrary();
      }

      if (event.altKey && event.shiftKey && event.key === 'U') {
        handleTapUntapCards(bottomPlayer.battlefield.filter(crd => crd.tapped).map(crd => crd._id));
      }

    }

    if (participant) {
      document.addEventListener("keydown", handleHotKeys);

      return () => document.removeEventListener("keydown", handleHotKeys);
    }

  }, [handleDrawCard, handleRollDice, handleShuffleLibrary, handleTapUntapCards, participant, bottomPlayer.battlefield]);

  return (
    loading ?
    <LoadingSpinner /> :
    <React.Fragment>
      <HelpDialog
        open={helpDisplayed}
        close={() => setHelpDisplayed(false)}
      />

      <NumberInputDialog
        buttonText={numberInputDialogInfo.buttonText}
        close={() => setNumberInputDialogInfo({
          buttonText: null,
          defaultValue: null,
          inputLabel: null,
          title: null,
          updateFunction: null
        })}
        defaultValue={numberInputDialogInfo.defaultValue}
        inputLabel={numberInputDialogInfo.inputLabel}
        title={numberInputDialogInfo.title}
        updateFunction={numberInputDialogInfo.updateFunction}
      />

      <ZoneInspectionDialog
        close={() => {
          setZoneName(null);
          setClickedPlayer({
            _id: null,
            anchorElement: null,
            position: null
          });
        }}
        player={clickedPlayer.position === 'top' ? topPlayer : bottomPlayer}
        setRightClickedCard={setRightClickedCard}
        zoneName={zoneName}
      />

      <CardMenu
        handleTransferCard={handleTransferCard}
        rightClickedCard={rightClickedCard}
        setRightClickedCard={setRightClickedCard}
      />

      <PlayerMenu
        bottomPlayer={bottomPlayer}
        clickedPlayer={clickedPlayer}
        displayedZones={displayedZones}
        handleAdjustEnergyCounters={handleAdjustEnergyCounters}
        handleAdjustLifeTotal={handleAdjustLifeTotal}
        handleAdjustPoisonCounters={handleAdjustPoisonCounters}
        setClickedPlayer={setClickedPlayer}
        setDisplayedZones={setDisplayedZones}
        setNumberInputDialogInfo={setNumberInputDialogInfo}
        setZoneName={setZoneName}
      />

      {match.stack.length > 0 &&
        <TheStack
          setRightClickedCard={setRightClickedCard}
          stack={match.stack}
        />
      }

      <div className={classes.matchScreenFlexContainer}>
        <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <MUIIconButton aria-label='help' color='primary' onClick={() => setHelpDisplayed(true)}>
            <MUIHelpOutlineIcon />
          </MUIIconButton>
          <div style={{ display: 'flex', flexGrow: 1 }}>
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
        </div>

        <PlayZone
          bottomPlayer={bottomPlayer}
          cardSize={cardSize}
          displayedZones={displayedZones}
          handleDragCard={handleDragCard}
          handleTapUntapCards={handleTapUntapCards}
          setClickedPlayer={setClickedPlayer}
          setRightClickedCard={setRightClickedCard}
          topPlayer={topPlayer}
        />

        <MatchLog log={match.log} />
      </div>
    </React.Fragment>
  );
};