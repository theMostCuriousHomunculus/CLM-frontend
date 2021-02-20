import React from 'react';
import { useParams } from 'react-router-dom';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';

import ErrorDialog from '../miscellaneous/ErrorDialog';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { deleteCard } from '../../requests/cube-requests';

function MoveDeleteMenu (props) {

  const {
    activeComponentId,
    activeComponentName,
    cardId,
    dispatchMoveOrDeleteCard,
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
  const authentication = React.useContext(AuthenticationContext);
  const cubeId = useParams().cubeId;
  const [errorMessage, setErrorMessage] = React.useState();
  const [selectedComponent, setSelectedComponent] = React.useState({
    _id: null,
    name: null
  });

  React.useEffect(() => {
    setSelectedComponent({ _id: activeComponentId, name: activeComponentName });
  }, [activeComponentId, activeComponentName]);

  async function moveDeleteCard (destination) {
    setAnchorEl(null);
    try {
      await deleteCard(cardId, selectedComponent._id, cubeId, authentication.token, destination);
      dispatchMoveOrDeleteCard({ cardId, destination, origin: selectedComponent._id });
      setSelectedComponent(allComponents.find((component) => component._id === destination));
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
              onClick={() => moveDeleteCard(component._id)}
              selected={selectedComponent._id === component._id}
            >
              {component.name}
            </MUIMenuItem>
          ))
        }
        <MUIMenuItem onClick={() => moveDeleteCard(null)}>
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

function mapDispatchToProps (dispatch) {
  return {
    dispatchMoveOrDeleteCard: (payload) => dispatch(actionCreators.move_or_delete_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MoveDeleteMenu);