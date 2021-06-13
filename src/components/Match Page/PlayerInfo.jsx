import React from 'react';
import MUIBadge from '@material-ui/core/Badge';
import MUIFavoriteIcon from '@material-ui/icons/Favorite';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITooltip from '@material-ui/core/Tooltip';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import yellow from '@material-ui/core/colors/yellow';
import { makeStyles } from '@material-ui/core/styles';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import NumberInputDialog from '../miscellaneous/NumberInputDialog';
import ZoneInspectionDialog from './ZoneInspectionDialog';
import { ReactComponent as EnergySymbol } from '../../images/energy.svg';
import { ReactComponent as LibrarySymbol } from '../../images/deck.svg';
import { ReactComponent as PoisonSymbol } from '../../images/poison.svg';

const useStyles = makeStyles({
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
  libraryBadge: {
    '& > .MuiBadge-badge': {
      backgroundColor: blue[500],
      color: 'white'
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

export default function PlayerInfo (props) {

  const {
    handleAdjustEnergyCounters,
    handleAdjustLifeTotal,
    handleAdjustPoisonCounters,
    player
  } = props;
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [numberInputDialogInfo, setNumberInputDialogInfo] = React.useState({
    defaultValue: null,
    inputName: null,
    updateFunction: null
  });
  const [zoneName, setZoneName] = React.useState(null);

  return (
    <React.Fragment>
      <NumberInputDialog
        close={() => setNumberInputDialogInfo({
          defaultValue: null,
          inputName: null,
          updateFunction: null
        })}
        inputName={numberInputDialogInfo.inputName}
        defaultValue={numberInputDialogInfo.defaultValue}
        updateFunction={numberInputDialogInfo.updateFunction}
      />

      <ZoneInspectionDialog
        close={() => setZoneName(null)}
        player={player}
        zoneName={zoneName}
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <MUITooltip title={player.account.name}>
          <div>
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
                  <MUIBadge
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    badgeContent={<React.Fragment>
                      <LibrarySymbol className={classes.badgeIcon} /> : {player.library.length > 99 ? '99+' : player.library.length}
                    </React.Fragment>}
                    className={classes.libraryBadge}
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
            </MUIBadge>
          </div>
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
              setNumberInputDialogInfo({
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
              setNumberInputDialogInfo({
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
              setNumberInputDialogInfo({
                inputName: "Poison",
                defaultValue: player.poison,
                updateFunction: (updatedValue) => handleAdjustPoisonCounters(updatedValue)
              });
            }}
          >
            Adjust Poison Counters
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setZoneName('exile');
            }}
          >
            Inspect Exile Zone
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setZoneName('graveyard');
            }}
          >
            Inspect Graveyard
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setZoneName('hand');
            }}
          >
            Inspect Hand
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setZoneName('library');
            }}
          >
            Inspect Library
          </MUIMenuItem>
          <MUIMenuItem
            onClick={() => {
              setAnchorEl(null);
              setZoneName('sideboard');
            }}
          >
            Inspect Sideboard
          </MUIMenuItem>
        </MUIMenu>
      </div>
    </React.Fragment>
  );
}