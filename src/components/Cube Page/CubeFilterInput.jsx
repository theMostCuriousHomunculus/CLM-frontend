import React, { useContext, useRef, useState } from 'react';
import MUIInputAdornment from '@mui/material/InputAdornment';
import MUITextField from '@mui/material/TextField';

import { CubeContext } from '../../contexts/cube-context';

export default function CubeFilterInput() {
  const {
    activeComponentState,
    displayState: { filter },
    setDisplayState
  } = useContext(CubeContext);
  const timer = useRef();
  const [cubeFilterInputState, setCubeFilterInputState] = useState(filter);

  return (
    <MUITextField
      autoComplete="off"
      fullWidth
      InputProps={{
        endAdornment: (
          <MUIInputAdornment position="end">
            <span>
              Matches:{' '}
              <strong>{activeComponentState.displayedCards.length}</strong>
            </span>
          </MUIInputAdornment>
        )
      }}
      label="Filter by keywords, name or type"
      margin="normal"
      onChange={(event) => {
        event.persist();
        clearTimeout(timer.current);
        setCubeFilterInputState(event.target.value);
        timer.current = setTimeout(() => {
          setDisplayState((prevState) => ({
            ...prevState,
            filter: event.target.value
          }));
        }, 100);
      }}
      type="text"
      value={cubeFilterInputState}
    />
  );
}
