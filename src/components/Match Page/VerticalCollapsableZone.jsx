import React from 'react';
import MUIBadge from '@mui/material/Badge';
import MUISvgIcon from '@mui/material/SvgIcon';
import MUITooltip from '@mui/material/Tooltip';
import arrayMove from 'array-move';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@mui/styles';

import MagicCard from '../miscellaneous/MagicCard';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';

const useStyles = makeStyles({
  badgeContainer: {
    alignItems: 'flex-end',
    bottom: 0,
    display: 'flex',
    flexGrow: 1,
    position: 'sticky'
  },
  collapsableZoneContainer: {
    border: '1px solid black',
    borderRadius: 4,
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(50vh - 8px)',
    overflowY: 'auto',
    position: 'relative'
  },
  svg: {
    borderRadius: '100%',
    bottom: 4,
    height: 32,
    left: 4,
    padding: 4,
    position: 'absolute',
    width: 32
  },
  zoneBadge: {
    '& > .MuiBadge-badge': {
      transform: 'translate(44px, -44px)'
    }
  }
});

const SortableZone = SortableContainer(({
  customStyle,
  iconColor,
  iconElement,
  player,
  setRightClickedCard,
  zone
}) => {

  const classes = useStyles();
  const { userId } = React.useContext(AuthenticationContext);

  return (
    <div
      className={classes.collapsableZoneContainer}
      style={{ minWidth: customStyle.width + 2 }}
    >
      {player[zone.toLowerCase()].map((val, index, array) => array[array.length - 1 - index]).map((card, index) => (
        <SortableCard
          card={card}
          customStyle={customStyle}
          disabled={player.account._id !== userId}
          index={index}
          key={card._id}
          setRightClickedCard={setRightClickedCard}
          zone={zone}
        />
      ))}
      <div className={classes.badgeContainer}>
        <MUITooltip title={zone}>
          <MUIBadge
            badgeContent={player[zone.toLowerCase()].length}
            className={classes.zoneBadge}
            color='primary'
            showZero
          >
            <MUISvgIcon
              className={classes.svg}
              style={{ backgroundColor: iconColor }}
            >
              {iconElement}
            </MUISvgIcon>
          </MUIBadge>
        </MUITooltip>
      </div>
    </div>
  );
});

const SortableCard = SortableElement(({ card, customStyle, setRightClickedCard, zone }) => {

  const { userId } = React.useContext(AuthenticationContext);
  const { flipCard } = React.useContext(MatchContext);
  const style = { ...customStyle };

  if (card.controller._id === userId) style.cursor = 'grab';

  return (
    <MagicCard
      cardData={card}
      customStyle={style}
      flipHandler={card.controller._id === userId ? () => flipCard(card._id, zone.toLowerCase()) : () => null}
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
          origin: zone.toLowerCase(),
          owner: card.owner._id,
          visibility: card.visibility
        });
      }}
    />
  );
});

export default function VerticalCollapsableZone ({
  customStyle,
  iconColor,
  iconElement,
  player,
  setRightClickedCard,
  zone
}) {

  const { setBottomPlayerState } = React.useContext(MatchContext);

  function onSortEnd ({ collection, newIndex, oldIndex }) {
    // since I am populating zones in reverse order
    const oppositeIndex = player[zone.toLowerCase()].length - 1;

    if (newIndex !== oldIndex) {
      setBottomPlayerState(prevState => ({
        ...prevState,
        [zone.toLowerCase()]: arrayMove(prevState[zone.toLowerCase()], oppositeIndex - oldIndex, oppositeIndex - newIndex)
      }));
    }
  }

  return (
    <SortableZone
      axis="y"
      customStyle={customStyle}
      distance={2}
      iconColor={iconColor}
      iconElement={iconElement}
      onSortEnd={onSortEnd}
      player={player}
      setRightClickedCard={setRightClickedCard}
      zone={zone}
    />
  );
};