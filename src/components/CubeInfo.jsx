import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar as MUIAvatar,
  Card as MUICard,
  CardContent as MUICardContent,
  CardHeader as MUICardHeader,
  Typography as MUITypography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  avatarLarge: {
    height: "150px",
    width: "150px"
  },
  basicCard: {
    margin: '1rem'
  }
});

const CubeInfo = (props) => {

  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [cubeDescription, setCubeDescription] = useState(props.cube.description);
  const [cubeName, setCubeName] = useState(props.cube.name);

  function changeCubeDescription (event) {
    setCubeDescription(event.target.value);
  }

  function changeCubeName (event) {
    setCubeName(event.target.value);
  }

  async function submitCubeChanges () {
    const cubeChanges = JSON.stringify({
      action: 'edit_cube_info',
      cube_id: props.cube._id,
      description: cubeDescription,
      name: cubeName
    });
    await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      cubeChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
  }

  return (
    <MUICard className={classes.basicCard}>

      <MUICardHeader
        avatar={props.creator.avatar &&
          <MUIAvatar alt={props.creator.name} className={classes.avatarLarge} src={props.creator.avatar} />
        }
        title={authentication.userId === props.cube.creator ?
          <input
            onBlur={submitCubeChanges}
            onChange={changeCubeName}
            placeholder="Cube Name"
            type="text"
            value={cubeName}
          /> :
          <MUITypography variant="h2">{props.cube.name}</MUITypography>
        }
        subheader={
          <MUITypography variant="h3">
            Designed by: <Link to={`/account/${props.creator._id}`}>{props.creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        <MUITypography variant="h3">Description: {authentication.userId === props.cube.creator ?
          <textarea
            onBlur={submitCubeChanges}
            onChange={changeCubeDescription}
            placeholder="Cube Description"
            value={cubeDescription}
          /> :
          <MUITypography variant="body1">{props.cube.description}</MUITypography>
        }        
        </MUITypography>
      </MUICardContent>

    </MUICard>
  );
}

export default CubeInfo;