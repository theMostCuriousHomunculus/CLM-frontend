import React from 'react';
import { useParams } from 'react-router-dom';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableRow from '@material-ui/core/TableRow';
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
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [cubeState, dispatch] = useCube(false);
  const { sendRequest } = useRequest();

  async function moveDeleteCard (event) {
    const action = 'move_or_delete_card';
    const card_id = event.target.getAttribute('data-card_id');
    const destination = event.target.options[event.target.selectedIndex].value;
    const moveInfo = JSON.stringify({
      action,
      card_id,
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
    const card_id = event.target.getAttribute('data-card_id');
    const property_name = event.target.getAttribute('name');
    let cardChanges = {
      action,
      card_id,
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
    <MUITableRow key={_id}>
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
        <input
          data-card_id={_id}
          defaultValue={cmc}
          max="16"
          min="0"
          name="cmc"
          onBlur={submitCardChange}
          step="1"
          type="number"
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <input
          data-card_id={_id}
          defaultValue={type_line}
          name="type_line"
          onBlur={submitCardChange}
          type="text"
        />
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <select
          data-card_id={_id}
          onChange={moveDeleteCard}
          value={cubeState.active_component_id}
        >
          <option value='mainboard'>Mainboard</option>
          <option value='sideboard'>Sideboard</option>
          {cubeState.cube.modules.map(function (module) {
            return <option key={module._id} value={module._id}>{module.name}</option>;
          })}
          {cubeState.cube.rotations.map(function (rotation) {
            return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>;
          })}
          <option value='delete'>Delete From Cube</option>
        </select>
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <PrintSelector
          card={props.card}
          cube_id={cubeId}
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