import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICheckbox from '@mui/material/Checkbox';
import MUICheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
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
import MUIRadio from '@mui/material/Radio';
import MUIRadioGroup from '@mui/material/RadioGroup';
import MUITextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';

import Avatar from '../miscellaneous/Avatar';
import LoadingSpinner from '../miscellaneous/LoadingSpinner';
import { AccountContext } from '../../contexts/account-context';

const useStyles = makeStyles({
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
  const [eventName, setEventName] = React.useState('');
  const [eventType, setEventType] = React.useState('draft');
  const [includedModules, setIncludedModules] = React.useState([]);
  const [otherPlayers, setOtherPlayers] = React.useState([]);
  const [packsPerPlayer, setPacksPerPlayer] = React.useState(1);
  const [selectedCube, setSelectedCube] = React.useState(cubes[0]);

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
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
          <MUIDialogTitle>
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
          </MUIDialogTitle>

          <MUIDialogContent>
            <MUIGrid container spacing={1}>
              <MUIGrid item xs={12} sm={6}>
                <MUIList component="nav" style={{ padding: 0 }}>
                  <MUIListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    onClick={(event) => setCubeAnchorEl(event.currentTarget)}
                    style={{ padding: 0 }}
                  >
                    <MUIListItemText
                      primary="Cube"
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
                      style={{
                        alignItems: 'flex-end',
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '4px 8px'
                      }}
                    >
                      {cube.image && (
                        <img
                          alt={cube.image.alt}
                          src={cube.image.src}
                          style={{ borderRadius: 4, marginRight: 8 }}
                          width={75}
                        />
                      )}
                      <span style={{ flexGrow: 1, textAlign: 'right' }}>
                        {cube.name}
                      </span>
                    </MUIMenuItem>
                  ))}
                </MUIMenu>
              </MUIGrid>
              <MUIGrid item xs={12} sm={6}>
                <MUIFormControl component="fieldset" required={true}>
                  <MUIFormLabel component="legend">Event Type</MUIFormLabel>

                  <MUIRadioGroup
                    name="Event Type"
                    onChange={(event) => setEventType(event.target.value)}
                    row
                    value={eventType}
                  >
                    <MUIFormControlLabel
                      value="draft"
                      control={<MUIRadio />}
                      label="Draft"
                    />

                    <MUIFormControlLabel
                      value="sealed"
                      control={<MUIRadio />}
                      label="Sealed"
                    />
                  </MUIRadioGroup>
                </MUIFormControl>
              </MUIGrid>
            </MUIGrid>

            <hr style={{ margin: 8 }} />

            <MUIFormControl component="fieldset">
              <MUIFormLabel component="legend" style={{ paddingLeft: 8 }}>
                Buds
              </MUIFormLabel>
              <MUIFormGroup>
                <MUIGrid container spacing={1}>
                  {buds.map((bud) => (
                    <MUIGrid
                      container
                      item
                      justifyContent="center"
                      key={bud._id}
                      xs={6}
                      sm={4}
                      md={3}
                      lg={2}
                    >
                      <MUIFormControlLabel
                        control={
                          <MUICheckbox
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
                        label={
                          <Avatar
                            alt={bud.name}
                            size="small"
                            src={bud.avatar}
                          />
                        }
                      />
                    </MUIGrid>
                  ))}
                </MUIGrid>
              </MUIFormGroup>
            </MUIFormControl>

            <hr style={{ margin: 8 }} />

            <MUIFormControl component="fieldset">
              <MUIFormLabel component="legend" style={{ paddingLeft: 8 }}>
                Modules
              </MUIFormLabel>
              <MUIFormGroup>
                <MUIGrid container spacing={1}>
                  {selectedCube &&
                    selectedCube.modules.map((module) => (
                      <MUIGrid
                        item
                        key={module._id}
                        xs={12}
                        sm={6}
                        md={4}
                        lg={3}
                      >
                        <MUIFormControlLabel
                          control={
                            <MUICheckbox
                              onChange={() => {
                                if (includedModules.includes(module._id)) {
                                  setIncludedModules((prevState) =>
                                    prevState.filter(
                                      (mdl) => mdl !== module._id
                                    )
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
                          label={module.name}
                        />
                      </MUIGrid>
                    ))}
                </MUIGrid>
              </MUIFormGroup>
            </MUIFormControl>

            <hr style={{ margin: 8 }} />

            <MUIGrid container spacing={1}>
              <MUIGrid item xs={12} sm={6}>
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

              <MUIGrid item xs={12} sm={6}>
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
            <MUIButton type="submit" startIcon={<MUICheckCircleOutlinedIcon />}>
              Create!
            </MUIButton>
            <MUIButton
              color="warning"
              onClick={toggleOpen}
              startIcon={<MUICancelOutlinedIcon />}
            >
              Cancel
            </MUIButton>
          </MUIDialogActions>
        </form>
      )}
    </MUIDialog>
  );
}
