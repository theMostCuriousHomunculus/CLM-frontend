import React from 'react';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';

import { CubeContext } from '../../contexts/cube-context';

export default function MoveDeleteMenu({
  destination,
  editable,
  setDestination
}) {
  const {
    cubeState: { modules, rotations }
  } = React.useContext(CubeContext);

  return (
    <MUIFormControl variant="outlined">
      <MUIInputLabel htmlFor="move-delete-selector">
        Cube Component
      </MUIInputLabel>
      <MUISelect
        disabled={!editable}
        inputProps={{ id: 'move-delete-selector' }}
        label="Cube Component"
        native
        onChange={(event) => setDestination(event.target.value)}
        style={{ marginBottom: 12 }}
        value={destination}
      >
        <optgroup label="Built-In">
          <option value="mainboard">Mainboard</option>
          <option value="sideboard">Sideboard</option>
        </optgroup>
        {modules.length > 0 && (
          <optgroup label="Modules">
            {modules.map((module) => (
              <option key={module._id} value={module._id}>
                {module.name}
              </option>
            ))}
          </optgroup>
        )}
        {rotations.length > 0 && (
          <optgroup label="Rotations">
            {rotations.map((rotation) => (
              <option key={rotation._id} value={rotation._id}>
                {rotation.name}
              </option>
            ))}
          </optgroup>
        )}
        <option value="">Delete From Cube</option>
      </MUISelect>
    </MUIFormControl>
  );
}
