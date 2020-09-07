import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../../contexts/authentication-context';
import { useCube } from '../../hooks/cube-hook';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  avatarLarge: {
    height: "150px",
    width: "150px"
  }
});

const CubeInfo = (props) => {

  const cubeId = useParams().cubeId;
  const authentication = React.useContext(AuthenticationContext);
  const descriptionInput = React.useRef(null);
  const nameInput = React.useRef(null);
  const classes = useStyles();
  const [cubeState, dispatch] = useCube(true);
  const { sendRequest } = useRequest();

  async function submitCubeChanges () {
    const cubeChanges = JSON.stringify({
      action: 'edit_cube_info',
      cube_id: cubeId,
      description: descriptionInput.current.value,
      name: nameInput.current.value
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
      'PATCH',
      cubeChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    dispatch('UPDATE_CUBE', updatedCube);
  }

  return (
    <MUICard>

      <MUICardHeader
        avatar={props.creator.avatar &&
          <MUIAvatar alt={props.creator.name} className={classes.avatarLarge} src={props.creator.avatar} />
        }
        disableTypography={true}
        title={authentication.userId === props.creator._id ?
          <MUITextField
            defaultValue={cubeState.cube.name}
            inputRef={nameInput}
            label="Cube Name"
            onBlur={submitCubeChanges}
            type="text"
            variant="outlined"
          /> :
          <MUITypography variant="subtitle1">{cubeState.cube.name}</MUITypography>
        }
        subheader={
          <MUITypography color="textSecondary" variant="subtitle2">
            Designed by: <Link to={`/account/${props.creator._id}`}>{props.creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        {authentication.userId === props.creator._id ?
          <MUITextField
            defaultValue={cubeState.cube.description}
            fullWidth={true}
            inputRef={descriptionInput}
            label="Cube Description"
            multiline
            onBlur={submitCubeChanges}
            rows={3}
            variant="outlined"
          /> :
          <React.Fragment>
            <MUITypography variant="subtitle1">Description:</MUITypography>
            <MUITypography variant="body1">{cubeState.cube.description}</MUITypography>
          </React.Fragment>
        }        
      </MUICardContent>

    </MUICard>
  );
}

export default CubeInfo;