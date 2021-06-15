import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUIFavoriteIcon from '@material-ui/icons/Favorite';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITooltip from '@material-ui/core/Tooltip';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import MagicCard from '../miscellaneous/MagicCard';
import NumberInputDialog from '../miscellaneous/NumberInputDialog';
// import ZoneInspectionDialog from './ZoneInspectionDialog';
import { ReactComponent as EnergySymbol } from '../../svgs/energy.svg';
import { ReactComponent as LibrarySymbol } from '../../svgs/deck.svg';
import { ReactComponent as PoisonSymbol } from '../../svgs/poison.svg';

const useStyles = makeStyles({
  badgeIcon: {
    height: 16,
    width: 16
  },
  energyBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: yellow[500],
      color: 'black'
    }
  },
  libraryBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: blue[500],
      color: 'white'
    }
  },
  lifeBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: red[500],
      color: 'white'
    }
  },
  poisonBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: green[500],
      color: 'white'
    }
  }
});

export default function PlayerInfo (props) {

  const {
    cardSize,
    handleAdjustEnergyCounters,
    handleAdjustLifeTotal,
    handleAdjustPoisonCounters,
    handleDragCard,
    handleRollDice,
    handleTapUntapCard,
    setDraggingCardID,
    setOriginZone,
    setRightClickedCardAnchorElement,
    setRightClickedCardID,
    player
  } = props;
  const battlefieldRef = React.useRef();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [exileDisplayed, setExileDisplayed] = React.useState(true);
  const [graveyardDisplayed, setGraveyardDisplayed] = React.useState(true);
  const [libraryDisplayed, setLibraryDisplayed] = React.useState(true);
  const [numberInputDialogInfo, setNumberInputDialogInfo] = React.useState({
    buttonText: null,
    defaultValue: null,
    inputLabel: null,
    title: null,
    updateFunction: null
  });
  // const [zoneName, setZoneName] = React.useState(null);

  return (
    <React.Fragment>
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

      {/*<ZoneInspectionDialog
        close={() => setZoneName(null)}
        player={player}
        setRightClickedCardAnchorElement={setRightClickedCardAnchorElement}
        setRightClickedCardID={setRightClickedCardID}
        zoneName={zoneName}
      />*/}

      <MUIMenu
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
        {/*<MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setOriginZone('sideboard');
            setZoneName('sideboard');
          }}
        >
          Inspect Sideboard
        </MUIMenuItem>*/}
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
      </MUIMenu>

      <div style={{ display: 'flex', flexGrow: 1 }}>
        {libraryDisplayed &&
          <div
            style={{
              borderRadius: 4,
              border: '1px solid black',
              maxHeight: `calc(100vh - 16px - ${cardSize / 63}px)`,
              overflowY: 'auto'
            }}
          >
            {player.library.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setOriginZone('library');
                    setRightClickedCardAnchorElement(event.currentTarget);
                    setRightClickedCardID(card._id);
                  }}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    height: cardSize / 63,
                    width: cardSize / 88
                  }}
                />
              );
            })}
          </div>
        }
        <div
          onDragOver={event => event.preventDefault()}
          onDrop={(event) => {
            if (event.nativeEvent.path[0] === battlefieldRef.current) {
              handleDragCard(
                (event.nativeEvent.offsetX * 100 / battlefieldRef.current.offsetWidth),
                (event.nativeEvent.offsetY * 100 / battlefieldRef.current.offsetHeight));
            } else {
              // the user dropped the card on top of another card
              handleDragCard(
                parseFloat(event.nativeEvent.path[1].style.left) + (event.nativeEvent.offsetX * 100 / battlefieldRef.current.offsetWidth),
                parseFloat(event.nativeEvent.path[1].style.top) + (event.nativeEvent.offsetY * 100 / battlefieldRef.current.offsetHeight));
            }
          }}
          ref={battlefieldRef}
          style={{ borderRadius: 4, border: '1px solid black', flexGrow: 1, overflow: 'hidden', position: 'relative' }}
        >
          {player.battlefield.map(card => {
            return (
              <div
                draggable={true}
                key={card._id}
                onDragEnd={(event) => {
                  event.persist();
                  setDraggingCardID(null);
                  event.target.style.opacity = 1;
                }}
                onDragStart={(event) => {
                  event.persist();
                  setDraggingCardID(card._id);
                  event.target.style.opacity = 0.3;
                }}
                style={{
                  left: `${card.x_coordinate}%`,
                  position: 'absolute',
                  top: `${card.y_coordinate}%`,
                  zIndex: card.z_index
                }}
              >
                <MagicCard
                  cardData={card}
                  clickFunction={() => handleTapUntapCard(card._id)}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setOriginZone('battlefield');
                    setRightClickedCardAnchorElement(event.currentTarget);
                    setRightClickedCardID(card._id);
                  }}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    cursor: 'move',
                    height: cardSize / 63,
                    transform: card.tapped ? 'rotate(90deg)' : '',
                    width: cardSize / 88
                  }}
                />
              </div>
            )
          })}
        </div>
        {graveyardDisplayed &&
          <div
            style={{
              borderRadius: 4,
              border: '1px solid black',
              maxHeight: `calc(100vh - 16px - ${cardSize / 63}px)`,
              overflowY: 'auto'
            }}
          >
            {player.graveyard.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setOriginZone('graveyard');
                    setRightClickedCardAnchorElement(event.currentTarget);
                    setRightClickedCardID(card._id);
                  }}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    height: cardSize / 63,
                    width: cardSize / 88
                  }}
                />
              );
            })}
          </div>
        }
        {exileDisplayed &&
          <div
            style={{
              borderRadius: 4,
              border: '1px solid black',
              maxHeight: `calc(100vh - 16px - ${cardSize / 63}px)`,
              overflowY: 'auto'
            }}
          >
            {player.exile.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setOriginZone('exile');
                    setRightClickedCardAnchorElement(event.currentTarget);
                    setRightClickedCardID(card._id);
                  }}
                  style={{
                    // magic card dimentions are 63mm x 88mm
                    height: cardSize / 63,
                    width: cardSize /  88
                  }}
                />
              );
            })}
          </div>
        }
      </div>
      
      <div
        style={{
          border: '1px solid black',
          borderRadius: 4,
          display: 'flex',
          flexGrow: 1,
          overflowX: 'auto',
          // whiteSpace: 'nowrap'
        }}
      >
        {player.hand.map(card => {
          return (
            <MagicCard
              cardData={card}
              key={card._id}
              rightClickFunction={(event) => {
                event.preventDefault();
                setOriginZone('hand');
                setRightClickedCardAnchorElement(event.currentTarget);
                setRightClickedCardID(card._id);
              }}
              style={{
                flexShrink: 0,
                // magic card dimentions are 63mm x 88mm
                height: cardSize / 63,
                width: cardSize / 88
              }}
            />
          );
        })}
      </div>
      
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
    </React.Fragment>
  );
}