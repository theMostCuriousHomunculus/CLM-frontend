import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../../contexts/authentication-context';
import theme from '../../theme';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  marginRight: {
    marginRight: '1rem'
  },
  radioButton: {
    marginRight: '1rem'
  },
  radioButtonContainer: {
    marginTop: '1rem'
  },
  remainingWidth: {
    flexGrow: 1,
    width: 'auto'
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

const ComponentInfo = (props) => {

  const [componentAnchorEl, setComponentAnchorEl] = React.useState(null);
  const [componentName, setComponentName] = React.useState(props.componentState.active_component_name);
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [rotationSize, setRotationSize] = React.useState(props.componentState.active_rotation_size);
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { sendRequest } = useRequest();

  React.useEffect(() => {
    setComponentName(props.componentState.active_component_name);
    setRotationSize(props.componentState.active_rotation_size);
  }, [props.componentState.active_component_id, props.componentState.cube]);

  async function addComponent (event) {
    event.preventDefault();
    const action = document.getElementById('module').checked ? 'add_module' : 'add_rotation';
    const name = document.getElementById('component-name').value;

    const componentData = JSON.stringify({
      action: action,
      cube_id: props.componentState.cube._id,
      name: name
    });

    try {
      const updatedCube = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/`,
        'PATCH',
        componentData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.updateCubeHandler(updatedCube);

      let component_id;
      if (action === 'add_module') {
        component_id = updatedCube.modules[updatedCube.modules.length - 1]._id;
      } else {
        component_id = updatedCube.rotations[updatedCube.rotations.length - 1]._id;
      }

      setDialogIsOpen(false);
      props.changeComponent(component_id);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  async function deleteComponent () {
    const action = props.componentState.active_component_type === 'module' ? 'delete_module' : 'delete_rotation';
    const deleteInfo = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
      'PATCH',
      deleteInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  const handleMenuItemClickComponent = (component_id) => {
    props.changeComponent(component_id);
    setComponentAnchorEl(null);
  };

  const handleMenuItemClickView = (event) => {
    props.changeViewMode(event.target.textContent);
    setViewAnchorEl(null);
  };

  async function submitComponentChanges () {
    const action = props.componentState.active_component_type === 'module' ? 'edit_module' : 'edit_rotation';
    const componentChanges = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      name: componentName,
      size: rotationSize
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
      'PATCH',
      componentChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  return (
    <MUICard>

      <MUICardHeader
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {authentication.userId === props.componentState.cube.creator &&
              props.componentState.active_component_type !== 'mainboard' &&
              props.componentState.active_component_type !== 'sideboard' ?
              <React.Fragment>
                <MUITextField
                  autoComplete="off"
                  label="Active Component"
                  onBlur={submitComponentChanges}
                  onChange={(event) => setComponentName(event.target.value)}
                  type="text"
                  value={componentName}
                  variant="outlined"
                />
                {props.componentState.active_component_type === 'rotation' &&
                  <MUITextField
                    label="Rotation Size"
                    inputProps={{ max: props.componentState.active_component_cards.length, min: 0, step: 1 }}
                    onBlur={submitComponentChanges}
                    onChange={(event) => setRotationSize(event.target.value)}
                    type="number"
                    value={rotationSize}
                    variant="outlined"
                  />
                }
              </React.Fragment> :
              <React.Fragment>
                <div>
                  <MUITypography variant="h3">Active Component:</MUITypography>
                  <MUITypography variant="h4">{props.componentState.active_component_name}</MUITypography>
                </div>
                {props.componentState.active_component_type === 'rotation' &&
                  <MUITypography variant="h4">Rotation Size: {props.componentState.active_rotation_size}</MUITypography>
                }
              </React.Fragment>
            }
          </div>
        }
      />

      <MUICardContent>

        <MUIGrid container alignItems="center" justify="flex-end">
          <MUIGrid item xs={3}>
            <MUIList component="nav">
              <MUIListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                onClick={(event) => setViewAnchorEl(event.currentTarget)}
              >
                <MUIListItemText
                  primary="View Mode"
                  secondary={props.viewMode}
                />
              </MUIListItem>
            </MUIList>
            <MUIMenu
              id="view-selector"
              anchorEl={viewAnchorEl}
              keepMounted
              open={Boolean(viewAnchorEl)}
              onClose={() => setViewAnchorEl(null)}
            >
              {["Curve View", "List View", "Table View"].map((option) => (
                <MUIMenuItem
                  key={option}
                  onClick={handleMenuItemClickView}
                  selected={option === props.viewMode}
                >
                  {option}
                </MUIMenuItem>
              ))}
            </MUIMenu>
          </MUIGrid>

          <MUIGrid item xs={9}>
            <MUITextField
              autoComplete="off"
              id="search-filter"
              label="Filter by keywords, name or type"
              onChange={props.filterCardsHandler}
              style={{ width: '100%' }}
              type="text"
              value={props.componentState.filter}
              variant="outlined"
            />
          </MUIGrid>

          <MUIGrid item xs={12} style={{ textAlign: 'right' }}>
            <MUITypography variant="body1">
              Matches: <strong>{props.componentState.displayed_cards.length}</strong>
            </MUITypography>
          </MUIGrid>

        </MUIGrid>
      </MUICardContent>

      <MUICardActions className={classes.cardActions}>

        <MUIList component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={(event) => setComponentAnchorEl(event.currentTarget)}
          >
            <MUIListItemText
              primary="Switch Component"
              secondary={props.componentState.active_component_name}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          id="component-selector"
          anchorEl={componentAnchorEl}
          keepMounted
          open={Boolean(componentAnchorEl)}
          onClose={() => setComponentAnchorEl(null)}
        >
          {[{ name: 'Mainboard', _id: 'mainboard' },
            { name: 'Sideboard', _id: 'sideboard' },
            ...props.componentState.cube.modules.map(function (module) {
              return { name: module.name, _id: module._id };
            }),
            ...props.componentState.cube.rotations.map(function (rotation) {
              return { name: rotation.name, _id: rotation._id };
            })].map((component) => (
              <MUIMenuItem
                key={component._id}
                onClick={() => handleMenuItemClickComponent(component._id)}
                selected={component.active_component_id === component._id}
              >
                {component.name}
              </MUIMenuItem>
            ))
          }
        </MUIMenu>

        {authentication.userId === props.componentState.cube.creator &&
          <React.Fragment>
            <MUIButton
              color="primary"
              onClick={() => setDialogIsOpen(true)}
              variant="contained"
            >
              Create a Module or Rotation
            </MUIButton>
          
            <MUIDialog open={dialogIsOpen} onClose={() => setDialogIsOpen(false)}>
              <MUIDialogTitle>Create A New Component</MUIDialogTitle>
              <MUIDialogContent>

                <MUITextField
                  autoComplete="off"
                  autoFocus
                  fullWidth
                  id="component-name"
                  label="Component Name"
                  required={true}
                  type="text"
                />

                <div className={classes.radioButtonContainer}>
                  <input
                    className={classes.radioButton}
                    id="module"
                    name="action"
                    required
                    type="radio"
                    value="add_module"
                  />
                  <label htmlFor="module">Module</label>
                </div>

                <div className={classes.radioButtonContainer}>
                  <input
                    className={classes.radioButton}
                    id="rotation"
                    name="action"
                    required
                    type="radio"
                    value="add_rotation"
                  />
                  <label htmlFor="rotation">Rotation</label>
                </div>

              </MUIDialogContent>
              <MUIDialogActions>

                <MUIButton  color="primary" onClick={() => setDialogIsOpen(false)} variant="contained">
                  Cancel
                </MUIButton>

                <MUIButton color="primary" onClick={addComponent} variant="contained">
                  Create!
                </MUIButton>

              </MUIDialogActions>
            </MUIDialog>
          </React.Fragment>
        }
        {authentication.userId === props.componentState.cube.creator &&
          props.componentState.active_component_type !== 'mainboard' &&
          props.componentState.active_component_type !== 'sideboard' &&
          <MUIButton
            className={classes.warningButton}
            onClick={deleteComponent}
            startIcon={<MUIDeleteForeverIcon />}
            variant="contained"
          >
            Delete this {props.componentState.active_component_type === 'module' ? 'Module' : 'Rotation'}
          </MUIButton>
        }
      </MUICardActions>
    </MUICard>
  );
}

export default ComponentInfo;