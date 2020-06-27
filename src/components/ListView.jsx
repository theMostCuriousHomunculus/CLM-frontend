import React, { useContext } from 'react';

import PrintSelector from './PrintSelector';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const ListView = (props) => {

  const authentication = useContext(AuthenticationContext);
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
    <div className="list-view-main-container">
      <table>
        <thead>
          <tr>
            <th>Card Name</th>
            <th>Color Identity</th>
            <th>CMC</th>
            <th>Card Type</th>
            <th>Move / Delete</th>
            <th>Printing</th>
            <th>Purchase</th>
          </tr>
        </thead>
        <tbody>
          {props.componentState.displayed_cards.map(function (card) {
            return (
              <tr key={card._id}>
                <td
                  back_image={card.back_image}
                  image={card.image}
                  key={card._id}
                  onMouseOut={props.hidePreview}
                  onMouseOver={props.showPreview}
                >
                  {card.name}
                </td>
                <td>
                  {props.componentState.cube.creator === authentication.userId ?
                    <React.Fragment>
                      {["W", "U", "B", "R", "G"].map(function (color) {
                        return (
                          <React.Fragment key={color}>
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
                          </React.Fragment>
                        );
                      })}
                    </React.Fragment> :
                    <React.Fragment>
                      {card.color}
                    </React.Fragment>
                  }
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td>
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
                </td>
                <td><a href={card.purchase_link}>Buy It Now!</a></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ListView;