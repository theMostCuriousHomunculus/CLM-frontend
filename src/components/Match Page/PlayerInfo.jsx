import React from 'react';
import Draggable from 'react-draggable';
import MUIBadge from '@material-ui/core/Badge';
import MUIFavoriteIcon from '@material-ui/icons/Favorite';
import MUITooltip from '@material-ui/core/Tooltip';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import { ReactComponent as EnergySymbol } from '../../svgs/energy.svg';
import { ReactComponent as PoisonSymbol } from '../../svgs/poison.svg';

const useStyles = makeStyles({
  avatarContainer: {
    cursor: 'move',
    position: 'absolute',
    zIndex: 2147483646
  },
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

export default function PlayerInfo ({
  player,
  position,
  setClickedPlayer
}) {

  const avatarRef = React.useRef();
  const classes = useStyles();
  const [dragging, setDragging] = React.useState(false);

  return (
    <Draggable
      bounds={`#${position}-player`}
      defaultPosition={{
        x: 16,
        y: 16
      }}
      handle={`#${position}-avatar`}
      onDrag={(event, data) => {
        setDragging(true);
      }}
      onStop={(event, data) => {

        if (!dragging) {
          setClickedPlayer({
            _id: player.account._id,
            anchorElement: avatarRef.current,
            position: position
          });
        }

        setDragging(false);
      }}
    >
      <span className={classes.avatarContainer} id={`${position}-avatar`} ref={avatarRef}>
        <MUITooltip title={player.account.name} PopperProps={{ style: { zIndex: 2147483647 } }}>
          <span>
            <MUIBadge
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              badgeContent={
                <React.Fragment>
                  <EnergySymbol className={classes.badgeIcon} /> : {player.energy > 99 ? '99+' : player.energy}
                </React.Fragment>
              }
              className={classes.energyBadge}
              overlap='circle'
              showZero
            >
              <MUIBadge
                anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                badgeContent={
                  <React.Fragment>
                    <MUIFavoriteIcon className={classes.badgeIcon} /> : {player.life > 99 ? '99+' : player.life}
                  </React.Fragment>
                }
                className={classes.lifeBadge}
                overlap='circle'
                showZero
              >
                <MUIBadge
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  badgeContent={
                    <React.Fragment>
                      <PoisonSymbol className={classes.badgeIcon} /> : {player.poison > 10 ? '10+' : player.poison}
                    </React.Fragment>
                  }
                  className={classes.poisonBadge}
                  overlap='circle'
                  showZero
                >
                  <LargeAvatar
                    alt={player.account.name}
                    src={player.account.avatar}
                  />
                </MUIBadge>
              </MUIBadge>
            </MUIBadge>
          </span>
        </MUITooltip>
      </span>
    </Draggable>
  );
};