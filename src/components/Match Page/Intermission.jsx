import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITooltip from '@material-ui/core/Tooltip';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../../functions/custom-sort';
import theme from '../../theme';
import MagicCard from '../miscellaneous/MagicCard';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';
import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100vh - 16px)',
    width: '50%'
  },
  cardContent: {
    display: 'flex',
    flexWrap: 'wrap',
    overflowY: 'auto'
  },
  iconButton: {
    background: theme.palette.primary.main,
    color: '#ffffff',
    height: 30,
    left: 15,
    position: 'absolute',
    top: 30,
    width: 30,
    '&:hover': {
      background: theme.palette.primary.dark
    }
  }
})

export default function Intermission () {

  const classes = useStyles();
  const [confirmationDialogVisible, setConfirmationDialogVisible] = React.useState(false);
  const { userId } = React.useContext(AuthenticationContext);
  const { matchState, ready, transferCard } = React.useContext(MatchContext);

  const player = matchState.players.find(plr => plr.account._id === userId);

  return (
    player ?
      <React.Fragment>
        <ConfirmationDialog
          confirmHandler={ready}
          open={confirmationDialogVisible}
          title="Are you readier than Spongebob with a belly full of Krabby Patties?"
          toggleOpen={() => setConfirmationDialogVisible(prevState => !prevState)}
        >
          <MUITypography variant="body1">
            Think of how embarrassing it will be if you get mushroom stamped!  Oh, the shame!
          </MUITypography>
        </ConfirmationDialog>

        <MUICard className={classes.card}>
          <MUICardHeader title={`Mainboard (${player.mainboard.length})`} />
          <MUICardContent className={classes.cardContent}>
            {customSort(player.mainboard, ['cmc', 'name']).map(card => (
              <MagicCard
                cardData={card}
                key={card._id}
              >
                <MUITooltip title="Move to Sideboard">
                  <MUIIconButton
                    className={classes.iconButton}
                    onClick={event => {
                      transferCard(card._id, 'sideboard', 'mainboard', false, false);
                      event.stopPropagation();
                    }}
                    size='small'
                  >
                    S
                  </MUIIconButton>
                </MUITooltip>
              </MagicCard>
            ))}
          </MUICardContent>
        </MUICard>

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <WarningButton onClick={() => setConfirmationDialogVisible(true)}>
            Ready!
          </WarningButton>
        </div>

        <MUICard className={classes.card}>
          <MUICardHeader title={`Sideboard (${player.sideboard.length})`} />
          <MUICardContent className={classes.cardContent}>
            {customSort(player.sideboard, ['cmc', 'name']).map(card => (
              <MagicCard
                cardData={card}
                key={card._id}
              >
                <MUITooltip title="Move to Sideboard">
                  <MUIIconButton
                    className={classes.iconButton}
                    onClick={event => {
                      transferCard(card._id, 'mainboard', 'sideboard', false, false);
                      event.stopPropagation();
                    }}
                    size='small'
                  >
                    M
                  </MUIIconButton>
                </MUITooltip>
              </MagicCard>
            ))}
          </MUICardContent>
        </MUICard>
      </React.Fragment> :
      <div>
        <MUITypography variant='body1'>Players are currently sideboarding.  The match will resume shortly.</MUITypography>
      </div>
  );
};