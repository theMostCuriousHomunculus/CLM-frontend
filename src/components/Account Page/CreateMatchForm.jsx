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
  formControlWithMargin: {
    margin: '4px 0'
  },
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function CreateMatchForm ({
  open,
  toggleOpen
}) {

  const { loading, accountState: { buds, decks, events }, createMatch } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState();
  const [fromEvent, setFromEvent] = React.useState(true);
  const [myDeckID, setMyDeckID] = React.useState(null);
  const [opponentDeckID, setOpponentDeckID] = React.useState(null);
  const [selectedEvent, setSelectedEvent] = React.useState({
    _id: null,
    name: null,
    players: []
  });
  const [selectedOpponent, setSelectedOpponent] = React.useState(null);

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Set Up A Match</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form onSubmit={event => createMatch(event, [myDeckID, opponentDeckID], selectedEvent._id, [userId, selectedOpponent])}>
          <MUIDialogContent style={{ display: 'flex', flexDirection: 'column' }}>

            <MUIFormControl className={classes.formControlWithMargin} component="fieldset" required={true}>
              <MUIFormLabel component="legend">Create Match from</MUIFormLabel>
              <MUIRadioGroup
                onChange={event => {
                  if (event.target.value === 'true') {
                    setMyDeckID(null);
                    setOpponentDeckID(null);
                    setFromEvent(true);
                  } else {
                    setSelectedEvent({ _id: null, name: null, players: [] });
                    setFromEvent(false);
                  }
                }}
                value={fromEvent}
              >
                <MUIFormControlLabel
                  control={<MUIRadio />}
                  label="Decks"
                  value={false}
                />
                <MUIFormControlLabel
                  control={<MUIRadio />}
                  label="Event"
                  value={true}
                />
              </MUIRadioGroup>
            </MUIFormControl>

            {fromEvent ?
              <React.Fragment>
                <MUIList component="nav">
                  <MUIListItem
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    button
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <MUIListItemText
                      primary="Use Decks From"
                      secondary={selectedEvent.name}
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
                      selected={selectedEvent._id === evnt._id}
                    >
                      {evnt.name}
                    </MUIMenuItem>
                  ))}
                </MUIMenu>
              </React.Fragment> :
              <MUIFormControl className={classes.formControlWithMargin} component="fieldset" required={true}>
                <MUIFormLabel component="legend">Your Deck</MUIFormLabel>
                <MUIRadioGroup
                  onChange={event => setMyDeckID(event.target.value)}
                  value={myDeckID}
                >
                  {decks.map(dck => (
                    <MUIFormControlLabel
                      control={<MUIRadio />}
                      key={dck._id}
                      label={
                        <React.Fragment>
                          <MUITypography variant="subtitle1">{dck.name}</MUITypography>
                          <MUITypography variant="subtitle2">{dck.format}</MUITypography>
                        </React.Fragment>
                      }
                      value={dck._id}
                    />
                  ))}
                </MUIRadioGroup>
              </MUIFormControl>
            }

            <MUIFormControl className={classes.formControlWithMargin} component="fieldset" required={true}>
              <MUIFormLabel component="legend">Your Next Victim</MUIFormLabel>
              <MUIRadioGroup
                onChange={event => setSelectedOpponent(event.target.value)}
                value={selectedOpponent}
              >
                {fromEvent ?
                  selectedEvent.players.filter(plr => plr.account._id !== userId).map(plr => (
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
                  )) :
                  <React.Fragment>
                    {buds.map(bud => (
                      <MUIFormControlLabel
                        control={<MUIRadio />}
                        key={bud._id}
                        label={
                          <span className={classes.flex}>
                            <Avatar alt={bud.name} size='small' src={bud.avatar} />
                            <MUITypography variant="subtitle1">{bud.name}</MUITypography>
                          </span>
                        }
                        value={bud._id}
                      />
                    ))}
                    
                  </React.Fragment>
                }
              </MUIRadioGroup>
            </MUIFormControl>

            {!fromEvent &&
              <MUIFormControl className={classes.formControlWithMargin} component="fieldset" required={true}>
                <MUIFormLabel component="legend">Your Opponent's Deck</MUIFormLabel>
                <MUIRadioGroup
                  onChange={event => setOpponentDeckID(event.target.value)}
                  value={opponentDeckID}
                >
                  {selectedOpponent && buds.find(bud => bud._id === selectedOpponent).decks.map(dck => (
                    <MUIFormControlLabel
                      control={<MUIRadio />}
                      key={dck._id}
                      label={
                        <React.Fragment>
                          <MUITypography variant="subtitle1">{dck.name}</MUITypography>
                          <MUITypography variant="subtitle2">{dck.format}</MUITypography>
                        </React.Fragment>
                      }
                      value={dck._id}
                    />
                  ))}
                </MUIRadioGroup>
              </MUIFormControl>
            }

          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              Whoop that Ass!
            </MUIButton>
            <WarningButton onClick={toggleOpen}>
              Cancel
            </WarningButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};