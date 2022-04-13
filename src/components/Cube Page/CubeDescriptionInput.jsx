import React, { useContext, useEffect, useRef, useState } from 'react';
import MUITextField from '@mui/material/TextField';

import editCube from '../../graphql/mutations/cube/edit-cube';
import { CubeContext } from '../../contexts/cube-context';
import { ErrorContext } from '../../contexts/Error';

export default function CubeDescriptionInput() {
  const {
    cubeState: { _id: cubeID, description }
  } = useContext(CubeContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const cubeDescriptionInputRef = useRef();
  const [cubeDescriptionInputState, setCubeDescriptionInputState] =
    useState(description);

  useEffect(() => {
    setCubeDescriptionInputState(description);
  }, [description]);

  return (
    <MUITextField
      fullWidth={true}
      inputProps={{
        onBlur: async () => {
          try {
            const data = await editCube({
              headers: { CubeID: cubeID },
              queryString: `{\n_id\ndescription\n}`,
              variables: { description: cubeDescriptionInputState }
            });
            setCubeDescriptionInputState(data.data.editCube.description);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          }
        }
      }}
      label="Cube Description"
      margin="normal"
      multiline
      onChange={(event) => setCubeDescriptionInputState(event.target.value)}
      ref={cubeDescriptionInputRef}
      rows={2}
      value={cubeDescriptionInputState}
    />
  );
}
