import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
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

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

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
});

const UserDraftCard = (props) => {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const history = useHistory();
  const { sendRequest } = useRequest();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedCube, setSelectedCube] = React.useState(null);
  const [showDraftForm, setShowDraftForm] = React.useState(false);

  React.useEffect(function () {
    setSelectedCube(props.cubes[0]);
  }, [props.cubes]);

  const handleMenuItemClick = (cube_id) => {
    const clickedCube = props.cubes.find(function (cube) {
      return cube._id === cube_id;
    });
    setSelectedCube(clickedCube);
    setAnchorEl(null);
  };

  async function submitDraftForm () {
    let formInputs = {};
    formInputs.cards_per_pack = parseInt(document.getElementById('cards-per-pack').value);
    formInputs.cube = selectedCube._id;
    formInputs.name = document.getElementById('draft-name').value;
    formInputs.packs_per_drafter = parseInt(document.getElementById('packs-per-drafter').value);

    const otherDraftersElements = document.getElementsByClassName('other-drafters');
    let otherDraftersIds = [];

    for (let drafter of otherDraftersElements) {
      if (drafter.checked) {
        otherDraftersIds.push(drafter.value);
      }
    }
    formInputs['other_drafters[]'] = otherDraftersIds;

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
        `${process.env.REACT_APP_BACKEND_URL}/draft`,
        'POST',
        JSON.stringify(formInputs),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      history.push(`/draft/${responseData._id}`);
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <React.Fragment>
      {props.cubes && selectedCube &&
        <MUICard>
          <MUICardHeader title={<MUITypography variant="h3">Drafts</MUITypography>} />
          <MUICardContent>
            
          </MUICardContent>
          {accountId === authentication.userId &&
            <MUICardActions className={props.classes.cardActions}>
              <MUIButton color="primary" onClick={() => setShowDraftForm(true)} variant="contained">Start a New Draft</MUIButton>
              <MUIDialog open={showDraftForm} onClose={() => setShowDraftForm(false)}>
                <MUIDialogTitle>Start A New Draft</MUIDialogTitle>
                <MUIDialogContent>

                  <MUITextField
                    autoComplete="off"
                    autoFocus
                    fullWidth
                    id="draft-name"
                    label="Draft Name"
                    required={true}
                    type="text"
                  />

                  <MUIList component="nav">
                    <MUIListItem
                      button
                      aria-haspopup="true"
                      aria-controls="lock-menu"
                      onClick={(event) => setAnchorEl(event.currentTarget)}
                    >
                      <MUIListItemText
                        primary="Cube to Draft"
                        secondary={selectedCube.name}
                      />
                    </MUIListItem>
                  </MUIList>
                  <MUIMenu
                    id="cube-to-draft-selector"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {props.cubes.map(function (cube) {
                      return (
                        <MUIMenuItem
                          key={cube._id}
                          onClick={() => handleMenuItemClick(cube._id)}
                          selected={selectedCube._id === cube._id}
                        >
                          {cube.name}
                        </MUIMenuItem>
                      );
                    })}
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
                                    inputElement.classList.add('other-drafters');
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
                    id="packs-per-drafter"
                    InputProps={{ inputProps: { min: 0 } }}
                    label="Packs per Drafter"
                    required={true}
                    type="number"
                  />

                </MUIDialogContent>
                <MUIDialogActions>

                  <MUIButton  color="primary" onClick={() => setShowDraftForm(false)} variant="contained">
                    Cancel
                  </MUIButton>

                  <MUIButton color="primary" onClick={submitDraftForm} variant="contained">
                    Create!
                  </MUIButton>

                </MUIDialogActions>
              </MUIDialog>
            </MUICardActions>
          }
        </MUICard>
      }
    </React.Fragment>
  );
};

export default UserDraftCard;