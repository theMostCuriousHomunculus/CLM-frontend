import React from 'react';
import MUIClearIcon from '@material-ui/icons/Clear';
import blue from '@material-ui/core/colors/blue';
import orange from '@material-ui/core/colors/orange';
import { makeStyles } from '@material-ui/core/styles';
import {
  // AutoScrollActivator,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
// import {
  // restrictToFirstScrollableAncestor,
  // restrictToHorizontalAxis,
  // restrictToParentElement,
  // restrictToVerticalAxis,
  // restrictToWindowEdges,
//   snapCenterToCursor
// } from '@dnd-kit/modifiers';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import {
  // getEventCoordinates,
  isTouchEvent,
  isMouseEvent,
} from '@dnd-kit/utilities';

import MagicCard from '../miscellaneous/MagicCard';
// import PlayerInfo from './PlayerInfo';
import { Battlefield, HorizontalZone, VerticalZone } from './DnDKitZones';
import { MatchContext } from '../../contexts/match-context';
import { ReactComponent as GraveyardSymbol } from '../../svgs/graveyard.svg';
import { ReactComponent as LibrarySymbol } from '../../svgs/deck.svg';
import { ReactComponent as HandSymbol } from '../../svgs/jmp.svg';

const matchCard = {
  borderRadius: 4,
  // flexShrink: 0,
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
  // participant,
  // setClickedPlayer,
  setRightClickedCard
}) {

  const classes = useStyles();
  const {
    bottomPlayerState,
    // topPlayerState,
    setBottomPlayerState,
    // dragCard,
    // flipCard,
    // tapUntapCards
  } = React.useContext(MatchContext);
  // const battlefieldRef = React.useRef();
  // const topZIndex = Math.max(...bottomPlayerState.battlefield.map(crd => crd.z_index)) + 1;
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const bottomZoneRef = React.useRef();
  const [clonedState, setClonedState] = React.useState();
  const [draggingCard, setDraggingCard] = React.useState();

  function findZoneName(id) {
    if (id in bottomPlayerState) {
      return id;
    }

    return Object.keys(bottomPlayerState).find(key => {
      return Array.isArray(bottomPlayerState[key]) && bottomPlayerState[key].map(card => card._id).includes(id);
    });
  }

  function handleDragCancel() {
    setBottomPlayerState({ ...clonedState });
    setClonedState(null);
    setDraggingCard(null);
  }

  function handleDragStart(event) {
    const { active: { id } } = event;
    setClonedState({ ...bottomPlayerState });
    setDraggingCard(bottomPlayerState[findZoneName(id)].find(card => card._id === id));
  }

  function handleDragOver(event) {
    const { active, over } = event;
    const { id: activeID, rect: activeRect } = active;

    if (over) {
      var { id: overID, rect: overRect } = over;
    } else {
      return;
    }

    const activeZoneName = findZoneName(activeID);
    const overZoneName = findZoneName(overID);

    if (!activeZoneName || !overZoneName) return;

    if (activeZoneName !== overZoneName) {

      if (overZoneName === 'battlefield') {
        setBottomPlayerState(prevState => {
          const activeCards = prevState[activeZoneName];
          const activeIndex = activeCards.findIndex(card => card._id === activeID);

          return ({
          ...prevState,
          [activeZoneName]: [
            ...prevState[activeZoneName].filter(card => card._id !== activeID)
          ],
          battlefield: prevState.battlefield.concat(prevState[activeZoneName][activeIndex])
          });
        });
      } else {
        setBottomPlayerState(prevState => {
          const activeCards = prevState[activeZoneName];
          const overCards = prevState[overZoneName];
          const activeIndex = activeCards.findIndex(card => card._id === activeID);
          const overIndex = overCards.findIndex(card => card._id === overID);
  
          let newIndex;
          if (overID in prevState) {
            // We're at the root droppable of a container
            newIndex = overCards.length + 1;
          } else {
            const isBelowLastItem =
              over &&
              overIndex === overCards.length - 1 &&
              activeRect.current.translated &&
              activeRect.current.translated.offsetTop > overRect.offsetTop + overRect.height;
  
            const modifier = isBelowLastItem ? 1 : 0;
  
            newIndex = overIndex >= 0 ? overIndex + modifier : overCards.length + 1;
          }
  
          return {
            ...prevState,
            [activeZoneName]: [
              ...prevState[activeZoneName].filter(card => card._id !== activeID)
            ],
            [overZoneName]: [
              ...prevState[overZoneName].slice(0, newIndex),
              prevState[activeZoneName][activeIndex],
              ...prevState[overZoneName].slice(newIndex, prevState[overZoneName].length)
            ]
          };
        });
      }
      
    }
  }

  function handleDragEnd(event) {
    const { active: { id: activeID, data }, delta, over: { id: overID, rect: overRect } } = event;
    const activeZoneName = findZoneName(activeID);

    if (!activeZoneName) {
      setDraggingCard(null);
      return;
    }

    const overZoneName = findZoneName(overID);

    if (overZoneName === 'battlefield') {
      setBottomPlayerState(prevState => {
        const activeIndex = prevState.battlefield.findIndex(card => card._id === activeID);
        return ({
          ...prevState,
          battlefield: prevState.battlefield.slice(0, activeIndex).concat({
              ...prevState.battlefield[activeIndex],
              x_coordinate:
                data.current.initialCoordinates.x +
                (delta.x * 100 / data.current.boundingDimensions.width),
              y_coordinate:
                data.current.initialCoordinates.y +
                (delta.y * 100 / data.current.boundingDimensions.height),
            }).concat(prevState.battlefield.slice(activeIndex + 1))
        });
      });
    } else if (!!overZoneName) {
      const activeIndex = bottomPlayerState[activeZoneName].findIndex(card => card._id === activeID);
      const overIndex = bottomPlayerState[overZoneName].findIndex(card => card._id === overID);
  
      if (activeIndex !== overIndex) {
        setBottomPlayerState(prevState => ({
          ...prevState,
          [overZoneName]: arrayMove(prevState[overZoneName], activeIndex, overIndex)
        }));
      }
    }

    setDraggingCard(null);
  }

  // https://github.com/clauderic/dnd-kit/blob/master/packages/modifiers/src/utilities/restrictToBoundingRect.ts
  function restrictToBoundingRect (transform, rect, boundingRect) {
    const value = { ...transform };
  
    if (rect.top + transform.y <= boundingRect.top) {
      value.y = boundingRect.top - rect.top;
    } else if (
      rect.bottom + transform.y >=
      boundingRect.top + boundingRect.height
    ) {
      value.y = boundingRect.top + boundingRect.height - rect.bottom;
    }
  
    if (rect.left + transform.x <= boundingRect.left) {
      value.x = boundingRect.left - rect.left;
    } else if (
      rect.right + transform.x >=
      boundingRect.left + boundingRect.width
    ) {
      value.x = boundingRect.left + boundingRect.width - rect.right;
    }
  
    return value;
  }

  function restrictToBottomZone (args) {
    const { activeNodeRect, transform } = args;

    if (!activeNodeRect) return transform;

    const bottomZoneDimensions = bottomZoneRef.current.getBoundingClientRect();

    return restrictToBoundingRect(transform, activeNodeRect, {
      bottom: bottomZoneDimensions.bottom,
      height: bottomZoneDimensions.height + bottomZoneRef.current.offsetTop - bottomZoneDimensions.y,
      left: bottomZoneDimensions.left,
      // offsetLeft: bottomZoneRef.current.offsetLeft,
      // offsetTop: bottomZoneRef.current.offsetTop,
      right: bottomZoneDimensions.right,
      top: bottomZoneDimensions.top - bottomZoneRef.current.offsetTop + bottomZoneDimensions.y,
      width: bottomZoneDimensions.width
    });
  }

  function accountForPageScroll (args) {
    const { activatorEvent, transform } = args;

    if (
      activatorEvent &&
      (isTouchEvent(activatorEvent) || isMouseEvent(activatorEvent))
    ) {
  
      return {
        ...transform,
        x: transform.x,
        y: transform.y
          + bottomZoneRef.current.getBoundingClientRect().top
          - bottomZoneRef.current.offsetTop
      };
    }

    return transform;
  }

  return (
    <div className={classes.playZoneContainer}>
      {/*topPlayerState &&
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div id="top-player" className={classes.columnFlex}>
            {displayedZones.topLibrary &&
              <VerticalCollapsableZone
                customStyle={matchCard}
                iconColor={blue[500]}
                iconElement={<LibrarySymbol />}
                id={`${topPlayerState.account._id}-library`}
                items={containers[`${topPlayerState.account._id}-library`]}
                // player={topPlayerState}
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
                id={`${topPlayerState.account._id}-graveyard`}
                items={containers[`${topPlayerState.account._id}-graveyard`]}
                // player={topPlayerState}
                setRightClickedCard={setRightClickedCard}
                zone="Graveyard"
              />
            }

            {displayedZones.topExile &&
              <VerticalCollapsableZone
                customStyle={matchCard}
                iconColor={orange[500]}
                iconElement={<MUIClearIcon htmlColor="white" />}
                id={`${topPlayerState.account._id}-exile`}
                items={containers[`${topPlayerState.account._id}-exile`]}
                // player={topPlayerState}
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
        </DndContext>}
      */}

      {/*<div className={classes.columnFlex}></div>*/}

      <div id="bottom-player" className={classes.columnFlex} ref={bottomZoneRef}>
        <DndContext
          autoScroll={{
            canScroll(element) {
              if (element === document.scrollingElement) {
                return false;
              } else {
                return true;
              }
            }
          }}
          collisionDetection={rectIntersection}
          modifiers={[accountForPageScroll, restrictToBottomZone]}
          onDragCancel={handleDragCancel}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <VerticalZone
            iconColor={blue[500]}
            iconElement={<LibrarySymbol />}
            items={bottomPlayerState.library}
            setRightClickedCard={setRightClickedCard}
            zoneName="Library"
          />
          
          <div className={classes.rowFlex}>
            {/*participant ?
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
            */}

            <Battlefield setRightClickedCard={setRightClickedCard} />

            <HorizontalZone
              iconColor="00FF00"
              iconElement={<HandSymbol />}
              items={bottomPlayerState.hand}
              setRightClickedCard={setRightClickedCard}
              zoneName="Hand"
            />
          </div>

          <VerticalZone
            iconColor="#888888"
            iconElement={<GraveyardSymbol />}
            items={bottomPlayerState.graveyard}
            setRightClickedCard={setRightClickedCard}
            zoneName="Graveyard"
          />

          <VerticalZone
            iconColor={orange[500]}
            iconElement={<MUIClearIcon htmlColor="white" />}
            items={bottomPlayerState.exile}
            setRightClickedCard={setRightClickedCard}
            zoneName="Exile"
          />

          {/*<PlayerInfo
            player={bottomPlayerState}
            position="bottom"
            setClickedPlayer={setClickedPlayer}
          />*/}
          <DragOverlay dropAnimation={null}>
            {draggingCard && <MagicCard cardData={draggingCard} customStyle={matchCard} />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};