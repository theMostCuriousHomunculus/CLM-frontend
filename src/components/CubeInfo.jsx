import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar as MUIAvatar } from '@material-ui/core/Avatar';
import { Card as MUICard } from '@material-ui/core/Card';
import { CardContent as MUICardContent } from '@material-ui/core/CardContent';
import { CardHeader as MUICardHeader } from '@material-ui/core/CardHeader';
import { TextField as MUITextField } from '@material-ui/core/TextField';
import { Typography as MUITypography } from '@material-ui/core/Typography';
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

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { sendRequest } = useRequest();

  const [cubeDescription, setCubeDescription] = React.useState(props.cube.description);
  const [cubeName, setCubeName] = React.useState(props.cube.name);

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
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
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
          <MUITextField
            label="Cube Name"
            onBlur={submitCubeChanges}
            onChange={changeCubeName}
            type="text"
            value={cubeName}
            variant="outlined"
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
        {authentication.userId === props.cube.creator ?
          <MUITextField
            fullWidth={true}
            label="Cube Description"
            multiline
            onBlur={submitCubeChanges}
            onChange={changeCubeDescription}
            rows={3}
            value={cubeDescription}
            variant="outlined"
          /> :
          <React.Fragment>
            <MUITypography variant="h3">Description:</MUITypography>
            <MUITypography variant="body1">{props.cube.description}</MUITypography>
          </React.Fragment>
        }        
      </MUICardContent>

    </MUICard>
  );
}

export default CubeInfo;