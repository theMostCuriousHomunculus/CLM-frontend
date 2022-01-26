import React from 'react';
import MUIButton from '@mui/material/Button';
import MUITypography from '@mui/material/Typography';

import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import DeckDisplay from '../miscellaneous/DeckDisplay';
import { AuthenticationContext } from '../../contexts/Authentication';
import { MatchContext } from '../../contexts/match-context';

export default function Intermission() {
  const [confirmationDialogVisible, setConfirmationDialogVisible] =
    React.useState(false);
  const { userID } = React.useContext(AuthenticationContext);
  const { matchState, ready, toggleMainboardSideboardMatch } =
    React.useContext(MatchContext);

  const player = matchState.players.find((plr) => plr.account._id === userID);

  return player ? (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={ready}
        open={confirmationDialogVisible}
        title="Are you readier than SpongeBob SquarePants with a belly full of Krabby Patties?"
        toggleOpen={() =>
          setConfirmationDialogVisible((prevState) => !prevState)
        }
      >
        <MUITypography variant="body1">
          Think of how embarrassing it will be if you get mushroom stamped! Oh,
          the shame!
        </MUITypography>
      </ConfirmationDialog>

      <MUIButton
        color="warning"
        fullWidth
        onClick={() => setConfirmationDialogVisible(true)}
        style={{ margin: 4 }}
      >
        Ready!
      </MUIButton>

      <DeckDisplay
        authorizedID={userID}
        deck={{ mainboard: player.mainboard, sideboard: player.sideboard }}
        toggle={toggleMainboardSideboardMatch}
      />
    </React.Fragment>
  ) : (
    <div>
      <MUITypography variant="body1">
        Players are currently sideboarding. The match will resume shortly.
      </MUITypography>
    </div>
  );
}
