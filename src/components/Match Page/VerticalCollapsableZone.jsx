import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUISvgIcon from '@material-ui/core/SvgIcon';
import MUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

import MagicCard from '../miscellaneous/MagicCard';

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

export default function VerticalCollapsableZone ({
  cardSize,
  customStyle,
  iconColor,
  iconElement,
  player,
  setRightClickedCard,
  zone
}) {

  const classes = useStyles();

  return (
    <div className={classes.collapsableZoneContainer} style={{ ...customStyle, minWidth: cardSize / 88 }}>
      {player[zone.toLowerCase()].map((val, index, array) => array[array.length - 1 - index]).map(card => {
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
                origin: zone.toLowerCase(),
                owner: card.owner._id,
                visibility: card.visibility
              });
            }}
            customStyle={{
              flexShrink: 0,
              // magic card dimentions are 63mm x 88mm
              height: cardSize / 63,
              width: cardSize / 88
            }}
          />
        );
      })}
      <div className={classes.badgeContainer}>
        <MUITooltip title={zone}>
          <MUIBadge badgeContent={player[zone.toLowerCase()].length} className={classes.zoneBadge} color='primary' showZero>
            <MUISvgIcon className={classes.svg} style={{ backgroundColor: iconColor }}>
              {iconElement}
            </MUISvgIcon>
          </MUIBadge>
        </MUITooltip>
      </div>
    </div>
  );
};