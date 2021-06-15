import React from 'react';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
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
  rollDice,
  tapUntapCard,
  transferCard
} from '../requests/GraphQL/match-requests.js';

// const useStyles = makeStyles({

// });

const Match = () => {

  const authentication = React.useContext(AuthenticationContext);
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

  const [originZone, setOriginZone] = React.useState(null);
  const [rightClickedCardAnchorElement, setRightClickedCardAnchorElement] = React.useState(null);
  const [rightClickedCardID, setRightClickedCardID] = React.useState(null);
  const topZIndex = Math.max(...player.battlefield.map(crd => crd.z_index)) + 1;

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

  async function handleDragCard (xCoordinate, yCoordinate) {
    try {
      await dragCard(draggingCardID, xCoordinate, yCoordinate, topZIndex, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleRollDice (sides) {
    try {
      await rollDice(sides, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleTapUntapCard (cardID) {
    try {
      await tapUntapCard(cardID, matchID, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleTransferCard (destinationZone, index, reveal, shuffle) {
    try {
      await transferCard(rightClickedCardID,
        destinationZone,
        index,
        originZone,
        reveal,
        shuffle,
        matchID,
        authentication.token);
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

      {/*perhaps this should be broken out into its own component*/}
      <MUIMenu
        anchorEl={rightClickedCardAnchorElement}
        keepMounted
        open={Boolean(rightClickedCardAnchorElement)}
        onClose={() => setRightClickedCardAnchorElement(null)}
      >
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('battlefield', null, false, false);
          }}
        >
          Place Face Down on Battlefield
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('battlefield', null, true, false);
          }}
        >
          Place Face Up on Battlefield
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('exile', null, false, false);
          }}
        >
          Place Face Down in Exile
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('exile', null, true, false);
          }}
        >
          Place Face Up in Exile
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('graveyard', null, true, false);
          }}
        >
          Move to Graveyard
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('hand', null, true, false);
          }}
        >
          Reveal and Put in Hand
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('hand', null, false, false);
          }}
        >
          Put in Hand Without Revealing
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('library', null, true, true);
          }}
        >
          Reveal and Shuffle into Library
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('library', null, false, true);
          }}
        >
          Shuffle into Library Without Revealing
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('stack', null, false, false);
          }}
        >
          Place Face Down on the Stack
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setRightClickedCardAnchorElement(null);
            handleTransferCard('stack', null, true, false);
          }}
        >
          Place Face Up on the Stack
        </MUIMenuItem>
      </MUIMenu>

      {/*<MUIMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setNumberInputDialogInfo({
              buttonText: "Update",
              defaultValue: player.energy,
              inputLabel: "Energy",
              title: "Update Your Energy Counters",
              updateFunction: (updatedValue) => handleAdjustEnergyCounters(updatedValue)
            });
          }}
        >
          Adjust Energy Counters
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setNumberInputDialogInfo({
              buttonText: "Update",
              defaultValue: player.life,
              inputLabel: "Life",
              title: "Update Your Life Total",
              updateFunction: (updatedValue) => handleAdjustLifeTotal(updatedValue)
            });
          }}
        >
          Adjust Life Total
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setNumberInputDialogInfo({
              buttonText: "Update",
              defaultValue: player.poison,
              inputLabel: "Poison",
              title: "Update Your Poison Counters",
              updateFunction: (updatedValue) => handleAdjustPoisonCounters(updatedValue)
            });
          }}
        >
          Adjust Poison Counters
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setOriginZone('exile');
            setExileDisplayed(prevState => !prevState);
          }}
        >
          {exileDisplayed ? "Hide Exile Zone" : "Inspect Exile Zone"}
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setOriginZone('graveyard');
            setGraveyardDisplayed(prevState => !prevState);
          }}
        >
          {graveyardDisplayed ? "Hide Graveyard" : "Inspect Graveyard"}
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setOriginZone('library');
            setLibraryDisplayed(prevState => !prevState);
          }}
        >
          {libraryDisplayed ? "Hide Library" : "Inspect Library"}
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setOriginZone('sideboard');
            setZoneName('sideboard');
          }}
        >
          Inspect Sideboard
        </MUIMenuItem>
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setNumberInputDialogInfo({
              buttonText: "Roll",
              defaultValue: 6,
              inputLabel: "Number of Sides",
              title: "Roll Dice",
              updateFunction: (updatedValue) => handleRollDice(updatedValue)
            });
          }}
        >
          Roll Dice
        </MUIMenuItem>
      </MUIMenu>*/}

      {/*
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
          close={() => setZoneName(null)}
          player={player}
          setRightClickedCardAnchorElement={setRightClickedCardAnchorElement}
          setRightClickedCardID={setRightClickedCardID}
          zoneName={zoneName}
        />
      */}

      {/*
        <MUITooltip title={player.account.name}>
          <div>
            <MUIBadge
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              badgeContent={<React.Fragment>
                <EnergySymbol className={classes.badgeIcon} /> : {player.energy > 99 ? '99+' : player.energy}
              </React.Fragment>}
              className={classes.energyBadge}
              overlap='circle'
              showZero
            >
              <MUIBadge
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                badgeContent={<React.Fragment>
                  <MUIFavoriteIcon className={classes.badgeIcon} /> : {player.life > 99 ? '99+' : player.life}
                </React.Fragment>}
                className={classes.lifeBadge}
                overlap='circle'
                showZero
              >
                <MUIBadge
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  badgeContent={<React.Fragment>
                    <PoisonSymbol className={classes.badgeIcon} /> : {player.poison > 10 ? '10+' : player.poison}
                  </React.Fragment>}
                  className={classes.poisonBadge}
                  overlap='circle'
                  showZero
                >
                  <MUIBadge
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    badgeContent={<React.Fragment>
                      <LibrarySymbol className={classes.badgeIcon} /> : {player.library.length > 99 ? '99+' : player.library.length}
                    </React.Fragment>}
                    className={classes.libraryBadge}
                    overlap='circle'
                    showZero
                  >
                    <LargeAvatar
                      alt={player.account.name}
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                      src={player.account.avatar}
                    />
                  </MUIBadge>
                </MUIBadge>
              </MUIBadge>
            </MUIBadge>
          </div>
        </MUITooltip>
      */}

      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex', flexShrink: 0 }}>
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

        <div style={{ display: 'flex', flex: '1 1 0', flexDirection: 'column', minWidth: 0 }}>
          {/*opponent &&
            // opponent's zones
            <div style={{ display: 'flex' }}>
              {opponentGraveyardDisplayed &&
                <div
                  style={{
                    borderRadius: 4,
                    border: '1px solid black',
                    maxHeight: 'calc(50vh - 24px)',
                    overflowY: 'auto'
                  }}
                >
                  {opponent.graveyard.map(card => {
                    return (
                      <MagicCard
                        cardData={card}
                        key={card._id}
                        style={{
                          // magic card dimentions are 63mm x 88mm
                          height: cardSize * (88 / (63 * 88)),
                          width: cardSize * (63 / (63 * 88))
                        }}
                      />
                    );
                  })}
                </div>
              }
              {opponentExileDisplayed &&
                <div
                  style={{
                    borderRadius: 4,
                    border: '1px solid black',
                    maxHeight: 'calc(50vh - 24px)',
                    overflowY: 'auto'
                  }}
                >
                  {opponent.exile.map(card => {
                    return (
                      <MagicCard
                        cardData={card}
                        key={card._id}
                        style={{
                          // magic card dimentions are 63mm x 88mm
                          height: cardSize * (88 / (63 * 88)),
                          width: cardSize * (63 / (63 * 88))
                        }}
                      />
                    );
                  })}
                </div>
              }
              <div
                style={{
                  borderRadius: 4,
                  border: '1px solid black',
                  flexGrow: 8,
                  overflow: 'hidden',
                  position: 'relative',
                  transform: 'rotate(180deg)'
                }}
              >
                {opponent.battlefield.map(card => {
                  return (
                    <div
                      key={card._id}
                      style={{
                        left: `${card.x_coordinate}%`,
                        position: 'absolute',
                        top: `${card.y_coordinate}%`,
                        zIndex: card.z_index
                      }}
                    >
                      <MagicCard
                        cardData={card}
                        style={{
                          // magic card dimentions are 63mm x 88mm
                          height: cardSize * (88 / (63 * 88)),
                          transform: card.tapped ? 'rotate(90deg)' : '',
                          width: cardSize * (63 / (63 * 88))
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          */}

          <PlayerInfo
            cardSize={cardSize}
            handleAdjustEnergyCounters={handleAdjustEnergyCounters}
            handleAdjustLifeTotal={handleAdjustLifeTotal}
            handleAdjustPoisonCounters={handleAdjustPoisonCounters}
            handleDragCard={handleDragCard}
            handleRollDice={handleRollDice}
            handleTapUntapCard={handleTapUntapCard}
            setDraggingCardID={setDraggingCardID}
            setOriginZone={setOriginZone}
            setRightClickedCardAnchorElement={setRightClickedCardAnchorElement}
            setRightClickedCardID={setRightClickedCardID}
            player={player}
          />
        </div>

        <MatchLog log={match.log} />
      </div>
    </React.Fragment>
  );
};

export default Match;