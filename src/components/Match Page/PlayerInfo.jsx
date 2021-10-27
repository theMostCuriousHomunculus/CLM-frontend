import React from 'react';
import Draggable from 'react-draggable';
import MUIBadge from '@mui/material/Badge';
import MUIFavoriteIcon from '@mui/icons-material/Favorite';
import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import yellow from '@mui/material/colors/yellow';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';
import { ReactComponent as EnergySymbol } from '../../svgs/energy.svg';
import { ReactComponent as PoisonSymbol } from '../../svgs/poison.svg';

const useStyles = makeStyles({
  avatarContainer: {
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

export default function PlayerInfo({ player, position, setClickedPlayer }) {
  const avatarRef = React.useRef();
  const classes = useStyles();
  const [dragging, setDragging] = React.useState(false);
  const { userId } = React.useContext(AuthenticationContext);
  const {
    adjustEnergyCounters,
    adjustLifeTotal,
    adjustPoisonCounters,
    setNumberInputDialogInfo
  } = React.useContext(MatchContext);

  React.useEffect(() => {
    function energyBadgeClickListner() {
      setClickedPlayer({
        _id: null,
        anchorElement: null,
        position: null
      });
      setNumberInputDialogInfo({
        buttonText: 'Update',
        defaultValue: player.energy,
        inputLabel: 'Energy',
        title: 'Update Your Energy Counters',
        updateFunction: (updatedValue) => adjustEnergyCounters(updatedValue)
      });
    }

    function lifeBadgeClickListner() {
      setClickedPlayer({
        _id: null,
        anchorElement: null,
        position: null
      });
      setNumberInputDialogInfo({
        buttonText: 'Update',
        defaultValue: player.life,
        inputLabel: 'Life',
        title: 'Update Your Life Total',
        updateFunction: (updatedValue) => adjustLifeTotal(updatedValue)
      });
    }

    function poisonBadgeClickListner() {
      setClickedPlayer({
        _id: null,
        anchorElement: null,
        position: null
      });
      setNumberInputDialogInfo({
        buttonText: 'Update',
        defaultValue: player.poison,
        inputLabel: 'Poison',
        title: 'Update Your Poison Counters',
        updateFunction: (updatedValue) => adjustPoisonCounters(updatedValue)
      });
    }

    if (avatarRef.current && userId === player.account._id) {
      const energyBadge = avatarRef.current.getElementsByClassName(
        'MuiBadge-anchorOriginBottomRightCircle'
      )[0];
      const lifeBadge = avatarRef.current.getElementsByClassName(
        'MuiBadge-anchorOriginTopRightCircle'
      )[0];
      const poisonBadge = avatarRef.current.getElementsByClassName(
        'MuiBadge-anchorOriginTopLeftCircle'
      )[0];

      energyBadge.addEventListener('click', energyBadgeClickListner);
      lifeBadge.addEventListener('click', lifeBadgeClickListner);
      poisonBadge.addEventListener('click', poisonBadgeClickListner);

      return () => {
        energyBadge.removeEventListener('click', energyBadgeClickListner);
        lifeBadge.removeEventListener('click', lifeBadgeClickListner);
        poisonBadge.removeEventListener('click', poisonBadgeClickListner);
      };
    }
  }, [
    adjustEnergyCounters,
    adjustLifeTotal,
    adjustPoisonCounters,
    avatarRef,
    player.account._id,
    player.energy,
    player.life,
    player.poison,
    setClickedPlayer,
    setNumberInputDialogInfo,
    userId
  ]);

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
      <span className={classes.avatarContainer} ref={avatarRef}>
        <MUIBadge
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          badgeContent={
            <React.Fragment>
              <EnergySymbol className={classes.badgeIcon} /> :{' '}
              {player.energy > 99 ? '99+' : player.energy}
            </React.Fragment>
          }
          className={classes.energyBadge}
          overlap="circular"
          showZero
        >
          <MUIBadge
            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
            badgeContent={
              <React.Fragment>
                <MUIFavoriteIcon className={classes.badgeIcon} /> :{' '}
                {player.life > 99 ? '99+' : player.life}
              </React.Fragment>
            }
            className={classes.lifeBadge}
            overlap="circular"
            showZero
          >
            <MUIBadge
              anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
              badgeContent={
                <React.Fragment>
                  <PoisonSymbol className={classes.badgeIcon} /> :{' '}
                  {player.poison > 10 ? '10+' : player.poison}
                </React.Fragment>
              }
              className={classes.poisonBadge}
              overlap="circular"
              showZero
            >
              <Avatar
                alt={player.account.name}
                id={`${position}-avatar`}
                size="large"
                src={player.account.avatar}
                style={{ cursor: 'move' }}
              />
            </MUIBadge>
          </MUIBadge>
        </MUIBadge>
      </span>
    </Draggable>
  );
}
