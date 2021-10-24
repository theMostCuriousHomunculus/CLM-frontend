import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICheckbox from '@mui/material/Checkbox';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIFormGroup from '@mui/material/FormGroup';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIGrid from '@mui/material/Grid';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUISwitch from '@mui/material/Switch';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

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

export default function CreateEventForm({ buds, cubes, open, toggleOpen }) {
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
      {loading ? (
        <MUIDialogContent className={classes.loadingSpinnerContainer}>
          <LoadingSpinner />
        </MUIDialogContent>
      ) : (
        <form
          onSubmit={(event) => {
            createEvent(
              event,
              selectedCube._id,
              cardsPerPack,
              eventType,
              includedModules,
              eventName,
              otherPlayers,
              packsPerPlayer
            );
          }}
        >
          <MUIDialogContent>
            <MUITextField
              autoComplete="off"
              autoFocus
              fullWidth
              label="Event Name"
              onChange={(event) => setEventName(event.target.value)}
              required={true}
              type="text"
              value={eventName}
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
              {cubes.map((cube) => (
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
                <MUIListItemText primary="Event Type" secondary={eventType} />
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

            <MUIFormControl
              component="fieldset"
              className={classes.formControl}
            >
              <MUIFormLabel component="legend">Buds to Invite</MUIFormLabel>
              <MUIFormGroup>
                {buds.map((bud) => (
                  <MUIFormControlLabel
                    className={classes.budSwitch}
                    control={
                      <MUISwitch
                        onChange={() => {
                          if (otherPlayers.includes(bud._id)) {
                            setOtherPlayers((prevState) =>
                              prevState.filter((plr) => plr !== bud._id)
                            );
                          } else {
                            setOtherPlayers((prevState) => [
                              ...prevState,
                              bud._id
                            ]);
                          }
                        }}
                        value={bud._id}
                      />
                    }
                    key={bud._id}
                    label={
                      <span className={classes.flex}>
                        <Avatar alt={bud.name} size="small" src={bud.avatar} />
                        <MUITypography variant="subtitle1">
                          {bud.name}
                        </MUITypography>
                      </span>
                    }
                  />
                ))}
              </MUIFormGroup>
            </MUIFormControl>

            <MUIFormControl
              component="fieldset"
              className={classes.formControl}
            >
              <MUIFormLabel component="legend">Modules to Include</MUIFormLabel>
              <MUIFormGroup>
                {selectedCube &&
                  selectedCube.modules.map((module) => (
                    <MUIFormControlLabel
                      control={
                        <MUICheckbox
                          onChange={() => {
                            if (includedModules.includes(module._id)) {
                              setIncludedModules((prevState) =>
                                prevState.filter((mdl) => mdl !== module._id)
                              );
                            } else {
                              setIncludedModules((prevState) => [
                                ...prevState,
                                module._id
                              ]);
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

            <MUIGrid container spacing={2}>
              <MUIGrid item xs={12} md={6}>
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                  label="Cards per Pack"
                  onBlur={() => {
                    if (cardsPerPack === '') {
                      setCardsPerPack(1);
                    }
                  }}
                  onChange={(event) => setCardsPerPack(event.target.value)}
                  required={true}
                  type="number"
                  value={cardsPerPack}
                />
              </MUIGrid>

              <MUIGrid item xs={12} md={6}>
                <MUITextField
                  autoComplete="off"
                  fullWidth
                  InputProps={{ inputProps: { min: 1 } }}
                  label="Packs per Player"
                  onBlur={() => {
                    if (packsPerPlayer === '') {
                      setPacksPerPlayer(1);
                    }
                  }}
                  onChange={(event) => setPacksPerPlayer(event.target.value)}
                  required={true}
                  type="number"
                  value={packsPerPlayer}
                />
              </MUIGrid>
            </MUIGrid>
          </MUIDialogContent>

          <MUIDialogActions>
            <WarningButton onClick={toggleOpen}>Cancel</WarningButton>

            <MUIButton type="submit">Create!</MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
