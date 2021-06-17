import React from 'react';
import Draggable from 'react-draggable';
import MUIBadge from '@material-ui/core/Badge';
import MUIFavoriteIcon from '@material-ui/icons/Favorite';
import MUITooltip from '@material-ui/core/Tooltip';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import MagicCard from '../miscellaneous/MagicCard';
import { ReactComponent as EnergySymbol } from '../../svgs/energy.svg';
import { ReactComponent as LibrarySymbol } from '../../svgs/deck.svg';
import { ReactComponent as PoisonSymbol } from '../../svgs/poison.svg';

const useStyles = makeStyles({
  badgeIcon: {
    height: 16,
    width: 16
  },
  battlefieldContainer: {
    border: '1px solid black',
    borderRadius: 4,
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  energyBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: yellow[500],
      color: 'black'
    }
  },
  collapsableZoneContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  columnFlex: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0
  },
  handContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    flexGrow: 1,
    overflowX: 'auto'
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
  rowFlex: {
    display: 'flex',
    flex: '1 1 0',
    minHeight: 0
  },
  poisonBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: green[500],
      color: 'white'
    }
  },
  playZoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1
  }
});

export default function PlayZone ({
  bottomPlayer,
  cardSize,
  displayedZones,
  handleDragCard,
  handleTapUntapCards,
  setClickedPlayer,
  setRightClickedCard,
  topPlayer
}) {

  const battlefieldRef = React.useRef();
  const classes = useStyles();
  const topZIndex = Math.max(...bottomPlayer.battlefield.map(crd => crd.z_index)) + 1;
  const notInPlay = {
    flexShrink: 0,
    // magic card dimentions are 63mm x 88mm
    height: cardSize / 63,
    width: cardSize / 88
  }

  return (
    <div className={classes.playZoneContainer}>
      {topPlayer &&
        <div className={classes.columnFlex}  style={{ transform: 'rotate(180deg)'}}>
          <div className={classes.rowFlex}>
            {displayedZones.topLibrary &&
              <div className={classes.collapsableZoneContainer}>
                {topPlayer.library.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                  return (
                    <MagicCard
                      cardData={card}
                      key={card._id}
                      rightClickFunction={(event) => {
                        event.preventDefault();
                        setRightClickedCard({
                          _id: card._id,
                          anchorElement: event.currentTarget,
                          controller: card.controller._id,
                          origin: 'library',
                          owner: card.owner._id,
                          visibility: card.visibility
                        });
                      }}
                      style={notInPlay}
                    />
                  );
                })}
              </div>
            }
            <div className={classes.battlefieldContainer}>
              {topPlayer.battlefield.map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'battlefield',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    style={{
                      // magic card dimentions are 63mm x 88mm
                      height: cardSize / 63,
                      left: `${card.x_coordinate}%`,
                      position: 'absolute',
                      top: `${card.y_coordinate}%`,
                      width: cardSize / 88,
                      zIndex: card.z_index
                    }}
                  />
                )
              })}
            </div>
            {displayedZones.topGraveyard &&
              <div className={classes.collapsableZoneContainer}>
                {topPlayer.graveyard.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                  return (
                    <MagicCard
                      cardData={card}
                      key={card._id}
                      rightClickFunction={(event) => {
                        event.preventDefault();
                        setRightClickedCard({
                          _id: card._id,
                          anchorElement: event.currentTarget,
                          controller: card.controller._id,
                          origin: 'graveyard',
                          owner: card.owner._id,
                          visibility: card.visibility
                        });
                      }}
                      style={notInPlay}
                    />
                  );
                })}
              </div>
            }
            {displayedZones.topExile &&
              <div className={classes.collapsableZoneContainer}>
                {topPlayer.exile.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                  return (
                    <MagicCard
                      cardData={card}
                      key={card._id}
                      rightClickFunction={(event) => {
                        event.preventDefault();
                        setRightClickedCard({
                          _id: card._id,
                          anchorElement: event.currentTarget,
                          controller: card.controller._id,
                          origin: 'exile',
                          owner: card.owner._id,
                          visibility: card.visibility
                        });
                      }}
                      style={notInPlay}
                    />
                  );
                })}
              </div>
            }
          </div>
          
          <div style={{ display: 'flex' }}>
            <MUITooltip title={topPlayer.account.name}>
              <div style={{ margin: 'auto 16px', transform: 'rotate(180deg)' }}>
                <MUIBadge
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  badgeContent={<React.Fragment>
                    <EnergySymbol className={classes.badgeIcon} /> : {topPlayer.energy > 99 ? '99+' : topPlayer.energy}
                  </React.Fragment>}
                  className={classes.energyBadge}
                  overlap='circle'
                  showZero
                >
                  <MUIBadge
                    anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                    badgeContent={<React.Fragment>
                      <MUIFavoriteIcon className={classes.badgeIcon} /> : {topPlayer.life > 99 ? '99+' : topPlayer.life}
                    </React.Fragment>}
                    className={classes.lifeBadge}
                    overlap='circle'
                    showZero
                  >
                    <MUIBadge
                      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      badgeContent={<React.Fragment>
                        <PoisonSymbol className={classes.badgeIcon} /> : {topPlayer.poison > 10 ? '10+' : topPlayer.poison}
                      </React.Fragment>}
                      className={classes.poisonBadge}
                      overlap='circle'
                      showZero
                    >
                      <MUIBadge
                        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                        badgeContent={<React.Fragment>
                          <LibrarySymbol className={classes.badgeIcon} /> : {topPlayer.library.length > 99 ? '99+' : topPlayer.library.length}
                        </React.Fragment>}
                        className={classes.libraryBadge}
                        overlap='circle'
                        showZero
                      >
                        <LargeAvatar
                          alt={topPlayer.account.name}
                          onClick={(event) => setClickedPlayer({
                            _id: topPlayer.account._id,
                            anchorElement: event.currentTarget,
                            position: 'top'
                          })}
                          src={topPlayer.account.avatar}
                        />
                      </MUIBadge>
                    </MUIBadge>
                  </MUIBadge>
                </MUIBadge>
              </div>
            </MUITooltip>
            <div className={classes.handContainer}>
              {topPlayer.hand.map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'hand',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    style={notInPlay}
                  />
                );
              })}
            </div>
          </div>
        </div>
      }

      <div className={classes.columnFlex}>
        <div className={classes.rowFlex}>
          {displayedZones.bottomLibrary &&
            <div className={classes.collapsableZoneContainer}>
              {bottomPlayer.library.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'library',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    style={notInPlay}
                  />
                );
              })}
            </div>
          }
          <div className={classes.battlefieldContainer} id="bottom-player-battlefield" ref={battlefieldRef}>
            {battlefieldRef.current && bottomPlayer.battlefield.map(card => {
              return (
                <Draggable
                  bounds="#bottom-player-battlefield"
                  handle={`#drag-${card._id}`}
                  key={`drag-${card._id}`}
                  onStart={(event, data) => {
                    event.target.style.zIndex = topZIndex;
                  }}
                  onStop={(event, data) => {
                    
                    const oldXPosition = parseFloat(card.x_coordinate) * battlefieldRef.current.offsetWidth / 100;
                    const oldYPosition = parseFloat(card.y_coordinate) * battlefieldRef.current.offsetHeight / 100;
                    
                    if (Math.abs(oldXPosition - data.x) < 2 && Math.abs(oldYPosition - data.y) < 2) {
                      handleTapUntapCards([card._id]);
                    } else {
                      handleDragCard(
                        data.node.id.replace("drag-", ""),
                        data.x * 100 / battlefieldRef.current.offsetWidth,
                        data.y * 100 / battlefieldRef.current.offsetHeight,
                        topZIndex);
                    }

                  }}
                  defaultPosition={{
                    x: parseFloat(card.x_coordinate) * battlefieldRef.current.offsetWidth / 100,
                    y: parseFloat(card.y_coordinate) * battlefieldRef.current.offsetHeight / 100
                  }}
                >
                  <MagicCard
                    cardData={card}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'battlefield',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    customStyle={{
                      // magic card dimentions are 63mm x 88mm
                      cursor: 'move',
                      height: cardSize / 63,
                      position: 'absolute',
                      width: cardSize / 88,
                      zIndex: card.z_index
                    }}
                  />
                </Draggable>
              );
            })}
          </div>
          {displayedZones.bottomGraveyard &&
            <div className={classes.collapsableZoneContainer}>
              {bottomPlayer.graveyard.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'graveyard',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    style={notInPlay}
                  />
                );
              })}
            </div>
          }
          {displayedZones.bottomExile &&
            <div className={classes.collapsableZoneContainer}>
              {bottomPlayer.exile.map((val, index, array) => array[array.length - 1 - index]).map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        origin: 'exile',
                        owner: card.owner._id,
                        visibility: card.visibility
                      });
                    }}
                    style={notInPlay}
                  />
                );
              })}
            </div>
          }
        </div>
        
        <div style={{ display: 'flex' }}>
          <MUITooltip title={bottomPlayer.account.name}>
            <div style={{ margin: 'auto 16px' }}>
              <MUIBadge
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                badgeContent={<React.Fragment>
                  <EnergySymbol className={classes.badgeIcon} /> : {bottomPlayer.energy > 99 ? '99+' : bottomPlayer.energy}
                </React.Fragment>}
                className={classes.energyBadge}
                overlap='circle'
                showZero
              >
                <MUIBadge
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  badgeContent={<React.Fragment>
                    <MUIFavoriteIcon className={classes.badgeIcon} /> : {bottomPlayer.life > 99 ? '99+' : bottomPlayer.life}
                  </React.Fragment>}
                  className={classes.lifeBadge}
                  overlap='circle'
                  showZero
                >
                  <MUIBadge
                    anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                    badgeContent={<React.Fragment>
                      <PoisonSymbol className={classes.badgeIcon} /> : {bottomPlayer.poison > 10 ? '10+' : bottomPlayer.poison}
                    </React.Fragment>}
                    className={classes.poisonBadge}
                    overlap='circle'
                    showZero
                  >
                    <MUIBadge
                      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                      badgeContent={<React.Fragment>
                        <LibrarySymbol className={classes.badgeIcon} /> : {bottomPlayer.library.length > 99 ? '99+' : bottomPlayer.library.length}
                      </React.Fragment>}
                      className={classes.libraryBadge}
                      overlap='circle'
                      showZero
                    >
                      <LargeAvatar
                        alt={bottomPlayer.account.name}
                        onClick={(event) => setClickedPlayer({
                          _id: bottomPlayer.account._id,
                          anchorElement: event.currentTarget,
                          position: 'bottom'
                        })}
                        src={bottomPlayer.account.avatar}
                      />
                    </MUIBadge>
                  </MUIBadge>
                </MUIBadge>
              </MUIBadge>
            </div>
          </MUITooltip>
          <div className={classes.handContainer}>
            {bottomPlayer.hand.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setRightClickedCard({
                      _id: card._id,
                      anchorElement: event.currentTarget,
                      controller: card.controller._id,
                      origin: 'hand',
                      owner: card.owner._id,
                      visibility: card.visibility
                    });
                  }}
                  style={notInPlay}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};