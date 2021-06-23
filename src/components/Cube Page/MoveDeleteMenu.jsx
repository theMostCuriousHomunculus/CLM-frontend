import React from 'react';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

export default function MoveDeleteMenu ({
  activeComponentId = "",
  activeComponentName = "",
  handleMoveDelete = () => null,
  listItemPrimaryText = "",
  modules = [],
  rotations = []
}) {

  const allComponents = [
    { name: 'Mainboard', _id: 'mainboard' },
    { name: 'Sideboard', _id: 'sideboard' },
    ...modules,
    ...rotations
  ];
  const [anchorEl, setAnchorEl] = React.useState();
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
      <MUIList component="nav">
        <MUIListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={event => setAnchorEl(event.currentTarget)}
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
};