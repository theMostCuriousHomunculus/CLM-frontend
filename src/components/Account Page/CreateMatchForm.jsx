import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';
import MUIFormLabel from '@material-ui/core/FormLabel';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUIRadio from '@material-ui/core/Radio';
import MUIRadioGroup from '@material-ui/core/RadioGroup';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '../miscellaneous/Avatar';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

const useStyles = makeStyles({
  flex: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function CreateMatchForm ({
  events,
  open,
  toggleOpen
}) {

  const { loading, createMatch } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [selectedOpponent, setSelectedOpponent] = React.useState()

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Set Up A Match</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form onSubmit={event => createMatch(event, selectedEvent._id, [userId, selectedOpponent])}>
          <MUIDialogContent>

            <MUIList component="nav">
              <MUIListItem
                aria-haspopup="true"
                aria-controls="lock-menu"
                button
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <MUIListItemText
                  primary="Use Decks From"
                  secondary={selectedEvent && selectedEvent.name}
                />
              </MUIListItem>
            </MUIList>
            <MUIMenu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              {events.map(evnt => (
                <MUIMenuItem
                  key={evnt._id}
                  onClick={function () {
                    setSelectedEvent(evnt);
                    setAnchorEl(null);
                  }}
                  selected={selectedEvent && selectedEvent._id === evnt._id}
                >
                  {evnt.name}
                </MUIMenuItem>
              ))}
            </MUIMenu>

            <MUIFormControl component="fieldset" required={true}>
              <MUIFormLabel component="legend">Your Next Victim</MUIFormLabel>
              <MUIRadioGroup
                onChange={(event) => setSelectedOpponent(event.target.value)}
                value={selectedOpponent}
              >
                {selectedEvent && selectedEvent.players.filter(plr => plr.account._id !== userId).map(plr => (
                  <MUIFormControlLabel
                    control={<MUIRadio />}
                    key={plr.account._id}
                    label={
                      <span className={classes.flex}>
                        <Avatar alt={plr.account.name} size='small' src={plr.account.avatar} />
                        <MUITypography variant="subtitle1">{plr.account.name}</MUITypography>
                      </span>
                    }
                    value={plr.account._id}
                  />
                ))}
              </MUIRadioGroup>
            </MUIFormControl>

          </MUIDialogContent>

          <MUIDialogActions>
            <WarningButton onClick={toggleOpen}>
              Cancel
            </WarningButton>

            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              Whoop that Ass!
            </MUIButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};