import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUISvgIcon from '@material-ui/core/SvgIcon';
import MUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import {
  useDraggable,
  useDroppable
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import MagicCard from '../miscellaneous/MagicCard';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';

const useStyles = makeStyles({
  battlefieldContainer: {
    border: '1px solid black',
    borderRadius: 4,
    flexGrow: 1,
    overflow: 'hidden',
    position: 'relative'
  },
  horizontalZoneBadge: {
    position: 'relative',
    '& > .MuiBadge-badge': {
      transform: 'translate(-6px, 62px)'
    }
  },
  horizontalZoneBadgeContainer: {
    left: 0,
    position: 'sticky',
    width: 0
  },
  horizontalZoneContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    // flexDirection: 'column',
    minHeight: 122,
    // overflowX: 'auto'
  },
  horizontalZoneSVG: {
    borderRadius: '100%',
    bottom: -104,
    height: 32,
    right: 16,
    padding: 6,
    position: 'absolute',
    width: 32
  },
  verticalZoneBadge: {
    position: 'relative',
    '& > .MuiBadge-badge': {
      transform: 'translate(44px, -56px)'
    }
  },
  verticalZoneBadgeContainer: {
    bottom: 0,
    height: 0,
    position: 'sticky'
  },
  verticalZoneContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 16px)',
    minWidth: 88
  },
  verticalZoneSVG: {
    borderRadius: '100%',
    bottom: 14,
    height: 32,
    left: 4,
    padding: 4,
    position: 'absolute',
    width: 32
  }
});

function SortableCard({
  card,
  setRightClickedCard,
  zoneName
}) {
  
  const { userId } = React.useContext(AuthenticationContext);
  const { flipCard } = React.useContext(MatchContext);
  const {
    attributes,
    listeners,
    isDragging,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    disabled: card.controller._id !== userId,
    id: card._id
  });
  const style = {
    cursor: card.controller._id === userId ? 'grab' : 'default',
    flexShrink: 0,
    height: 120,
    listStyleType: 'none',
    opacity: isDragging ? 0.5 : 1,
    transform: CSS.Translate.toString(transform),
    transition,
    width: 86
  };

  return (
    <li ref={setNodeRef} style={style} { ...attributes } { ...listeners }>
      <MagicCard
        cardData={card}
        flipHandler={card.controller._id === userId ? () => flipCard(card._id, zoneName.toLowerCase()) : () => null}
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
            origin: zoneName.toLowerCase(),
            owner: card.owner._id,
            visibility: card.visibility
          });
        }}
      />
    </li>
  );
}

function DraggableCard ({
  boundingDimensions,
  card,
  setRightClickedCard
}) {

  const { userId } = React.useContext(AuthenticationContext);
  const { flipCard } = React.useContext(MatchContext);
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    data: {
      boundingDimensions,
      initialCoordinates: {
        x: isNaN(card.x_coordinate) ? 0 : card.x_coordinate,
        y: isNaN(card.y_coordinate) ? 0 : card.y_coordinate
      }
    },
    disabled: card.controller._id !== userId,
    id: card._id
  });
  const style = {
    cursor: card.controller._id === userId ? 'grab' : 'default',
    height: 120,
    left: `${card.x_coordinate / 100 * boundingDimensions.width}px`,
    opacity: isDragging ? 0.3 : 1,
    position: 'absolute',
    top: `${card.y_coordinate / 100 * boundingDimensions.height}px`,
    transform: transform && !isDragging ?
      CSS.Translate.toString(transform) :
      `translate(-${window.pageXOffset}px, -${window.pageYOffset}px)`,
    width: 86
  };
  console.log(transform);

  return (
    <div ref={setNodeRef} style={style} { ...attributes } { ...listeners }>
      <MagicCard
        cardData={card}
        flipHandler={card.controller._id === userId ? () => flipCard(card._id, 'battlefield') : () => null}
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
    </div>
  );
}

export function Battlefield ({
  setRightClickedCard
}) {

  const { bottomPlayerState } = React.useContext(MatchContext);
  const classes = useStyles();
  const { setNodeRef } = useDroppable({
    id: 'battlefield',
  });
  const [boundingDimensions, setBoundingDimensions] = React.useState({ height: 0, width: 0 });

  const measuredRef = React.useCallback(node => {
    if (node !== null) {
      setBoundingDimensions({
        height: node.getBoundingClientRect().height,
        width: node.getBoundingClientRect().width
      });
    }
  }, []);

  return (
    <div className={classes.battlefieldContainer} ref={setNodeRef}>
      <div ref={measuredRef} style={{ height: '100%', position: 'relative' }}>
        {bottomPlayerState.battlefield.map(card => (
          <DraggableCard
            boundingDimensions={boundingDimensions}
            card={card}
            key={card._id}
            setRightClickedCard={setRightClickedCard}
          />
        ))}
      </div>
    </div>
  );
};

export function HorizontalZone ({
  iconColor,
  iconElement,
  items,
  setRightClickedCard,
  zoneName
}) {

  const classes = useStyles();
  const { setNodeRef } = useDroppable({ id: zoneName.toLowerCase() });

  return (
    <div className={classes.horizontalZoneContainer}>
      <SortableContext
        items={items.map(card => card._id)}
        strategy={horizontalListSortingStrategy}
      >
        <ol ref={setNodeRef} style={{ display: 'flex', flexGrow: 1, overflowX: 'auto' }}>
          {items.map(card => (
            <SortableCard
              card={card}
              key={card._id}
              setRightClickedCard={setRightClickedCard}
              zoneName={zoneName}
            />
          ))}
        </ol>
      </SortableContext>
      <div className={classes.horizontalZoneBadgeContainer}>
        <MUITooltip title={zoneName}>
          <MUIBadge badgeContent={items.length} className={classes.horizontalZoneBadge} color='primary' showZero>
            <MUISvgIcon className={classes.horizontalZoneSVG} style={{ backgroundColor: iconColor }}>
              {iconElement}
            </MUISvgIcon>
          </MUIBadge>
        </MUITooltip>
      </div>
    </div>
  );
};

export function VerticalZone ({
  iconColor,
  iconElement,
  items,
  setRightClickedCard,
  zoneName
}) {

  const classes = useStyles();
  const { setNodeRef } = useDroppable({ id: zoneName.toLowerCase() });

  return (
    <div className={classes.verticalZoneContainer}>
      <SortableContext
        items={items.map(card => card._id).map((id, index, array) => array[array.length - 1 - index])}
        strategy={verticalListSortingStrategy}
      >
        <ol ref={setNodeRef} style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflowY: 'auto' }}>
          {items.map((card, index, array) => array[array.length - 1 - index]).map(card => (
            <SortableCard
              card={card}
              key={card._id}
              setRightClickedCard={setRightClickedCard}
              zoneName={zoneName}
            />
          ))}
        </ol>
      </SortableContext>
      <div className={classes.verticalZoneBadgeContainer}>
        <MUITooltip title={zoneName}>
          <MUIBadge badgeContent={items.length} className={classes.verticalZoneBadge} color='primary' showZero>
            <MUISvgIcon className={classes.verticalZoneSVG} style={{ backgroundColor: iconColor }}>
              {iconElement}
            </MUISvgIcon>
          </MUIBadge>
        </MUITooltip>
      </div>
    </div>
  );
};