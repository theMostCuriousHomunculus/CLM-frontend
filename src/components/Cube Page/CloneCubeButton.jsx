import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUICloudDoneOutlinedIcon from '@mui/icons-material/CloudDoneOutlined';
import MUIFileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import { useNavigate } from 'react-router-dom';

import cloneCube from '../../graphql/mutations/cube/clone-cube';
import cubeQuery from '../../constants/cube-query';
import { ErrorContext } from '../../contexts/Error';

export default function CloneCubeButton({ CubeID }) {
  const { setErrorMessages } = useContext(ErrorContext);
  const navigate = useNavigate();
  const [cloning, setCloning] = useState(false);
  const [success, setSuccess] = useState(false);

  return (
    <MUIButton
      color={success ? 'success' : 'primary'}
      disabled={cloning}
      onClick={async () => {
        if (!success) {
          try {
            setCloning(true);
            const data = await cloneCube({
              headers: { CubeID },
              queryString: `{${cubeQuery}}`
            });
            setSuccess(true);
            setTimeout(() => {
              navigate(`/cube/${data.data.cloneCube._id}`, {
                state: { cubeData: data.data.cloneCube }
              });
              setSuccess(false);
            }, 1000);
          } catch (error) {
            setErrorMessages((prevState) => [...prevState, error.message]);
          } finally {
            setCloning(false);
          }
        }
      }}
      startIcon={(() => {
        if (cloning) {
          return <MUICircularProgress size={13} style={{ color: 'inherit' }} />;
        }
        if (success) {
          return <MUICloudDoneOutlinedIcon />;
        }
        return <MUIFileCopyOutlinedIcon />;
      })()}
    >
      Clone Cube
    </MUIButton>
  );
}
