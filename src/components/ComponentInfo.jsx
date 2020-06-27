import React, { useContext, useState } from 'react';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const ComponentInfo = (props) => {

  const authentication = useContext(AuthenticationContext);
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function deleteComponent () {
    const action = props.componentState.active_component_type === 'module' ? 'delete_module' : 'delete_rotation';
    const deleteInfo = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id
    });
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      deleteInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  async function submitComponentChanges () {
    const action = props.componentState.active_component_type === 'module' ? 'edit_module' : 'edit_rotation';
    const componentChanges = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      name: props.componentState.active_component_name,
      size: props.componentState.active_rotation_size
    });
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      componentChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  return (
    <React.Fragment>
      {authentication.userId === props.componentState.cube.creator &&
        props.componentState.active_component_type !== 'mainboard' &&
        props.componentState.active_component_type !== 'sideboard' &&
        <React.Fragment>
          <input
            onBlur={submitComponentChanges}
            // onChange={props.changeComponentName}
            placeholder={props.componentState.active_component_type === 'module' ? 'Module Name' : 'Rotation Name'}
            type="text"
            value={props.componentState.active_component_name}
          />
          {props.componentState.active_component_type === 'rotation' &&
            <input
              min="0"
              onBlur={submitComponentChanges}
              // onChange={props.changeRotationSize}
              step="1"
              type="number"
              value={props.componentState.active_rotation_size}
            />
          }
          <button onClick={deleteComponent}>
            Delete this {props.componentState.active_component_type === 'module' ? 'Module' : 'Rotation'}
          </button>
        </React.Fragment>
      }
      {(authentication.userId !== props.componentState.cube.creator ||
        props.componentState.active_component_type === 'mainboard' ||
        props.componentState.active_component_type === 'sideboard') && 
        <h3>{props.componentState.active_component_name}</h3>
      }
      <select onChange={props.changeComponent} value={props.componentState.active_component_id}>
        <option value="mainboard">Mainboard</option>
        <option value="sideboard">Sideboard</option>
        {
          props.componentState.cube.modules.map(function (module) {
            return <option key={module._id} value={module._id}>{module.name}</option>
          })
        }
        {
          props.componentState.cube.rotations.map(function (rotation) {
            return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>
          })
        }
      </select>
    </React.Fragment>
  );
}

export default ComponentInfo;