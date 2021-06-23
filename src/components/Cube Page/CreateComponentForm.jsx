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
import { useParams } from 'react-router-dom';

import WarningButton from '../miscellaneous/WarningButton';
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function CreateComponentForm ({
  open,
  toggleOpen
}) {

  const authentication = React.useContext(AuthenticationContext);
  const cubeId = useParams().cubeId;
  const [newComponentName, setNewComponentName] = React.useState('');
  const [newComponentType, setNewComponentType] = React.useState();

  async function addComponent () {
    
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
          onChange={(event) => setNewComponentName(event.target.value)}
          required={true}
          type="text"
          value={newComponentName}
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

        <WarningButton onClick={toggleOpen}>
          Cancel
        </WarningButton>

        <MUIButton color="primary" onClick={addComponent} size="small" variant="contained">
          Create!
        </MUIButton>

      </MUIDialogActions>
    </MUIDialog>
  );
};