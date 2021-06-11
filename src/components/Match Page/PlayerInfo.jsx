import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';

const useStyles = makeStyles({
  energyBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: yellow[500],
      color: 'black'
    }
  },
  lifeBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: red[500],
      color: 'white'
    }
  },
  poisonBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: green[500],
      color: 'white'
    }
  }
});

export default function PlayerInfo (props) {

  const { player } = props;
  const classes = useStyles();

  return (
    <div>
      <MUIBadge
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        badgeContent={player.energy}
        className={classes.energyBadge}
        overlap='circle'
        showZero
      >
        <MUIBadge
          anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
          badgeContent={player.life}
          className={classes.lifeBadge}
          max={250}
          overlap='circle'
          showZero
        >
          <MUIBadge
            anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
            badgeContent={player.poison}
            className={classes.poisonBadge}
            max={10}
            overlap='circle'
            showZero
          >
            <LargeAvatar alt={player.account.name} src={player.account.avatar} />
          </MUIBadge>
        </MUIBadge>
      </MUIBadge>
    </div>
  );
}