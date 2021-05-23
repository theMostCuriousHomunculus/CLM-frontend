import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
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

import CreateComponentForm from './CreateComponentForm';
import ErrorDialog from '../miscellaneous/ErrorDialog';
import WarningButton from '../miscellaneous/WarningButton';
import { actionCreators } from '../../redux-store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import {
  deleteComponent as deleteComponentRequest,
  editComponent
} from '../../requests/REST/cube-requests';

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

function ComponentInfo (props) {

  const {
    activeComponentCards,
    activeComponentId,
    activeComponentName,
    activeComponentType,
    activeRotationSize,
    creator,
    cube,
    dispatchChangeComponentName,
    dispatchChangeRotationSize,
    dispatchDeleteComponent,
    dispatchFilterCards,
    dispatchSwitchComponent,
    dispatchSwitchViewMode,
    displayedCards,
    filter,
    viewMode
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [componentAnchorEl, setComponentAnchorEl] = React.useState(null);
  const componentNameRef = React.useRef();
  const cubeId = useParams().cubeId;
  const [dialogIsOpen, setDialogIsOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState();
  const rotationSizeRef = React.useRef();
  const [viewAnchorEl, setViewAnchorEl] = React.useState(null);

  async function deleteComponent () {
    try {
      await deleteComponentRequest(activeComponentType, activeComponentId, cubeId, authentication.token);
      dispatchDeleteComponent();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  const handleMenuItemClickComponent = (component_id) => {
    dispatchSwitchComponent(component_id);
    setComponentAnchorEl(null);
  };

  const handleMenuItemClickView = (event) => {
    dispatchSwitchViewMode(event.target.textContent);
    setViewAnchorEl(null);
  };

  async function submitComponentChanges () {
    const componentChanges = {
      name: componentNameRef.current.value,
      size: rotationSizeRef.current.value,
      type: activeComponentType
    };

    try {
      await editComponent(componentChanges, activeComponentId, cubeId, authentication.token);
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>
    
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <CreateComponentForm
        open={dialogIsOpen}
        toggleOpen={() => setDialogIsOpen(false)}
      />
    
      <MUICard>
        <MUICardHeader
          className={classes.cardHeader}
          disableTypography={true}
          title={(authentication.userId === creator._id &&
            activeComponentType !== 'builtIn') ?
            <MUITextField
              autoComplete="off"
              inputProps={{
                defaultValue: activeComponentName,
                onBlur: submitComponentChanges
              }}
              inputRef={componentNameRef}
              label="Active Component"
              margin="dense"
              onChange={(event) => dispatchChangeComponentName(event.target.value)}
              type="text"
              variant="outlined"
            /> :
            <MUITypography variant="subtitle1">{activeComponentName}</MUITypography>
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
                      secondary={activeComponentName}
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
                    ...cube.modules.map(function (module) {
                      return { name: module.name, _id: module._id };
                    }),
                    ...cube.rotations.map(function (rotation) {
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
                      secondary={viewMode}
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
                      selected={option === viewMode}
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
          {authentication.userId === creator._id &&
            <MUIButton
              color="primary"
              onClick={() => setDialogIsOpen(true)}
              size="small"
              variant="contained"
            >
              Create a New Component
            </MUIButton>
          }

          {activeComponentType === 'rotation' &&
            authentication.userId === creator._id &&
            <MUITextField
              className={classes.rotationSizeField}
              label="Size"
              inputProps={{
                defaultValue: activeRotationSize,
                max: activeComponentCards.length,
                min: 0,
                onBlur: submitComponentChanges,
                step: 1
              }}
              inputRef={rotationSizeRef}
              margin="dense"
              onChange={(event) => dispatchChangeRotationSize(parseInt(event.target.value))}
              type="number"
              variant="outlined"
            />
          }

          {activeComponentType === 'rotation' &&
            authentication.userId !== creator._id &&
            <MUITypography variant="subtitle1">Rotation Size: {activeRotationSize}</MUITypography>
          }

          {authentication.userId === creator._id &&
            activeComponentType !== 'builtIn' &&
            <WarningButton
              onClick={deleteComponent}
              startIcon={<MUIDeleteForeverIcon />}
            >
              Delete this {activeComponentType === 'module' ? 'Module' : 'Rotation'}
            </WarningButton>
          }
        </MUICardContent>

        <MUICardActions className={classes.cardActions}>
          <MUITypography variant="subtitle1">
            Matches: <strong>{displayedCards.length}</strong>
          </MUITypography>
          <MUITextField
            autoComplete="off"
            fullWidth
            id="search-filter"
            label="Filter by keywords, name or type"
            margin="dense"
            onChange={(event) => dispatchFilterCards(event.target.value)}
            type="text"
            value={filter}
            variant="outlined"
          />
        </MUICardActions>
      </MUICard>
    
    </React.Fragment>
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
    dispatchChangeComponentName: (payload) => dispatch(actionCreators.change_component_name(payload)),
    dispatchChangeRotationSize: (payload) => dispatch(actionCreators.change_rotation_size(payload)),
    dispatchDeleteComponent: () => dispatch(actionCreators.delete_component()),
    dispatchFilterCards: (payload) => dispatch(actionCreators.filter_cards(payload)),
    dispatchSwitchComponent: (payload) => dispatch(actionCreators.switch_component(payload)),
    dispatchSwitchViewMode: (payload) => dispatch(actionCreators.switch_view_mode(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ComponentInfo);