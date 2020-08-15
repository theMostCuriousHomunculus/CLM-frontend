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
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { AuthenticationContext } from '../../contexts/authentication-context';
import theme from '../../theme';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  cardActions: {
    alignItems: 'flex-end',
    flexDirection: 'column',
    paddingTop: 4
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0 4px 0'
  },
  cardHeader: {
    justifyContent: 'space-between',
    paddingBottom: 4,
    '& .MuiCardHeader-content': {
      width: 'unset'
    },
    '& .MuiCardHeader-action': {
      display: 'flex',
      flexDirection: 'row',
      flexGrow: 2,
      justifyContent: 'space-between',
      margin: 0
    }
  },
  list: {
    padding: 0
  },
  listContainer: {
    flexGrow: 1
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
  rotationSizeField: {
    margin: '0 8px 0 8px',
    width: '33%'
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

const ComponentInfo = React.memo((props) => {

  const cubeId = useParams().cubeId;
  const [componentAnchorEl, setComponentAnchorEl] = React.useState(null);
  const [componentName, setComponentName] = React.useState(props.componentName);
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [newComponentName, setNewComponentName] = React.useState('');
  const [rotationSize, setRotationSize] = React.useState(props.rotationSize);
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { sendRequest } = useRequest();

  React.useEffect(() => {
    setComponentName(props.componentName);
    setRotationSize(props.rotationSize);
  }, [props.componentName, props.rotationSize]);

  async function addComponent () {
    const action = document.getElementById('module').checked ? 'add_module' : 'add_rotation';

    const componentData = JSON.stringify({
      action: action,
      cube_id: cubeId,
      name: newComponentName
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
      props.switchComponentHandler(component_id);

    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComponent () {
    const action = props.componentType === 'module' ? 'delete_module' : 'delete_rotation';
    const deleteInfo = JSON.stringify({
      action: action,
      component: props.componentId,
      cube_id: cubeId
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
    props.switchComponentHandler(component_id);
    setComponentAnchorEl(null);
  };

  const handleMenuItemClickView = (event) => {
    props.setViewMode(event.target.textContent);
    setViewAnchorEl(null);
  };

  async function submitComponentChanges () {
    const action = props.componentType === 'module' ? 'edit_module' : 'edit_rotation';
    const componentChanges = JSON.stringify({
      action: action,
      component: props.componentId,
      cube_id: cubeId,
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
        className={classes.cardHeader}
        title={(authentication.userId === props.componentState.cube.creator &&
          props.componentType !== 'mainboard' &&
          props.componentType !== 'sideboard') ?
          <MUITextField
            autoComplete="off"
            inputProps={{ onBlur: submitComponentChanges }}
            label="Active Component"
            onChange={(event) => setComponentName(event.target.value)}
            type="text"
            value={componentName}
            variant="outlined"
          /> :
          <MUITypography variant="h3">{props.componentName}</MUITypography>
        }
        action={
          <React.Fragment>
            <div className={classes.listContainer}>
              <MUIList className={classes.list} component="nav">
                <MUIListItem
                  button
                  aria-haspopup="true"
                  aria-controls="lock-menu"
                  onClick={(event) => setComponentAnchorEl(event.currentTarget)}
                >
                  <MUIListItemText
                    primary="Switch Component"
                    secondary={componentName}
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
            </div>
            <div className={classes.listContainer}>
              <MUIList className={classes.list} component="nav">
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
            </div>
          </React.Fragment>
        }
      />

      <MUICardContent className={classes.cardContent}>
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
                  label="Component Name"
                  onChange={(event) => setNewComponentName(event.target.value)}
                  required={true}
                  type="text"
                  value={newComponentName}
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

        {props.componentType === 'rotation' &&
          (authentication.userId === props.componentState.cube.creator ?
          <MUITextField
            className={classes.rotationSizeField}
            label="Size"
            inputProps={{ max: props.componentState.active_component_cards.length, min: 0, step: 1 }}
            onBlur={submitComponentChanges}
            onChange={(event) => setRotationSize(event.target.value)}
            type="number"
            value={rotationSize}
            variant="outlined"
          /> :
          <MUITypography variant="h4">Rotation Size: {props.rotationSize}</MUITypography>)
        }

        {authentication.userId === props.componentState.cube.creator &&
          props.componentType !== 'mainboard' &&
          props.componentType !== 'sideboard' &&
          <MUIButton
            className={classes.warningButton}
            onClick={deleteComponent}
            startIcon={<MUIDeleteForeverIcon />}
            variant="contained"
          >
            Delete this {props.componentType === 'module' ? 'Module' : 'Rotation'}
          </MUIButton>
        }
      </MUICardContent>

      <MUICardActions className={classes.cardActions}>
        <MUITypography variant="h4">
          Matches: <strong>{props.componentState.displayed_cards.length}</strong>
        </MUITypography>
        <MUITextField
          autoComplete="off"
          fullWidth
          id="search-filter"
          label="Filter by keywords, name or type"
          onChange={props.filterCardsHandler}
          type="text"
          value={props.componentState.filter}
          variant="outlined"
        />
      </MUICardActions>
    </MUICard>
  );
})

export default ComponentInfo;