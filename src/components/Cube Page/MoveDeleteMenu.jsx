import React from 'react';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';

import ErrorDialog from '../miscellaneous/ErrorDialog';

function MoveDeleteMenu (props) {

  const {
    activeComponentId,
    activeComponentName,
    handleMoveDelete,
    listItemPrimaryText,
    modules,
    rotations
  } = props;
  const allComponents = [
    { name: 'Mainboard', _id: 'mainboard' },
    { name: 'Sideboard', _id: 'sideboard' },
    ...modules,
    ...rotations
  ];
  const [anchorEl, setAnchorEl] = React.useState();
  const [errorMessage, setErrorMessage] = React.useState();
  const [selectedComponent, setSelectedComponent] = React.useState({
    _id: activeComponentId,
    name: activeComponentName
  });

  function handleMenuItemClick (destination) {
    setAnchorEl(null);
    setSelectedComponent(destination);
    handleMoveDelete(destination._id);
  }

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <MUIList component="nav">
        <MUIListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          <MUIListItemText
            primary={listItemPrimaryText}
            secondary={selectedComponent.name}
          />
        </MUIListItem>
      </MUIList>

      <MUIMenu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {allComponents.map((component) => (
            <MUIMenuItem
              key={component._id}
              onClick={() => handleMenuItemClick({ _id: component._id, name: component.name })}
              selected={selectedComponent._id === component._id}
            >
              {component.name}
            </MUIMenuItem>
          ))
        }
        <MUIMenuItem onClick={() => handleMenuItemClick({ _id: null, name: null })}>
          Delete from Cube
        </MUIMenuItem>
      </MUIMenu>

    </React.Fragment>
  );
}

function mapStateToProps (state) {
  return {
    activeComponentId: state.active_component_id,
    activeComponentName: state.active_component_name,
    modules: state.cube.modules.map(module => ({ _id: module._id, name: module.name})),
    rotations: state.cube.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name }))
  };
}

export default connect(mapStateToProps, null)(MoveDeleteMenu);