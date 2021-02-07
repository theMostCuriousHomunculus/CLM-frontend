import React from 'react';
import MUIAvatar from '@material-ui/core/Avatar';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  avatarLarge: {
    height: "75px",
    width: "75px"
  },
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
  }
});

const CubeInfo = (props) => {

  const cubeId = useParams().cubeId;
  const authentication = React.useContext(AuthenticationContext);
  const descriptionRef = React.useRef();
  const nameRef = React.useRef();
  const classes = useStyles();
  const { sendRequest } = useRequest();

  async function submitCubeChanges () {
    try {
      const cubeChanges = JSON.stringify({
        action: 'edit_cube_info',
        description: descriptionRef.current.value,
        name: nameRef.current.value
      });
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        cubeChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.dispatchUpdateCubeInfo({ description: descriptionRef.current.value, name: nameRef.current.value });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <MUICard style={{ marginBottom: 0 }}>

      <MUICardHeader
        avatar={props.cube.creator.avatar &&
          <MUIAvatar alt={props.cube.creator.name} className={classes.avatarLarge} src={props.cube.creator.avatar} />
        }
        className={classes.cardHeader}
        disableTypography={true}
        title={authentication.userId === props.cube.creator._id ?
          <MUITextField
            inputProps={{
              defaultValue: props.cube.name,
              onBlur: submitCubeChanges
            }}
            inputRef={nameRef}
            label="Cube Name"
            type="text"
            variant="outlined"
          /> :
          <MUITypography variant="subtitle1">{props.cube.name}</MUITypography>
        }
        subheader={
          <MUITypography color="textSecondary" variant="subtitle2">
            Designed by: <Link to={`/account/${props.cube.creator._id}`}>{props.cube.creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        {authentication.userId === props.cube.creator._id ?
          <MUITextField
            fullWidth={true}
            inputProps={{
              defaultValue: props.cube.description,
              onBlur: submitCubeChanges
            }}
            inputRef={descriptionRef}
            label="Cube Description"
            multiline
            rows={3}
            variant="outlined"
          /> :
          <React.Fragment>
            <MUITypography variant="subtitle1">Description:</MUITypography>
            <MUITypography variant="body1">{props.cube.description}</MUITypography>
          </React.Fragment>
        }        
      </MUICardContent>

    </MUICard>
  );
}

function mapStateToProps (state) {
  return {
    cube: state.cube
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchUpdateCubeInfo: (payload) => dispatch(actionCreators.update_cube_info(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CubeInfo);