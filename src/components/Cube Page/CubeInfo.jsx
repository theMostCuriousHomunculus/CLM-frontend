import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import useRequest from '../../hooks/request-hook';
import Avatar from '../miscellaneous/Avatar';

export default function CubeInfo ({
  creator,
  description,
  editable,
  name
}) {

  const descriptionRef = React.useRef();
  const cubeID = useParams().cubeId;
  const nameRef = React.useRef();
  const { sendRequest } = useRequest();

  async function editCube () {
    await sendRequest({
      headers: { CubeID: cubeID },
      operation: 'editCube',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  description: "${descriptionRef.current.value}",
                  name: "${nameRef.current.value}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }

  return (
    <MUICard>
      <MUICardHeader
        avatar={<Avatar alt={creator.name} size='large' src={creator.avatar} />}
        title={
          <MUITextField
            defaultValue={name}
            disabled={!editable}
            inputProps={{ onBlur: editCube }}
            inputRef={nameRef}
            label="Cube Name"
            margin="dense"
            type="text"
            variant="outlined"
          />
        }
        subheader={
          <MUITypography color="textSecondary" variant="subtitle1">
            Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
          </MUITypography>
        }
      />

      <MUICardContent>
        <MUITextField
          defaultValue={description}
          disabled={!editable}
          fullWidth={true}
          inputProps={{ onBlur: editCube }}
          inputRef={descriptionRef}
          label="Cube Description"
          margin="dense"
          multiline
          rows={2}
          variant="outlined"
        />       
      </MUICardContent>
    </MUICard>
  );
};