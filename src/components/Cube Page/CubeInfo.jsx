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

import ErrorDialog from '../miscellaneous/ErrorDialog';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { editCube } from '../../requests/cube-requests';

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

function CubeInfo (props) {

  const {
    cube,
    dispatchUpdateCubeInfo
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const descriptionRef = React.useRef();
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [errorMessage, setErrorMessage] = React.useState();
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
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>
    
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />
    
      <MUICard style={{ marginBottom: 0 }}>

        <MUICardHeader
          avatar={cube.creator.avatar &&
            <MUIAvatar alt={cube.creator.name} className={classes.avatarLarge} src={cube.creator.avatar} />
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
    
    </React.Fragment>
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