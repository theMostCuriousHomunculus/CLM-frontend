import React from 'react';
import { useParams } from 'react-router-dom';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableRow from '@material-ui/core/TableRow';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import ColorCheckboxes from './ColorCheckboxes';
import PrintSelector from './PrintSelector';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';
import { useCube } from '../../hooks/cube-hook';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  tableCell: {
    height: '100%',
    paddingBottom: 4,
    paddingTop: 4
  }
});

const AuthorizedCardRow = (props) => {

  const cubeId = useParams().cubeId;
  const {
    card: {
      _id,
      back_image,
      cmc,
      color_identity,
      image,
      name,
      purchase_link,
      type_line
    }
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [cubeState, dispatch] = useCube(false);
  const { sendRequest } = useRequest();

  async function moveDeleteCard (destinationComponentId) {
    const action = 'move_or_delete_card';
    const destination = destinationComponentId;
    const moveInfo = JSON.stringify({
      action,
      card_id: _id,
      component: cubeState.active_component_id,
      destination
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
      'PATCH',
      moveInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    dispatch('UPDATE_CUBE', updatedCube);
  }

  async function submitCardChange (event) {
    const action = 'edit_card';
    const property_name = event.target.getAttribute('name');
    let cardChanges = {
      action,
      card_id: _id,
      component: cubeState.active_component_id
    };
    cardChanges[property_name] = event.target.value;
    cardChanges = JSON.stringify(cardChanges);
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
      'PATCH',
      cardChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    dispatch('UPDATE_CUBE', updatedCube);
  }

  return (
    <MUITableRow>
      <MUITableCell
        back_image={back_image}
        className={classes.tableCell}
        image={image}
        onMouseOut={props.hidePreview}
        onMouseOver={props.showPreview}
        style={{ cursor: 'default' }}
      >
        {name}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <ColorCheckboxes
          color_identity={color_identity}
          card_id={_id}
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <MUITextField
          defaultValue={cmc}
          inputProps={{ max: 16, min: 0, step: 1 }}
          margin="dense"
          name="cmc"
          onBlur={submitCardChange}
          type="number"
          variant="outlined"
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <MUITextField
          autoComplete="off"
          defaultValue={type_line}
          margin="dense"
          name="type_line"
          onBlur={submitCardChange}
          type="text"
          variant="outlined"
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <MUIList component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <MUIListItemText
              // primary="Move to"
              secondary={cubeState.active_component_name}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {[{ name: 'Mainboard', _id: 'mainboard' },
            { name: 'Sideboard', _id: 'sideboard' },
            ...cubeState.cube.modules.map(function (module) {
              return { name: module.name, _id: module._id };
            }),
            ...cubeState.cube.rotations.map(function (rotation) {
              return { name: rotation.name, _id: rotation._id };
            })].map((component) => (
              <MUIMenuItem
                key={`${_id}-${component._id}`}
                onClick={() => moveDeleteCard(component._id)}
                selected={component.active_component_id === component._id}
              >
                {component.name}
              </MUIMenuItem>
            ))
          }
          <MUIMenuItem
            onClick={() => moveDeleteCard('delete')}
          >
            Delete from Cube
          </MUIMenuItem>
        </MUIMenu>
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <PrintSelector
          card={props.card}
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <a href={purchase_link}>
          <TCGPlayerLogo />
        </a>
      </MUITableCell>
    </MUITableRow>
  );
}

export default AuthorizedCardRow;