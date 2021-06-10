import React from 'react';
import { useHistory } from 'react-router-dom';
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

import ErrorDialog from '../miscellaneous/ErrorDialog';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import SmallAvatar from '../miscellaneous/SmallAvatar';
import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { createMatch } from '../../requests/GraphQL/match-requests';

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

const CreateEventForm = (props) => {

  const { events, open, toggleOpen } = props;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const [errorMessage, setErrorMessage] = React.useState();
  const [eventAnchorEl, setEventAnchorEl] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [selectedEvent, setSelectedEvent] = React.useState();
  const [selectedOpponent, setSelectedOpponent] = React.useState()

  async function submitForm (event) {
    event.preventDefault();

    try {
      setLoading(true);
      const responseData = await createMatch(selectedEvent._id,
        selectedOpponent ? [authentication.userId, selectedOpponent] : [authentication.userId],
        authentication.token);
      console.log(responseData);
      setLoading(false);
      history.push(`/match/${responseData._id}`);
    } catch (error) {
      setLoading(false);
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <MUIDialog open={open} onClose={toggleOpen}>
        <MUIDialogTitle>Set Up A Match</MUIDialogTitle>
        {loading ?
          <MUIDialogContent className={classes.loadingSpinnerContainer}>
            <LoadingSpinner />
          </MUIDialogContent> :
          <form onSubmit={submitForm}>
            <MUIDialogContent>

              <MUIList component="nav">
                <MUIListItem
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  button
                  onClick={(event) => setEventAnchorEl(event.currentTarget)}
                >
                  <MUIListItemText
                    primary="Use Decks From"
                    secondary={selectedEvent && selectedEvent.name}
                  />
                </MUIListItem>
              </MUIList>
              <MUIMenu
                anchorEl={eventAnchorEl}
                keepMounted
                open={Boolean(eventAnchorEl)}
                onClose={() => setEventAnchorEl(null)}
              >
                {events.map(function (evnt) {
                  return (
                    <MUIMenuItem
                      key={evnt._id}
                      onClick={function () {
                        setSelectedEvent(evnt);
                        setEventAnchorEl(null);
                      }}
                      selected={selectedEvent && selectedEvent._id === evnt._id}
                    >
                      {evnt.name}
                    </MUIMenuItem>
                  );
                })}
              </MUIMenu>

              <MUIFormControl component="fieldset">
                <MUIFormLabel component="legend">Your Next Victim</MUIFormLabel>
                <MUIRadioGroup
                  onChange={(event) => setSelectedOpponent(event.target.value)}
                  value={selectedOpponent}
                >
                  {selectedEvent && selectedEvent.players.filter(plr => plr.account._id !== authentication.userId).map(function (plr) {
                    return (
                      <MUIFormControlLabel
                        control={
                          <MUIRadio />
                        }
                        key={plr.account._id}
                        label={
                          <span className={classes.flex}>
                            <SmallAvatar
                              alt={plr.account.name}
                              src={plr.account.avatar}
                            />
                            <MUITypography variant="subtitle1">{plr.account.name}</MUITypography>
                          </span>
                        }
                        value={plr.account._id}
                      />
                    );
                  })}
                </MUIRadioGroup>
              </MUIFormControl>

            </MUIDialogContent>

            <MUIDialogActions>
              <WarningButton
                onClick={toggleOpen}
              >
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

    </React.Fragment>
  );
}

export default CreateEventForm;