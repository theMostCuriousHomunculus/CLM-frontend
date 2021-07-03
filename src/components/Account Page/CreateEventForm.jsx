import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';
import MUIFormGroup from '@material-ui/core/FormGroup';
import MUIFormLabel from '@material-ui/core/FormLabel';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUISwitch from '@material-ui/core/Switch';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '../miscellaneous/Avatar';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import WarningButton from '../miscellaneous/WarningButton';
import { AccountContext } from '../../contexts/account-context';

const useStyles = makeStyles({
  budSwitch: {
    padding: 4
  },
  flex: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  formControl: {
    display: 'block'
  },
  loadingSpinnerContainer: {
    alignContent: 'center',
    display: 'flex',
    height: 300,
    width: 300
  }
});

export default function CreateEventForm ({
  buds,
  cubes,
  open,
  toggleOpen
}) {

  const { loading, createEvent } = React.useContext(AccountContext);
  const classes = useStyles();
  const [cardsPerPack, setCardsPerPack] = React.useState(1);
  const [cubeAnchorEl, setCubeAnchorEl] = React.useState(null);
  const [eventAnchorEl, setEventAnchorEl] = React.useState(null);
  const [eventName, setEventName] = React.useState('');
  const [eventType, setEventType] = React.useState('draft');
  const [includedModules, setIncludedModules] = React.useState([]);
  const [otherPlayers, setOtherPlayers] = React.useState([]);
  const [packsPerPlayer, setPacksPerPlayer] = React.useState(1);
  const [selectedCube, setSelectedCube] = React.useState(cubes[0]);


  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Host an Event</MUIDialogTitle>
      {loading ?
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent> :
        <form
          onSubmit={event => {
            createEvent(
              event,
              selectedCube._id,
              cardsPerPack,
              eventType,
              includedModules,
              eventName,
              otherPlayers,
              packsPerPlayer
            )
          }}
        >
          <MUIDialogContent>

            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Event Name"
              margin="dense"
              onChange={event => setEventName(event.target.value)}
              required={true}
              type="text"
              value={eventName}
              variant="outlined"
            />

            <MUIList component="nav">
              <MUIListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                onClick={(event) => setCubeAnchorEl(event.currentTarget)}
              >
                <MUIListItemText
                  primary="Cube to Use"
                  secondary={selectedCube.name}
                />
              </MUIListItem>
            </MUIList>
            <MUIMenu
              anchorEl={cubeAnchorEl}
              keepMounted
              open={Boolean(cubeAnchorEl)}
              onClose={() => setCubeAnchorEl(null)}
            >
              {cubes.map(cube => (
                <MUIMenuItem
                  key={cube._id}
                  onClick={() => {
                    setCubeAnchorEl(null);
                    setSelectedCube(cube);
                  }}
                  selected={selectedCube._id === cube._id}
                >
                  {cube.name}
                </MUIMenuItem>
              ))}
            </MUIMenu>

            <MUIList component="nav">
              <MUIListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                onClick={(event) => setEventAnchorEl(event.currentTarget)}
              >
                <MUIListItemText
                  primary="Event Type"
                  secondary={eventType}
                />
              </MUIListItem>
            </MUIList>
            <MUIMenu
              anchorEl={eventAnchorEl}
              keepMounted
              open={Boolean(eventAnchorEl)}
              onClose={() => setEventAnchorEl(null)}
            >
              <MUIMenuItem
                onClick={() => {
                  setEventType('draft');
                  setEventAnchorEl(null);
                }}
                selected={eventType === 'draft'}
              >
                Draft
              </MUIMenuItem>

              <MUIMenuItem
                onClick={() => {
                  setEventType('sealed');
                  setEventAnchorEl(null);
                }}
                selected={eventType === 'sealed'}
              >
                Sealed
              </MUIMenuItem>
            </MUIMenu>

            <MUIFormControl component="fieldset" className={classes.formControl}>
              <MUIFormLabel component="legend">Buds to Invite</MUIFormLabel>
              <MUIFormGroup>
                {buds.map(bud => (
                  <MUIFormControlLabel
                    className={classes.budSwitch}
                    control={
                      <MUISwitch
                        onChange={() => {
                          if (otherPlayers.includes(bud._id)) {
                            setOtherPlayers(prevState => prevState.filter(plr => plr!== bud._id));
                          } else {
                            setOtherPlayers(prevState => [...prevState, bud._id]);
                          }
                        }}
                        value={bud._id}
                      />
                    }
                    key={bud._id}
                    label={
                      <span className={classes.flex}>
                        <Avatar alt={bud.name} size='small' src={bud.avatar} />
                        <MUITypography variant="subtitle1">{bud.name}</MUITypography>
                      </span>
                    }
                  />
                ))}
              </MUIFormGroup>
            </MUIFormControl>

            <MUIFormControl component="fieldset" className={classes.formControl}>
              <MUIFormLabel component="legend">Modules to Include</MUIFormLabel>
              <MUIFormGroup>
                {selectedCube && selectedCube.modules.map(module => (
                  <MUIFormControlLabel
                    control={
                      <MUICheckbox
                        onChange={() => {
                          if (includedModules.includes(module._id)) {
                            setIncludedModules(prevState => prevState.filter(mdl => mdl!== module._id));
                          } else {
                            setIncludedModules(prevState => [...prevState, module._id]);
                          }
                        }}
                        value={module._id}
                      />
                    }
                    key={module._id}
                    label={module.name}
                  />
                ))}
              </MUIFormGroup>
            </MUIFormControl>

            <MUIGrid
              container
              spacing={2}
            >
              <MUIGrid
                item
                xs={12}
                md={6}
              >
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                  label="Cards per Pack"
                  margin="dense"
                  onBlur={() => {
                    if (cardsPerPack === '') {
                      setCardsPerPack(1);
                    }
                  }}
                  onChange={(event) => setCardsPerPack(event.target.value)}
                  required={true}
                  type="number"
                  value={cardsPerPack}
                  variant="outlined"
                />
              </MUIGrid>

              <MUIGrid
                item
                xs={12}
                md={6}
              >
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                  label="Packs per Player"
                  margin="dense"
                  onBlur={() => {
                    if (packsPerPlayer === '') {
                      setPacksPerPlayer(1);
                    }
                  }}
                  onChange={(event) => setPacksPerPlayer(event.target.value)}
                  required={true}
                  type="number"
                  value={packsPerPlayer}
                  variant="outlined"
                />
              </MUIGrid>
            </MUIGrid>
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
              Create!
            </MUIButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
}