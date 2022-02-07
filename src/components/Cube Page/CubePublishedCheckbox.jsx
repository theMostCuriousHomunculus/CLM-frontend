import React, { useContext, useEffect, useState } from 'react';
import MUICheckbox from '@mui/material/Checkbox';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUITooltip from '@mui/material/Tooltip';

import editCube from '../../graphql/mutations/cube/edit-cube';
import { CubeContext } from '../../contexts/cube-context';
import { ErrorContext } from '../../contexts/Error';

export default function CubePublishedCheckbox() {
  const {
    cubeState: { _id: cubeID, published }
  } = useContext(CubeContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const [publishedCheckedState, setPublishedCheckedState] = useState(published);

  useEffect(() => {
    setPublishedCheckedState(published);
  }, [published]);

  useEffect(() => {
    (async function () {
      try {
        await editCube({
          headers: { CubeID: cubeID },
          queryString: `{\n_id\npublished\n}`,
          variables: { published: publishedCheckedState }
        });
      } catch (error) {
        setErrorMessages((prevState) => [...prevState, error.message]);
        setPublishedCheckedState(published);
      }
    })();
  }, [publishedCheckedState]);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex'
      }}
    >
      <MUIFormControlLabel
        control={
          <MUICheckbox
            checked={publishedCheckedState}
            onChange={() => setPublishedCheckedState((prevState) => !prevState)}
          />
        }
        label="Published"
        style={{ marginRight: 8 }}
      />
      <MUITooltip title="A published cube is visible to other users.">
        <MUIHelpOutlineIcon color="primary" />
      </MUITooltip>
    </div>
  );
}
