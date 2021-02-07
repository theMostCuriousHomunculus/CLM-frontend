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
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import WarningButton from '../miscellaneous/WarningButton';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  cardActions: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  cardContent: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  cardHeader: {
    justifyContent: 'space-between',
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
  }
});

const ComponentInfo = (props) => {

  const cubeId = useParams().cubeId;
  const classes = useStyles();

  const { sendRequest } = useRequest();

  const componentNameRef = React.useRef();
  const rotationSizeRef = React.useRef();
  const [componentAnchorEl, setComponentAnchorEl] = React.useState(null);
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [newComponentName, setNewComponentName] = React.useState('');
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);
  const authentication = React.useContext(AuthenticationContext);

  async function addComponent () {
    const action = document.getElementById('module').checked ? 'add_module' : 'add_rotation';

    const componentData = JSON.stringify({
      action: action,
      name: newComponentName
    });

    try {
      const newComponentId = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        componentData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );

      setDialogIsOpen(false);
      props.dispatchAddComponent({
        newComponentId,
        newComponentName,
        newComponentType: action === 'add_module' ? 'module' : 'rotation'
      });

    } catch (error) {
      console.log(error);
    }
  }

  async function deleteComponent () {
    const action = props.activeComponentType === 'module' ? 'delete_module' : 'delete_rotation';
    const deleteInfo = JSON.stringify({
      action: action,
      component: props.activeComponentId
    });

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        deleteInfo,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.dispatchDeleteComponent();
    } catch (error) {
      console.log(error);
    }
  }

  const handleMenuItemClickComponent = (component_id) => {
    props.dispatchSwitchComponent(component_id);
    setComponentAnchorEl(null);
  };

  const handleMenuItemClickView = (event) => {
    props.dispatchSwitchViewMode(event.target.textContent);
    setViewAnchorEl(null);
  };

  async function submitComponentChanges () {
    const action = props.activeComponentType === 'module' ? 'edit_module' : 'edit_rotation';
    const componentChanges = JSON.stringify({
      action: action,
      component: props.activeComponentId,
      name: componentNameRef.current.value,
      size: rotationSizeRef.current.value
    });

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        componentChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MUICard>
      <MUICardHeader
        className={classes.cardHeader}
        disableTypography={true}
        title={(authentication.userId === props.creator._id &&
          props.activeComponentType !== 'builtIn') ?
          <MUITextField
            autoComplete="off"
            inputProps={{
              defaultValue: props.activeComponentName,
              onBlur: submitComponentChanges
            }}
            inputRef={componentNameRef}
            label="Active Component"
            onChange={(event) => props.dispatchChangeComponentName(event.target.value)}
            type="text"
            variant="outlined"
          /> :
          <MUITypography variant="subtitle1">{props.activeComponentName}</MUITypography>
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
                    secondary={props.activeComponentName}
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
                  ...props.cube.modules.map(function (module) {
                    return { name: module.name, _id: module._id };
                  }),
                  ...props.cube.rotations.map(function (rotation) {
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
                {["Curve", "List", "Table"].map((option) => (
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
        {authentication.userId === props.creator._id &&
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

        {props.activeComponentType === 'rotation' &&
          authentication.userId === props.creator._id &&
          <MUITextField
            className={classes.rotationSizeField}
            label="Size"
            inputProps={{
              defaultValue: props.activeRotationSize,
              max: props.activeComponentCards.length,
              min: 0,
              onBlur: submitComponentChanges,
              step: 1
            }}
            inputRef={rotationSizeRef}
            onChange={(event) => props.dispatchChangeRotationSize(parseInt(event.target.value))}
            type="number"
            variant="outlined"
          />
        }

        {props.activeComponentType === 'rotation' &&
          authentication.userId !== props.creator._id &&
          <MUITypography variant="subtitle1">Rotation Size: {props.activeRotationSize}</MUITypography>
        }

        {authentication.userId === props.creator._id &&
          props.activeComponentType !== 'builtIn' &&
          <WarningButton
            onClick={deleteComponent}
            startIcon={<MUIDeleteForeverIcon />}
          >
          Delete this {props.activeComponentType === 'module' ? 'Module' : 'Rotation'}
          </WarningButton>
        }
      </MUICardContent>

      <MUICardActions className={classes.cardActions}>
        <MUITypography variant="subtitle1">
          Matches: <strong>{props.displayedCards.length}</strong>
        </MUITypography>
        <MUITextField
          autoComplete="off"
          fullWidth
          id="search-filter"
          label="Filter by keywords, name or type"
          onChange={(event) => props.dispatchFilterCards(event.target.value)}
          type="text"
          value={props.filter}
          variant="outlined"
        />
      </MUICardActions>
    </MUICard>
  );
};

function mapStateToProps (state) {
  return {
    activeComponentCards: state.active_component_cards,
    activeComponentId: state.active_component_id,
    activeComponentName: state.active_component_name,
    activeComponentType: state.active_component_type,
    activeRotationSize: state.active_rotation_size,
    creator: state.cube.creator,
    cube: state.cube,
    displayedCards: state.displayed_cards,
    filter: state.filter,
    viewMode: state.view_mode
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchAddComponent: (payload) => dispatch(actionCreators.add_component(payload)),
    dispatchChangeComponentName: (payload) => dispatch(actionCreators.change_component_name(payload)),
    dispatchChangeRotationSize: (payload) => dispatch(actionCreators.change_rotation_size(payload)),
    dispatchDeleteComponent: () => dispatch(actionCreators.delete_component()),
    dispatchFilterCards: (payload) => dispatch(actionCreators.filter_cards(payload)),
    dispatchSwitchComponent: (payload) => dispatch(actionCreators.switch_component(payload)),
    dispatchSwitchViewMode: (payload) => dispatch(actionCreators.switch_view_mode(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentInfo);