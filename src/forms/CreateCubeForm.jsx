import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUICloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIPostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined';
import MUITextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import createCube from '../graphql/mutations/cube/create-cube';
import { ErrorContext } from '../contexts/Error';

export default function CreateCubeForm({ open, toggleOpen }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const [cobraID, setCobraID] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <MUIDialog open={open} onClose={toggleOpen}>
      <form
        name="create-cube-form"
        onSubmit={async (event) => {
          event.preventDefault();
          try {
            setPosting(true);
            const data = await createCube({
              queryString: `{
                _id
              }`,
              variables: { cobraID, description, name }
            });
            setSuccess(true);
            setTimeout(() => {
              navigate(`/cube/${data.data.createCube._id}`);
            }, 1000);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          } finally {
            setPosting(false);
          }
        }}
      >
        <MUIDialogTitle>
          <MUITextField
            autoComplete="off"
            autoFocus
            disabled={posting || success}
            fullWidth
            label="Cube Name"
            onChange={(event) => setName(event.target.value)}
            required={true}
            type="text"
            value={name}
          />
        </MUIDialogTitle>

        <MUIDialogContent>
          <MUITextField
            autoComplete="off"
            disabled={posting || success}
            fullWidth
            label="Cube Description"
            margin="normal"
            multiline
            onChange={(event) => setDescription(event.target.value)}
            required={false}
            rows={2}
            type="text"
            value={description}
          />

          <MUITextField
            autoComplete="off"
            disabled={posting || success}
            fullWidth
            helperText="https://cubecobra.com/cube/overview/this-is-your-full-cube-id-paste-it-here"
            label="Have a cube on CubeCobra.com?"
            margin="normal"
            onChange={(event) => setCobraID(event.target.value)}
            required={false}
            type="text"
            value={cobraID}
          />
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton
            color={success ? 'success' : 'primary'}
            disabled={posting}
            startIcon={(() => {
              if (posting) {
                return (
                  <MUICircularProgress size={13} style={{ color: 'inherit' }} />
                );
              }
              if (success) {
                return <MUICloudDoneOutlinedIcon />;
              }
              return <MUIPostAddOutlinedIcon />;
            })()}
            type="submit"
          >
            Create
          </MUIButton>
          <MUIButton
            color="warning"
            disabled={posting || success}
            onClick={toggleOpen}
            startIcon={<MUICancelOutlinedIcon />}
          >
            Cancel
          </MUIButton>
        </MUIDialogActions>
      </form>
    </MUIDialog>
  );
}
