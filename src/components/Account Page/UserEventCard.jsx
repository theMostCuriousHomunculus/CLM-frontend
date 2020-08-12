import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';
import MUIFormGroup from '@material-ui/core/FormGroup';
import MUIFormLabel from '@material-ui/core/FormLabel';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUISwitch from '@material-ui/core/Switch';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

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
  }
});

const UserEventCard = (props) => {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const { sendRequest } = useRequest();

  const [cubeAnchorEl, setCubeAnchorEl] = React.useState(null);
  const [eventAnchorEl, setEventAnchorEl] = React.useState(null);
  const [eventType, setEventType] = React.useState('draft');
  const [selectedCube, setSelectedCube] = React.useState(null);
  const [showEventForm, setShowEventForm] = React.useState(false);

  React.useEffect(function () {
    setSelectedCube(props.cubes[0]);
  }, [props.cubes]);

  const handleCubeMenuItemClick = (cube_id) => {
    const clickedCube = props.cubes.find(function (cube) {
      return cube._id === cube_id;
    });
    setSelectedCube(clickedCube);
    setCubeAnchorEl(null);
  };

  const handleEventMenuItemClick = (event_type) => {
    setEventType(event_type);
    setEventAnchorEl(null);
  };

  async function submitEventForm () {
    let formInputs = {};
    formInputs.cards_per_pack = parseInt(document.getElementById('cards-per-pack').value);
    formInputs.cube = selectedCube._id;
    formInputs.event_type = eventType;
    formInputs.name = document.getElementById('event-name').value;
    formInputs.packs_per_player = parseInt(document.getElementById('packs-per-player').value);

    const otherPlayersElements = document.getElementsByClassName('other-players');
    let otherPlayersIds = [];

    for (let player of otherPlayersElements) {
      if (player.checked) {
        otherPlayersIds.push(player.value);
      }
    }
    formInputs['other_players[]'] = otherPlayersIds;

    const moduleElements = document.getElementsByClassName('modules');
    let moduleIds = [];

    for (let module of moduleElements) {
      if (module.checked) {
        moduleIds.push(module.value);
      }
    }
    formInputs['modules[]'] = moduleIds;

    try {
      const responseData = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/event`,
        'POST',
        JSON.stringify(formInputs),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      history.push(`/event/${responseData._id}`);
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <React.Fragment>
      <MUICard>
        <MUICardHeader title={<MUITypography variant="h3">Events</MUITypography>} />
        <MUICardContent>
          <MUITableContainer className={props.classes.tableContainer}>
            <MUITable stickyHeader className={props.classes.table}>
              <MUITableHead className={props.classes.tableHead}>
                <MUITableRow>
                  <MUITableCell>Event Name</MUITableCell>
                  <MUITableCell>Host</MUITableCell>
                  <MUITableCell>Created On</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody className={props.classes.tableBody}>
                {props.events.map(function (event) {
                  return (
                    <MUITableRow key={event._id}>
                      <MUITableCell>
                        <Link to={`/event/${event._id}`}>{event.name}</Link>
                      </MUITableCell>
                      <MUITableCell>
                        <MUIAvatar alt={event.host.name} className={props.classes.avatarSmall} src={event.host.avatar} />
                        <Link to ={`/account/${event.host._id}`}>{event.host.name}</Link>
                      </MUITableCell>
                      <MUITableCell>
                        {event.createdAt}
                      </MUITableCell>
                    </MUITableRow>
                  );
                })}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUICardContent>
        {props.cubes && selectedCube && accountId === authentication.userId &&
          <MUICardActions className={props.classes.cardActions}>
            <MUIButton color="primary" onClick={() => setShowEventForm(true)} variant="contained">Start a New Event</MUIButton>
            <MUIDialog open={showEventForm} onClose={() => setShowEventForm(false)}>
              <MUIDialogTitle>Start A New Event</MUIDialogTitle>
              <MUIDialogContent>

                <MUITextField
                  autoComplete="off"
                  autoFocus
                  fullWidth
                  id="event-name"
                  label="Event Name"
                  required={true}
                  type="text"
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
                  id="cube-to-use-selector"
                  anchorEl={cubeAnchorEl}
                  keepMounted
                  open={Boolean(cubeAnchorEl)}
                  onClose={() => setCubeAnchorEl(null)}
                >
                  {props.cubes.map(function (cube) {
                    return (
                      <MUIMenuItem
                        key={cube._id}
                        onClick={() => handleCubeMenuItemClick(cube._id)}
                        selected={selectedCube._id === cube._id}
                      >
                        {cube.name}
                      </MUIMenuItem>
                    );
                  })}
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
                  id="event-type-selector"
                  anchorEl={eventAnchorEl}
                  keepMounted
                  open={Boolean(eventAnchorEl)}
                  onClose={() => setEventAnchorEl(null)}
                >
                  <MUIMenuItem
                    onClick={() => handleEventMenuItemClick('draft')}
                    selected={eventType === 'draft'}
                  >
                    Draft
                  </MUIMenuItem>

                  <MUIMenuItem
                    onClick={() => handleEventMenuItemClick('sealed')}
                    selected={eventType === 'sealed'}
                  >
                    Sealed
                  </MUIMenuItem>
                </MUIMenu>

                <MUIFormControl component="fieldset" className={classes.formControl}>
                  <MUIFormLabel component="legend">Buds to Invite</MUIFormLabel>
                  <MUIFormGroup>
                    {props.buds.map(function (bud) {
                      return (
                        <MUIFormControlLabel
                          className={classes.budSwitch}
                          control={
                            <MUISwitch
                              inputRef={function (inputElement) {
                                if (inputElement) {
                                  inputElement.classList.add('other-players');
                                }
                              }}
                              value={bud._id}
                            />
                          }
                          key={bud._id}
                          label={
                            <span className={classes.flex}>
                              <MUIAvatar alt={bud.name} className={props.classes.avatarSmall} component="span" src={bud.avatar} />
                              <MUITypography variant="subtitle1">{bud.name}</MUITypography>
                            </span>
                          }
                        />
                      );
                    })}
                  </MUIFormGroup>
                </MUIFormControl>

                <MUIFormControl component="fieldset" className={classes.formControl}>
                  <MUIFormLabel component="legend">Modules to Include</MUIFormLabel>
                  <MUIFormGroup>
                    {selectedCube.modules.map(function (module) {
                      return (
                        <MUIFormControlLabel
                          control={
                            <MUICheckbox
                              inputRef={function (inputElement) {
                                if (inputElement) {
                                  inputElement.classList.add('modules');
                                }
                              }}
                              value={module._id}
                            />
                          }
                          key={module._id}
                          label={module.name}
                        />
                      );
                    })}
                  </MUIFormGroup>
                </MUIFormControl>

                <MUITextField
                  autoComplete="off"
                  id="cards-per-pack"
                  InputProps={{ inputProps: { min: 0 } }}
                  label="Cards per Pack"
                  required={true}
                  type="number"
                />

                <MUITextField
                  autoComplete="off"
                  id="packs-per-player"
                  InputProps={{ inputProps: { min: 0 } }}
                  label="Packs per Player"
                  required={true}
                  type="number"
                />

              </MUIDialogContent>
              <MUIDialogActions>

                <MUIButton  color="primary" onClick={() => setShowEventForm(false)} variant="contained">
                  Cancel
                </MUIButton>

                <MUIButton color="primary" onClick={submitEventForm} variant="contained">
                  Create!
                </MUIButton>

              </MUIDialogActions>
            </MUIDialog>
          </MUICardActions>
        }
      </MUICard>
    </React.Fragment>
  );
};

export default UserEventCard;