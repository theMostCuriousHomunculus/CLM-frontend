import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIFormLabel from '@mui/material/FormLabel';
import MUIRadio from '@mui/material/Radio';
import MUIRadioGroup from '@mui/material/RadioGroup';
import MUITextField from '@mui/material/TextField';

import { CubeContext } from '../../contexts/cube-context';

export default function CreateComponentForm({ open, toggleOpen }) {
  const { createModule, createRotation } = React.useContext(CubeContext);
  const [newNameInput, setNewNameInput] = React.useState();
  const [newComponentType, setNewComponentType] = React.useState('module');

  async function addComponent() {
    if (newComponentType === 'module') {
      await createModule(newNameInput, toggleOpen);
    }

    if (newComponentType === 'rotation') {
      await createRotation(newNameInput, toggleOpen);
    }
  }

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <MUIDialogTitle>Create A New Component</MUIDialogTitle>

      <MUIDialogContent style={{ paddingTop: 8 }}>
        <MUITextField
          autoComplete="off"
          autoFocus
          fullWidth
          label="New Component Name"
          onChange={(event) => setNewNameInput(event.target.value)}
          required={true}
          type="text"
          value={newNameInput}
        />

        <MUIFormControl
          component="fieldset"
          required={true}
          style={{ marginTop: 8 }}
        >
          <MUIFormLabel component="legend">New Component Type</MUIFormLabel>

          <MUIRadioGroup
            name="Component Type"
            onChange={(event) => setNewComponentType(event.target.value)}
            value={newComponentType}
          >
            <MUIFormControlLabel
              value="module"
              control={<MUIRadio />}
              label="Module"
            />

            <MUIFormControlLabel
              value="rotation"
              control={<MUIRadio />}
              label="Rotation"
            />
          </MUIRadioGroup>
        </MUIFormControl>
      </MUIDialogContent>

      <MUIDialogActions>
        <MUIButton
          onClick={addComponent}
          startIcon={<MUICheckCircleOutlinedIcon />}
        >
          Create!
        </MUIButton>
        <MUIButton
          color="warning"
          onClick={toggleOpen}
          startIcon={<MUICancelOutlinedIcon />}
        >
          Cancel
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
}
