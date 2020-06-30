import React, { useContext } from 'react';
import {
  Card as MUICard,
  Grid as MUIGrid,
  Table as MUITable,
  TableBody as MUITableBody,
  TableCell as MUITableCell,
  TableContainer as MUITableContainer,
  TableHead as MUITableHead,
  TableRow as MUITableRow
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import PrintSelector from './PrintSelector';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import theme from '../theme';

const useStyles = makeStyles({
  basicCard: {
    margin: '1rem'
  },
  body: {
    '& *': {
      fontSize: '1.6rem'
    }
  },
  container: {
    maxHeight: '80vh'
  },
  head: {
    '& *': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      fontSize: '2.4rem'
    }
  },
  table: {
    minWidth: 650
  }
});

const ListView = (props) => {

  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function moveDeleteCard (event) {
    const action = 'move_or_delete_card';
    const card_id = event.target.getAttribute('data-card_id');
    const destination = event.target.options[event.target.selectedIndex].value;
    const moveInfo = JSON.stringify({
      action,
      card_id,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      destination
    });
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      moveInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  async function submitCardChange (event) {
    const action = 'edit_card';
    const card_id = event.target.getAttribute('data-card_id');
    const property_name = event.target.getAttribute('name');
    let cardChanges = {
      action,
      card_id,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id
    };
    cardChanges[property_name] = event.target.value;
    cardChanges = JSON.stringify(cardChanges);
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      cardChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  async function submitColorIdentityChange (event) {
    const action = 'edit_card';
    const card_id = event.target.getAttribute('data-card_id');
    const color_checkboxes = document.getElementsByClassName(event.target.getAttribute('class'));
    let color_identity = [];

    for (let checkbox of color_checkboxes) {
      if (checkbox.checked) {
        color_identity.push(checkbox.value);
      }
    }

    try {

      const cardChanges = JSON.stringify({
        action,
        card_id,
        color_identity: color_identity.sort(),
        component: props.componentState.active_component_id,
        cube_id: props.componentState.cube._id
      });
      const updatedCube = await sendRequest(
        'http://localhost:5000/api/cube/',
        'PATCH',
        cardChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.updateCubeHandler(updatedCube);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <MUICard className={classes.basicCard}>
      <MUITableContainer className={classes.container}>
        <MUITable stickyHeader className={classes.table}>
          <MUITableHead className={classes.head}>
            <MUITableRow>
              <MUITableCell>Card Name</MUITableCell>
              <MUITableCell>Color Identity</MUITableCell>
              <MUITableCell>CMC</MUITableCell>
              <MUITableCell>Card Type</MUITableCell>
              <MUITableCell>Move / Delete</MUITableCell>
              <MUITableCell>Printing</MUITableCell>
              <MUITableCell>Purchase</MUITableCell>
            </MUITableRow>
          </MUITableHead>
          <MUITableBody className={classes.body}>
            {props.componentState.displayed_cards.map(function (card) {
              return (
                <MUITableRow key={card._id}>
                  <MUITableCell
                    back_image={card.back_image}
                    image={card.image}
                    key={card._id}
                    onMouseOut={props.hidePreview}
                    onMouseOver={props.showPreview}
                  >
                    {card.name}
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <MUIGrid container justify="space-around">
                        {["W", "U", "B", "R", "G"].map(function (color) {
                          return (
                            <MUIGrid item key={color} xs={4}>
                              <input
                                checked={card.color_identity.includes(color) ? true : false}
                                className={`color-indicator-${card._id}`}
                                data-card_id={card._id}
                                name="color_identity[]"
                                onChange={submitColorIdentityChange}
                                type="checkbox"
                                value={color}
                              />
                              <label> : {color} </label>
                            </MUIGrid>
                          );
                        })}
                      </MUIGrid> :
                      <React.Fragment>
                        {card.color}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <input
                        data-card_id={card._id}
                        max="16"
                        min="0"
                        name="cmc"
                        onChange={submitCardChange}
                        step="1"
                        type="number"
                        value={card.cmc}
                      /> :
                      <React.Fragment>
                        {card.cmc}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <input
                        data-card_id={card._id}
                        name="type_line"
                        onChange={submitCardChange}
                        type="text"
                        value={card.type_line}
                      /> :
                      <React.Fragment>
                        {card.type_line}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <select
                        data-card_id={card._id}
                        onChange={moveDeleteCard}
                        value={props.componentState.active_component_id}
                      >
                        <option value='mainboard'>Mainboard</option>
                        <option value='sideboard'>Sideboard</option>
                        {props.componentState.cube.modules.map(function (module) {
                          return <option key={module._id} value={module._id}>{module.name}</option>;
                        })}
                        {props.componentState.cube.rotations.map(function (rotation) {
                          return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>;
                        })}
                        <option value='delete'>Delete From Cube</option>
                      </select> :
                      <React.Fragment>
                        {props.componentState.active_component_name}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <PrintSelector
                        card={card}
                        componentState={props.componentState}
                        updateCubeHandler={props.updateCubeHandler}
                      /> :
                      <React.Fragment>
                        {card.printing}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell><a href={card.purchase_link}>Buy It Now!</a></MUITableCell>
                </MUITableRow>
              );
            })}
          </MUITableBody>
        </MUITable>
      </MUITableContainer>
    </MUICard>
  );
}

export default ListView;