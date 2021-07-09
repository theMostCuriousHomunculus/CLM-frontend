import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUISvgIcon from '@material-ui/core/SvgIcon';
import MUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

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
  customStyle,
  iconColor,
  iconElement,
  player,
  setRightClickedCard,
  zone
}) {

  const classes = useStyles();
  const { userId } = React.useContext(AuthenticationContext);
  const { flipCard } = React.useContext(MatchContext);

  return (
    <div className={classes.collapsableZoneContainer} style={{ minWidth: customStyle.width + 2 }}>
      {player[zone.toLowerCase()].map((val, index, array) => array[array.length - 1 - index]).map(card => (
        <MagicCard
          cardData={card}
          customStyle={customStyle}
          flipHandler={card.controller._id === userId ? () => flipCard(card._id, zone.toLowerCase()) : () => null}
          hoverPreview={!!card.image}
          key={card._id}
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
      ))}
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