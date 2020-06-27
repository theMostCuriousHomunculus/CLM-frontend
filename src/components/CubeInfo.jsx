import React, { useContext, useState } from 'react';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const CubeInfo = (props) => {

  const authentication = useContext(AuthenticationContext);
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [cubeDescription, setCubeDescription] = useState(props.cube.description);
  const [cubeName, setCubeName] = useState(props.cube.name);

  function changeCubeDescription (event) {
    setCubeDescription(event.target.value);
  }

  function changeCubeName (event) {
    setCubeName(event.target.value);
  }

  async function submitCubeChanges () {
    const cubeChanges = JSON.stringify({
      action: 'edit_cube_info',
      cube_id: props.cube._id,
      description: cubeDescription,
      name: cubeName
    });
    await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      cubeChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
  }

  return (
    <React.Fragment>
      {authentication.userId === props.cube.creator &&
        <React.Fragment>
          <input
            onBlur={submitCubeChanges}
            onChange={changeCubeName}
            placeholder="Cube Name"
            type="text"
            value={cubeName}
          />
          <textarea
            onBlur={submitCubeChanges}
            onChange={changeCubeDescription}
            placeholder="Cube Description"
            value={cubeDescription}
          />
        </React.Fragment>
      }
      {authentication.userId !== props.cube.creator &&
        <React.Fragment>
          <h2>{props.cube.name}</h2>
          <p>{props.cube.description}</p>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default CubeInfo;