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
  playZoneContainer: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0
  },
  poisonBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: green[500],
      color: 'white'
    }
  }
});

export default function PlayerInfo ({
  bottomPlayer,
  cardSize,
  displayedZones,
  handleDragCard,
  handleTapUntapCards,
  setClickedPlayer,
  setDraggingCardID,
  setRightClickedCard,
  topPlayer
}) {

  const battlefieldRef = React.useRef();
  const classes = useStyles();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      {topPlayer &&
        <div className={classes.playZoneContainer}  style={{ transform: 'rotate(180deg)'}}>
          <div style={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
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
            }
            <div
              style={{ borderRadius: 4,
                border: '1px solid black',
                flexGrow: 1,
                overflow: 'hidden',
                position: 'relative'
              }}
            >
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
                      transform: card.tapped ? 'rotate(90deg)' : '',
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
                      style={{
                        flexShrink: 0,
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
            <div
              style={{
                border: '1px solid black',
                borderRadius: 4,
                display: 'flex',
                flexGrow: 1,
                overflowX: 'auto'
              }}
            >
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
          </div>
        </div>
      }

      <div className={classes.playZoneContainer}>
        <div style={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
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
          }
          <div
            id="bottom-player-battlefield"
            onDragOver={event => event.preventDefault()}
            onDrop={(event) => {
              console.log(event.nativeEvent.path)
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
            style={{ border: '1px solid black', borderRadius: 4, flexGrow: 1, /*overflow: 'hidden', */position: 'relative' }}
          >
            {bottomPlayer.battlefield.map(card => {
              return (
                /*<div
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
                >*/
                <Draggable
                  bounds="#bottom-player-battlefield"
                  handle={`#d-${card._id}`}
                  key={card._id}
                  onStart={(event) => {
                    event.persist();
                    setDraggingCardID(card._id);
                    event.target.style.opacity = 0.3;
                  }}
                  onStop={(event) => {
                    // event.persist();
                    setDraggingCardID(null);
                    event.target.style.opacity = 1;
                  }}
                >
                  <span>
                    <MagicCard
                      cardData={card}
                      clickFunction={() => handleTapUntapCards([card._id])}
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
                        // cursor: 'move',
                        height: cardSize / 63,
                        left: `${card.x_coordinate}%`,
                        position: 'absolute',
                        top: `${card.y_coordinate}%`,
                        transform: card.tapped ? 'rotate(90deg)' : '',
                        width: cardSize / 88,
                        zIndex: card.z_index
                      }}
                    />
                  </span>
                </Draggable>
                /*</div>*/
              )
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
                    style={{
                      flexShrink: 0,
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
          <div
            style={{
              border: '1px solid black',
              borderRadius: 4,
              display: 'flex',
              flexGrow: 1,
              overflowX: 'auto'
            }}
          >
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
        </div>
      </div>
    </div>
  );
}