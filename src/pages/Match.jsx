import React from 'react';
import MUIHelpOutlineIcon from '@material-ui/icons/HelpOutline';
import MUIIconButton from '@material-ui/core/IconButton'
import MUISlider from '@material-ui/core/Slider';
import MUITypography from '@material-ui/core/Typography';
import { createClient } from 'graphql-ws';
import { makeStyles } from '@material-ui/core/styles';

import CardMenu from '../components/Match Page/CardMenu';
import HelpDialog from '../components/Match Page/HelpDialog';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MatchLog from '../components/Match Page/MatchLog';
import NumberInputDialog from '../components/miscellaneous/NumberInputDialog';
import PlayZone from '../components/Match Page/PlayZone';
import TheStack from '../components/Match Page/TheStack';
import ZoneInspectionDialog from '../components/Match Page/ZoneInspectionDialog';
import { AuthenticationContext } from '../contexts/authentication-context';
import { MatchContext } from '../contexts/match-context';
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
  const [numberInputDialogInfo, setNumberInputDialogInfo] = React.useState({
    buttonText: null,
    defaultValue: null,
    inputLabel: null,
    title: null,
    updateFunction: null
  });
  const {
    loading,
    matchQuery,
    matchState,
    setMatchState,
    drawCard,
    fetchMatchByID,
    rollDice,
    shuffleLibrary,
    tapUntapCards
  } = React.useContext(MatchContext);
  const participant = matchState.players.some(plr => plr.account._id === authentication.userId);
  const bottomPlayer = participant ?
    matchState.players.find(plr => plr.account._id === authentication.userId) :
    matchState.players[0];
  let topPlayer;
  
  if (participant && matchState.players.length === 2) {
    topPlayer = matchState.players.find(plr => plr.account._id !== authentication.userId);
  } else if (!participant && matchState.players.length === 2) {
    topPlayer = matchState.players[1];
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

  React.useEffect(function () {

    async function initialize () {
      await fetchMatchByID();
    }

    initialize();

    const client = createClient({
      connectionParams: {
        authToken: authentication.token,
        matchID: matchState._id
      },
      url: process.env.REACT_APP_GRAPHQL_WS_URL
    });

    async function subscribe () {
      function onNext(update) {
        setMatchState(update.data.joinMatch);
      }

      await new Promise((resolve, reject) => {
        client.subscribe({
          query: `subscription {
            joinMatch {
              ${matchQuery}
            }
          }`
        },
        {
          complete: resolve,
          error: reject,
          next: onNext
        });
      });
    }

    subscribe(result => console.log(result), error => console.log(error));

    return client.dispose;
  }, [authentication.token, fetchMatchByID, matchQuery, matchState._id, setMatchState]);

  React.useEffect(() => {
    function handleHotKeys (event) {

      if (event.altKey && event.shiftKey && event.key === 'D') {
        drawCard();
      }

      if (event.altKey && event.shiftKey && event.key === 'R') {
        setNumberInputDialogInfo({
          buttonText: "Roll",
          defaultValue: 6,
          inputLabel: "Number of Sides",
          title: "Roll Dice",
          updateFunction: updatedValue => rollDice(updatedValue)
        });
      }

      if (event.altKey && event.shiftKey && event.key === 'S') {
        shuffleLibrary();
      }

      if (event.altKey && event.shiftKey && event.key === 'U') {
        tapUntapCards(bottomPlayer.battlefield.filter(crd => crd.tapped).map(crd => crd._id));
      }

    }

    if (participant) {
      document.addEventListener("keydown", handleHotKeys);

      return () => document.removeEventListener("keydown", handleHotKeys);
    }

  }, [drawCard, rollDice, shuffleLibrary, tapUntapCards, participant, bottomPlayer.battlefield]);

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
        rightClickedCard={rightClickedCard}
        setRightClickedCard={setRightClickedCard}
      />

      <PlayerMenu
        bottomPlayer={bottomPlayer}
        clickedPlayer={clickedPlayer}
        displayedZones={displayedZones}
        setClickedPlayer={setClickedPlayer}
        setDisplayedZones={setDisplayedZones}
        setNumberInputDialogInfo={setNumberInputDialogInfo}
        setZoneName={setZoneName}
      />

      {matchState.stack.length > 0 &&
        <TheStack setRightClickedCard={setRightClickedCard} />
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
          participant={participant}
          setClickedPlayer={setClickedPlayer}
          setRightClickedCard={setRightClickedCard}
          topPlayer={topPlayer}
        />

        <MatchLog />
      </div>
    </React.Fragment>
  );
};