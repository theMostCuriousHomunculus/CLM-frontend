import React from 'react';
import Draggable from 'react-draggable';
import MUIClearIcon from '@material-ui/icons/Clear';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import { makeStyles } from '@material-ui/core/styles';

import MagicCard from '../miscellaneous/MagicCard';
import PlayerInfo from './PlayerInfo';
import VerticalCollapsableZone from './VerticalCollapsableZone';
import { MatchContext } from '../../contexts/match-context';
import { ReactComponent as GraveyardSymbol } from '../../svgs/graveyard.svg';
import { ReactComponent as LibrarySymbol } from '../../svgs/deck.svg';

const useStyles = makeStyles({
  battlefieldContainer: {
    border: '1px solid black',
    borderRadius: 4,
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  columnFlex: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0,
    position: 'relative'
  },
  handContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    overflowX: 'auto'
  },
  rowFlex: {
    display: 'flex',
    flex: '1 1 0',
    minHeight: 0
  },
  playZoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
    minWidth: 0
  }
});

export default function PlayZone ({
  bottomPlayer,
  cardSize,
  displayedZones,
  participant,
  setClickedPlayer,
  setRightClickedCard,
  topPlayer
}) {

  const battlefieldRef = React.useRef();
  const classes = useStyles();
  const topZIndex = Math.max(...bottomPlayer.battlefield.map(crd => crd.z_index)) + 1;
  const { dragCard, flipCard, tapUntapCards } = React.useContext(MatchContext);
  const notInPlay = {
    flexShrink: 0,
    // magic card dimentions are 63mm x 88mm
    height: cardSize / 63,
    width: cardSize / 88
  }

  return (
    <div className={classes.playZoneContainer}>
      {topPlayer &&
        <div id="top-player" className={classes.columnFlex}>
          {displayedZones.topHand &&
            <div className={classes.handContainer}>
              {topPlayer.hand.map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    flipHandler={() => null}
                    key={card._id}
                    rightClickFunction={(event) => {
                      event.preventDefault();
                      setRightClickedCard({
                        _id: card._id,
                        anchorElement: event.currentTarget,
                        controller: card.controller._id,
                        face_down: card.face_down,
                        isCopyToken: card.isCopyToken,
                        name: card.name,
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
          }

          <div className={classes.rowFlex}>
            {displayedZones.topLibrary &&
              <VerticalCollapsableZone
                cardSize={cardSize}
                iconColor={blue[500]}
                iconElement={<LibrarySymbol />}
                player={topPlayer}
                setRightClickedCard={setRightClickedCard}
                zone="Library"
              />
            }
            <div className={classes.battlefieldContainer} style={{ transform: 'rotate(180deg)' }}>
              {topPlayer.battlefield.map(card => (
                <MagicCard
                  cardData={card}
                  flipHandler={() => null}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setRightClickedCard({
                      _id: card._id,
                      anchorElement: event.currentTarget,
                      controller: card.controller._id,
                      face_down: card.face_down,
                      isCopyToken: card.isCopyToken,
                      name: card.name,
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
              ))}
            </div>
            {displayedZones.topGraveyard &&
              <VerticalCollapsableZone
                cardSize={cardSize}
                iconColor="#888888"
                iconElement={<GraveyardSymbol />}
                player={topPlayer}
                setRightClickedCard={setRightClickedCard}
                zone="Graveyard"
              />
            }
            {displayedZones.topExile &&
              <VerticalCollapsableZone
                cardSize={cardSize}
                iconColor={orange[500]}
                iconElement={<MUIClearIcon htmlColor="white" />}
                player={topPlayer}
                setRightClickedCard={setRightClickedCard}
                zone="Exile"
              />
            }
          </div>

          <PlayerInfo
            player={topPlayer}
            position="top"
            setClickedPlayer={setClickedPlayer}
          />
        </div>
      }

      <div id="bottom-player" className={classes.columnFlex}>
        <div className={classes.rowFlex}>

          {displayedZones.bottomLibrary &&
            <VerticalCollapsableZone
              cardSize={cardSize}
              iconColor={blue[500]}
              iconElement={<LibrarySymbol />}
              player={bottomPlayer}
              setRightClickedCard={setRightClickedCard}
              zone="Library"
            />
          }

          {participant ?
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
                      
                      if (Math.abs(oldXPosition - data.x) < 2 &&
                        Math.abs(oldYPosition - data.y < 2) &&
                        // so that a click on the flip button doesn't also tap or untap the card
                        event.target.id === `drag-${card._id}`
                      ) {
                        tapUntapCards([card._id]);
                      } else {
                        dragCard(
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
                      flipHandler={() => flipCard(card._id, 'battlefield')}
                      rightClickFunction={event => {
                        event.preventDefault();
                        setRightClickedCard({
                          _id: card._id,
                          anchorElement: event.currentTarget,
                          controller: card.controller._id,
                          face_down: card.face_down,
                          isCopyToken: card.isCopyToken,
                          name: card.name,
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
            </div> :
            <div className={classes.battlefieldContainer}>
              {bottomPlayer.battlefield.map(card => (
                <MagicCard
                  cardData={card}
                  flipHandler={() => null}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setRightClickedCard({
                      _id: card._id,
                      anchorElement: event.currentTarget,
                      controller: card.controller._id,
                      face_down: card.face_down,
                      isCopyToken: card.isCopyToken,
                      name: card.name,
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
              ))}
            </div>
          }

          {displayedZones.bottomGraveyard &&
            <VerticalCollapsableZone
              cardSize={cardSize}
              iconColor="#888888"
              iconElement={<GraveyardSymbol />}
              player={bottomPlayer}
              setRightClickedCard={setRightClickedCard}
              zone="Graveyard"
            />
          }

          {displayedZones.bottomExile &&
            <VerticalCollapsableZone
              cardSize={cardSize}
              iconColor={orange[500]}
              iconElement={<MUIClearIcon htmlColor="white" />}
              player={bottomPlayer}
              setRightClickedCard={setRightClickedCard}
              zone="Exile"
            />
          }

        </div>
        
        {displayedZones.bottomHand &&
          <div className={classes.handContainer}>
            {bottomPlayer.hand.map(card => {
              return (
                <MagicCard
                  cardData={card}
                  flipHandler={participant ? () => flipCard(card._id, 'hand') : () => null}
                  key={card._id}
                  rightClickFunction={(event) => {
                    event.preventDefault();
                    setRightClickedCard({
                      _id: card._id,
                      anchorElement: event.currentTarget,
                      controller: card.controller._id,
                      face_down: card.face_down,
                      isCopyToken: card.isCopyToken,
                      name: card.name,
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
        }

        <PlayerInfo
          player={bottomPlayer}
          position="bottom"
          setClickedPlayer={setClickedPlayer}
        />
      </div>
    </div>
  );
};