import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import useRequest from '../../hooks/request-hook';
import LargeAvatar from '../miscellaneous/LargeAvatar';
import { AuthenticationContext } from '../../contexts/authentication-context';

const useStyles = makeStyles({
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
  }
});

export default function CubeInfo ({
  creator,
  description,
  name
}) {

  const authentication = React.useContext(AuthenticationContext);
  const descriptionRef = React.useRef();
  const classes = useStyles();
  const cubeID = useParams().cubeId;
  const nameRef = React.useRef();
  const { sendRequest } = useRequest();

  async function submitCubeChanges () {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'editCube',
      get body() {
        return {
          query: `
            ${this.operation}(
              input: {
                description: "${descriptionRef.current.value}",
                name: "${nameRef.current.value}"
              }
            ) {
              _id
            }
          `
        }
      }
    });
  }

  return (
    <MUICard>
      <MUICardHeader
        avatar={<LargeAvatar alt={creator.name} src={creator.avatar} />}
        className={classes.cardHeader}
        disableTypography={true}
        title={authentication.userId === creator._id ?
          <MUITextField
            inputProps={{
              defaultValue: name,
              onBlur: submitCubeChanges
            }}
            inputRef={nameRef}
            label="Cube Name"
            margin="dense"
            type="text"
            variant="outlined"
          /> :
          <MUITypography variant="subtitle1">{name}</MUITypography>
        }
        subheader={
          <MUITypography color="textSecondary" variant="subtitle2">
            Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        {authentication.userId === creator._id ?
          <MUITextField
            fullWidth={true}
            inputProps={{
              defaultValue: description,
              onBlur: submitCubeChanges
            }}
            inputRef={descriptionRef}
            label="Cube Description"
            margin="dense"
            multiline
            rows={2}
            variant="outlined"
          /> :
          <React.Fragment>
            <MUITypography variant="subtitle1">Description:</MUITypography>
            <MUITypography variant="body1">{description}</MUITypography>
          </React.Fragment>
        }        
      </MUICardContent>
    </MUICard>
  );
};