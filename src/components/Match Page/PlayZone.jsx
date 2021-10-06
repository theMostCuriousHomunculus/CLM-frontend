import React from 'react';
import Draggable from 'react-draggable';
import MUIClearIcon from '@mui/icons-material/Clear';
import blue from '@mui/material/colors/blue';
import orange from '@mui/material/colors/orange';
import { makeStyles } from '@mui/styles';

import MagicCard from '../miscellaneous/MagicCard';
import PlayerInfo from './PlayerInfo';
import VerticalCollapsableZone from './VerticalCollapsableZone';
import { MatchContext } from '../../contexts/match-context';
import { ReactComponent as GraveyardSymbol } from '../../svgs/graveyard.svg';
import { ReactComponent as LibrarySymbol } from '../../svgs/deck.svg';

const matchCard = {
  borderRadius: 4,
  flexShrink: 0,
  height: 120,
  width: 86
};

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
    minHeight: 0,
    position: 'relative'
  },
  handContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    minHeight: matchCard.height + 2,
    overflowX: 'auto'
  },
  rowFlex: {
    display: 'flex',
    flex: '1 1 0',
    flexDirection: 'column',
    minWidth: 0
  },
  playZoneContainer: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 0',
    minWidth: 0
  }
});

export default function PlayZone ({
  displayedZones,
  participant,
  setClickedPlayer,
  setRightClickedCard
}) {

  const { bottomPlayerState, topPlayerState, dragCard, flipCard, tapUntapCards } = React.useContext(MatchContext);
  const battlefieldRef = React.useRef();
  const classes = useStyles();
  const topZIndex = Math.max(...bottomPlayerState.battlefield.map(crd => crd.z_index)) + 1;

  return (
    <div className={classes.playZoneContainer}>
      {topPlayerState &&
        <div id="top-player" className={classes.columnFlex}>
          {displayedZones.topLibrary &&
            <VerticalCollapsableZone
              customStyle={matchCard}
              iconColor={blue[500]}
              iconElement={<LibrarySymbol />}
              player={topPlayerState}
              setRightClickedCard={setRightClickedCard}
              zone="Library"
            />
          }

          <div className={classes.rowFlex}>
            {displayedZones.topHand &&
              <div className={classes.handContainer}>
                {topPlayerState.hand.map(card => {
                  return (
                    <MagicCard
                      cardData={card}
                      customStyle={matchCard}
                      flipHandler={() => null}
                      hoverPreview={!!card.image}
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
                    />
                  );
                })}
              </div>
            }
            <div className={classes.battlefieldContainer} style={{ transform: 'rotate(180deg)' }}>
              {topPlayerState.battlefield.map(card => (
                <MagicCard
                  cardData={card}
                  customStyle={{
                    ...matchCard,
                    left: `${card.x_coordinate}%`,
                    position: 'absolute',
                    top: `${card.y_coordinate}%`,
                    zIndex: card.z_index
                  }}
                  flipHandler={() => null}
                  hoverPreview={!!card.image}
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
                />
              ))}
            </div>
          </div>

          {displayedZones.topGraveyard &&
            <VerticalCollapsableZone
              customStyle={matchCard}
              iconColor="#888888"
              iconElement={<GraveyardSymbol />}
              player={topPlayerState}
              setRightClickedCard={setRightClickedCard}
              zone="Graveyard"
            />
          }

          {displayedZones.topExile &&
            <VerticalCollapsableZone
              customStyle={matchCard}
              iconColor={orange[500]}
              iconElement={<MUIClearIcon htmlColor="white" />}
              player={topPlayerState}
              setRightClickedCard={setRightClickedCard}
              zone="Exile"
            />
          }

          <PlayerInfo
            player={topPlayerState}
            position="top"
            setClickedPlayer={setClickedPlayer}
          />
        </div>
      }

      <div id="bottom-player" className={classes.columnFlex}>
        {displayedZones.bottomLibrary &&
          <VerticalCollapsableZone
            customStyle={matchCard}
            iconColor={blue[500]}
            iconElement={<LibrarySymbol />}
            player={bottomPlayerState}
            setRightClickedCard={setRightClickedCard}
            zone="Library"
          />
        }
        <div className={classes.rowFlex}>
          {participant ?
            <div className={classes.battlefieldContainer} id="bottom-player-battlefield" ref={battlefieldRef}>
              {battlefieldRef.current && bottomPlayerState.battlefield.map(card => (
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
                      event.target.id.includes(card._id)
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
                    customStyle={{
                      ...matchCard,
                      cursor: 'move',
                      position: 'absolute',
                      zIndex: card.z_index
                    }}
                    flipHandler={() => flipCard(card._id, 'battlefield')}
                    hoverPreview={!!card.image}
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
                  />
                </Draggable>
              ))}
            </div> :
            <div className={classes.battlefieldContainer}>
              {bottomPlayerState.battlefield.map(card => (
                <MagicCard
                  cardData={card}
                  customStyle={{
                    ...matchCard,
                    left: `${card.x_coordinate}%`,
                    position: 'absolute',
                    top: `${card.y_coordinate}%`,
                    zIndex: card.z_index
                  }}
                  flipHandler={() => null}
                  hoverPreview={!!card.image}
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
                />
              ))}
            </div>
          }

          {displayedZones.bottomHand &&
            <div className={classes.handContainer}>
              {bottomPlayerState.hand.map(card => {
                return (
                  <MagicCard
                    cardData={card}
                    customStyle={matchCard}
                    flipHandler={participant ? () => flipCard(card._id, 'hand') : () => null}
                    hoverPreview={!!card.image}
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
                  />
                );
              })}
            </div>
          }
        </div>

        {displayedZones.bottomGraveyard &&
          <VerticalCollapsableZone
            customStyle={matchCard}
            iconColor="#888888"
            iconElement={<GraveyardSymbol />}
            player={bottomPlayerState}
            setRightClickedCard={setRightClickedCard}
            zone="Graveyard"
          />
        }

        {displayedZones.bottomExile &&
          <VerticalCollapsableZone
            customStyle={matchCard}
            iconColor={orange[500]}
            iconElement={<MUIClearIcon htmlColor="white" />}
            player={bottomPlayerState}
            setRightClickedCard={setRightClickedCard}
            zone="Exile"
          />
        }

        <PlayerInfo
          player={bottomPlayerState}
          position="bottom"
          setClickedPlayer={setClickedPlayer}
        />
      </div>
    </div>
  );
};