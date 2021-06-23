import React from 'react';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

export default function MoveDeleteMenu ({
  destination,
  listItemPrimaryText,
  modules,
  rotations,
  setDestination
}) {

  const allComponents = [
    { _id: 'mainboard', name: 'Mainboard' },
    { _id: 'sideboard', name: 'Sideboard' },
    ...modules,
    ...rotations
  ];
  const [anchorEl, setAnchorEl] = React.useState();

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
            secondary={destination.name}
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
            onClick={() => {
              setAnchorEl(null);
              setDestination({ _id: component._id, name: component.name });
            }}
            selected={destination._id === component._id}
          >
            {component.name}
          </MUIMenuItem>
        ))}
        <MUIMenuItem
          onClick={() => {
            setAnchorEl(null);
            setDestination({ _id: null, name: null });
          }}
        >
          Delete from Cube
        </MUIMenuItem>
      </MUIMenu>
    </React.Fragment>
  );
};