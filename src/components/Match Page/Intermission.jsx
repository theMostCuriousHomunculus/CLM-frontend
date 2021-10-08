import React from 'react';
import MUITypography from '@mui/material/Typography';

import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import DeckDisplay from '../miscellaneous/DeckDisplay';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { MatchContext } from '../../contexts/match-context';

export default function Intermission () {

  const [confirmationDialogVisible, setConfirmationDialogVisible] = React.useState(false);
  const { userId } = React.useContext(AuthenticationContext);
  const { matchState, ready, toggleMainboardSideboardMatch } = React.useContext(MatchContext);

  const player = matchState.players.find(plr => plr.account._id === userId);

  return (
    player ?
      <React.Fragment>
        <ConfirmationDialog
          confirmHandler={ready}
          open={confirmationDialogVisible}
          title="Are you readier than SpongeBob SquarePants with a belly full of Krabby Patties?"
          toggleOpen={() => setConfirmationDialogVisible(prevState => !prevState)}
        >
          <MUITypography variant="body1">
            Think of how embarrassing it will be if you get mushroom stamped!  Oh, the shame!
          </MUITypography>
        </ConfirmationDialog>

        <WarningButton
          fullWidth
          onClick={() => setConfirmationDialogVisible(true)}
          style={{ margin: 4 }}
        >
          Ready!
        </WarningButton>

        <DeckDisplay
          add={() => null}
          authorizedID={userId}
          deck={{ mainboard: player.mainboard, sideboard: player.sideboard }}
          remove={() => null}
          toggle={toggleMainboardSideboardMatch}
        />
      </React.Fragment> :
      <div>
        <MUITypography variant='body1'>
          Players are currently sideboarding.  The match will resume shortly.
        </MUITypography>
      </div>
  );
};