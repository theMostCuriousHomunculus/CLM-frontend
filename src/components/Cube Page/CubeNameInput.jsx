import React, { useContext, useEffect, useRef, useState } from 'react';
import MUITextField from '@mui/material/TextField';

import editCube from '../../graphql/mutations/cube/edit-cube';
import { CubeContext } from '../../contexts/cube-context';
import { ErrorContext } from '../../contexts/Error';

export default function CubeNameInput() {
  const {
    cubeState: { _id: cubeID, name: cubeName }
  } = useContext(CubeContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const cubeNameInputRef = useRef();
  const [cubeNameInputState, setCubeNameInputState] = useState(cubeName);

  useEffect(() => {
    setCubeNameInputState(cubeName);
  }, [cubeName]);

  return (
    <MUITextField
      inputProps={{
        onBlur: async () => {
          try {
            const data = await editCube({
              headers: { CubeID: cubeID },
              queryString: `{\n_id\nname\n}`,
              variables: { name: cubeNameInputState }
            });
            setCubeNameInputState(data.data.editCube.name);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
            setCubeNameInputState(cubeName);
          }
        }
      }}
      label="Cube Name"
      onChange={(event) => setCubeNameInputState(event.target.value)}
      ref={cubeNameInputRef}
      type="text"
      value={cubeNameInputState}
    />
  );
}
