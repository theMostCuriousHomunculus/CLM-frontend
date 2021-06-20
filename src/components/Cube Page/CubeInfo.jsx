import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import LargeAvatar from '../miscellaneous/LargeAvatar';
import { actionCreators } from '../../redux-store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { editCube } from '../../requests/REST/cube-requests';

const useStyles = makeStyles({
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
  }
});

function CubeInfo ({
  cube,
  dispatchUpdateCubeInfo
}) {

  const authentication = React.useContext(AuthenticationContext);
  const descriptionRef = React.useRef();
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const nameRef = React.useRef();

  async function submitCubeChanges () {
    try {
      const cubeChanges = {
        description: descriptionRef.current.value,
        name: nameRef.current.value
      };
      await editCube(cubeChanges, cubeId, authentication.token);
      dispatchUpdateCubeInfo({ description: descriptionRef.current.value, name: nameRef.current.value });
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <MUICard>
      <MUICardHeader
        avatar={cube.creator.avatar &&
          <LargeAvatar alt={cube.creator.name} src={cube.creator.avatar} />
        }
        className={classes.cardHeader}
        disableTypography={true}
        title={authentication.userId === cube.creator._id ?
          <MUITextField
            inputProps={{
              defaultValue: cube.name,
              onBlur: submitCubeChanges
            }}
            inputRef={nameRef}
            label="Cube Name"
            margin="dense"
            type="text"
            variant="outlined"
          /> :
          <MUITypography variant="subtitle1">{cube.name}</MUITypography>
        }
        subheader={
          <MUITypography color="textSecondary" variant="subtitle2">
            Designed by: <Link to={`/account/${cube.creator._id}`}>{cube.creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        {authentication.userId === cube.creator._id ?
          <MUITextField
            fullWidth={true}
            inputProps={{
              defaultValue: cube.description,
              onBlur: submitCubeChanges
            }}
            inputRef={descriptionRef}
            label="Cube Description"
            margin="dense"
            multiline
            rows={3}
            variant="outlined"
          /> :
          <React.Fragment>
            <MUITypography variant="subtitle1">Description:</MUITypography>
            <MUITypography variant="body1">{cube.description}</MUITypography>
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