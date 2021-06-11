import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUIFavoriteIcon from '@material-ui/icons/Favorite';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITooltip from '@material-ui/core/Tooltip';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import NumberInputDialog from '../miscellaneous/NumberInputDialog';
import { ReactComponent as EnergySymbol } from '../../images/energy.svg';
import { ReactComponent as PoisonSymbol } from '../../images/poison.svg';

const useStyles = makeStyles({
  badgeIcon: {
    height: 16,
    width: 16
  },
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

  const {
    handleAdjustEnergyCounters,
    handleAdjustLifeTotal,
    handleAdjustPoisonCounters,
    player
  } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [dialogInfo, setDialogInfo] = React.useState({
    defaultValue: null,
    inputName: null,
    updateFunction: null
  });

  return (
    <React.Fragment>
      <NumberInputDialog
        close={() => setDialogInfo({
          defaultValue: null,
          inputName: null,
          updateFunction: null
        })}
        inputName={dialogInfo.inputName}
        defaultValue={dialogInfo.defaultValue}
        updateFunction={dialogInfo.updateFunction}
      />
      <div style={{ display: 'flex', flexGrow: 1, justifyContent: 'center' }}>
        <div>
        <MUITooltip title={player.account.name}>
          <MUIBadge
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            badgeContent={<React.Fragment>
              <EnergySymbol className={classes.badgeIcon} /> : {player.energy > 99 ? '99+' : player.energy}
            </React.Fragment>}
            className={classes.energyBadge}
            overlap='circle'
            showZero
          >
            <MUIBadge
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              badgeContent={<React.Fragment>
                <MUIFavoriteIcon className={classes.badgeIcon} /> : {player.life > 99 ? '99+' : player.life}
              </React.Fragment>}
              className={classes.lifeBadge}
              overlap='circle'
              showZero
            >
              <MUIBadge
                anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                badgeContent={<React.Fragment>
                  <PoisonSymbol className={classes.badgeIcon} /> : {player.poison > 10 ? '10+' : player.poison}
                </React.Fragment>}
                className={classes.poisonBadge}
                overlap='circle'
                showZero
              >
                <LargeAvatar
                  alt={player.account.name}
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                  src={player.account.avatar}
                />
              </MUIBadge>
            </MUIBadge>
          </MUIBadge>
        </MUITooltip>

        <MUIMenu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setDialogInfo({
                inputName: "Energy",
                defaultValue: player.energy,
                updateFunction: (updatedValue) => handleAdjustEnergyCounters(updatedValue)
              });
            }}
          >
            Adjust Energy Counters
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setDialogInfo({
                inputName: "Life",
                defaultValue: player.life,
                updateFunction: (updatedValue) => handleAdjustLifeTotal(updatedValue)
              });
            }}
          >
            Adjust Life Total
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setDialogInfo({
                inputName: "Poison",
                defaultValue: player.poison,
                updateFunction: (updatedValue) => handleAdjustPoisonCounters(updatedValue)
              });
            }}
          >
            Adjust Poison Counters
          </MUIMenuItem>
        </MUIMenu>
        </div>
      </div>
    </React.Fragment>
  );
}