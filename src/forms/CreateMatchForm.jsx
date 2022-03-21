import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUIRadio from '@mui/material/Radio';
import MUIRadioGroup from '@mui/material/RadioGroup';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

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

export default function CreateMatchForm({ open, toggleOpen }) {
  const {
    loading,
    accountState: { buds, decks, events },
    createMatch
  } = React.useContext(AccountContext);
  const { userID } = React.useContext(AuthenticationContext);
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
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form
          onSubmit={(event) =>
            createMatch(event, [myDeckID, opponentDeckID], selectedEvent._id, [
              userID,
              selectedOpponent
            ])
          }
        >
          <MUIDialogContent style={{ display: 'flex', flexDirection: 'column' }}>
            <MUIFormControl
              className={classes.formControlWithMargin}
              component="fieldset"
              required={true}
            >
              <MUIFormLabel component="legend">Create Match from</MUIFormLabel>
              <MUIRadioGroup
                onChange={(event) => {
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
                <MUIFormControlLabel control={<MUIRadio />} label="Decks" value={false} />
                <MUIFormControlLabel control={<MUIRadio />} label="Event" value={true} />
              </MUIRadioGroup>
            </MUIFormControl>

            {fromEvent ? (
              <React.Fragment>
                <MUIList component="nav">
                  <MUIListItem
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    button
                    onClick={(event) => setAnchorEl(event.currentTarget)}
                  >
                    <MUIListItemText primary="Use Decks From" secondary={selectedEvent.name} />
                  </MUIListItem>
                </MUIList>
                <MUIMenu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={() => setAnchorEl(null)}
                >
                  {events.map((evnt) => (
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
              </React.Fragment>
            ) : (
              <MUIFormControl
                className={classes.formControlWithMargin}
                component="fieldset"
                required={true}
              >
                <MUIFormLabel component="legend">Your Deck</MUIFormLabel>
                <MUIRadioGroup
                  onChange={(event) => setMyDeckID(event.target.value)}
                  value={myDeckID}
                >
                  {decks.map((dck) => (
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
            )}

            <MUIFormControl
              className={classes.formControlWithMargin}
              component="fieldset"
              required={true}
            >
              <MUIFormLabel component="legend">Your Next Victim</MUIFormLabel>
              <MUIRadioGroup
                onChange={(event) => setSelectedOpponent(event.target.value)}
                value={selectedOpponent}
              >
                {fromEvent ? (
                  selectedEvent.players
                    .filter((plr) => plr.account._id !== userID)
                    .map((plr) => (
                      <MUIFormControlLabel
                        control={<MUIRadio />}
                        key={plr.account._id}
                        label={
                          <span className={classes.flex}>
                            <Avatar
                              alt={plr.account.name}
                              size="small"
                              src={
                                plr.account.avatar.image_uris?.art_crop ??
                                plr.account.avatar.card_faces[0].image_uris.art_crop
                              }
                            />
                            <MUITypography variant="subtitle1">{plr.account.name}</MUITypography>
                          </span>
                        }
                        value={plr.account._id}
                      />
                    ))
                ) : (
                  <React.Fragment>
                    {buds.map((bud) => (
                      <MUIFormControlLabel
                        control={<MUIRadio />}
                        key={bud._id}
                        label={
                          <span className={classes.flex}>
                            <Avatar
                              alt={bud.name}
                              size="small"
                              src={
                                bud.avatar.image_uris?.art_crop ??
                                bud.avatar.card_faces[0].image_uris.art_crop
                              }
                            />
                            <MUITypography variant="subtitle1">{bud.name}</MUITypography>
                          </span>
                        }
                        value={bud._id}
                      />
                    ))}
                  </React.Fragment>
                )}
              </MUIRadioGroup>
            </MUIFormControl>

            {!fromEvent && (
              <MUIFormControl
                className={classes.formControlWithMargin}
                component="fieldset"
                required={true}
              >
                <MUIFormLabel component="legend">Your Opponent's Deck</MUIFormLabel>
                <MUIRadioGroup
                  onChange={(event) => setOpponentDeckID(event.target.value)}
                  value={opponentDeckID}
                >
                  {selectedOpponent &&
                    buds
                      .find((bud) => bud._id === selectedOpponent)
                      .decks.map((dck) => (
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
            )}
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton type="submit">Whoop that Ass!</MUIButton>
            <MUIButton color="warning" onClick={toggleOpen} startIcon={<MUICancelOutlinedIcon />}>
              Cancel
            </MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
