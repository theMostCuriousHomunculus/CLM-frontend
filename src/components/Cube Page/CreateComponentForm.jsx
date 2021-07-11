import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';
import MUIFormLabel from '@material-ui/core/FormLabel';
import MUIRadio from '@material-ui/core/Radio';
import MUIRadioGroup from '@material-ui/core/RadioGroup';
import MUITextField from '@material-ui/core/TextField';

import WarningButton from '../miscellaneous/WarningButton';
import { CubeContext } from '../../contexts/cube-context';

export default function CreateComponentForm ({
  open,
  setNameInput,
  setSizeInput,
  toggleOpen
}) {

  const { createModule, createRotation } = React.useContext(CubeContext);
  const [newNameInput, setNewNameInput] = React.useState();
  const [newComponentType, setNewComponentType] = React.useState('module');

  async function addComponent () {
    if (newComponentType === 'module') {
      await createModule(newNameInput, setNameInput, setSizeInput, toggleOpen);
    }

    if (newComponentType === 'rotation') {
      await createRotation(newNameInput, setNameInput, setSizeInput, toggleOpen);
    }
  }

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Component</MUIDialogTitle>
      <MUIDialogContent>

        <MUITextField
          autoComplete="off"
          autoFocus
          fullWidth
          label="New Component Name"
          margin="dense"
          onChange={event => setNewNameInput(event.target.value)}
          required={true}
          type="text"
          value={newNameInput}
          variant="outlined"
        />

        <MUIFormControl component="fieldset" required={true} style={{ marginTop: 8 }}>
          <MUIFormLabel component="legend">New Component Type</MUIFormLabel>
          <MUIRadioGroup
            name="Component Type"
            onChange={(event) => setNewComponentType(event.target.value)}
            value={newComponentType}
          >
            <MUIFormControlLabel value="module" control={<MUIRadio />} label="Module" />
            <MUIFormControlLabel value="rotation" control={<MUIRadio />} label="Rotation" />
          </MUIRadioGroup>
        </MUIFormControl>

      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton color="primary" onClick={addComponent} size="small" variant="contained">
          Create!
        </MUIButton>
        <WarningButton onClick={toggleOpen}>
          Cancel
        </WarningButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};