import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

import generateCSVList from '../../functions/generate-csv-list';
import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { CubeContext } from '../../contexts/cube-context';

export default function CubeInfo () {

  const { userId } = React.useContext(AuthenticationContext);
  const {
    cubeState: {
      creator,
      description,
      mainboard,
      modules,
      name,
      rotations,
      sideboard
    },
    editCube
  } = React.useContext(CubeContext);
  const [descriptionInput, setDescriptionInput] = React.useState(description);
  const [nameInput, setNameInput] = React.useState(name);

  React.useEffect(() => {
    setDescriptionInput(description);
  }, [description]);

  React.useEffect(() => {
    setNameInput(name);
  }, [name]);

  return (
    <MUICard>
      <MUICardHeader
        avatar={<Avatar alt={creator.name} size='large' src={creator.avatar} />}
        title={
          <MUITextField
            disabled={userId !== creator._id}
            inputProps={{ onBlur: () => editCube(descriptionInput, nameInput) }}
            label="Cube Name"
            onChange={event => setNameInput(event.target.value)}
            type="text"
            value={nameInput}
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
          disabled={userId !== creator._id}
          fullWidth={true}
          inputProps={{ onBlur: () => editCube(descriptionInput, nameInput) }}
          label="Cube Description"
          multiline
          onChange={event => setDescriptionInput(event.target.value)}
          rows={2}
          value={descriptionInput}
        />       
      </MUICardContent>

      <MUICardActions>
        <MUITypography variant="body1">
          <CSVLink
            data={generateCSVList(
              mainboard,
              modules.map(module => module.cards).flat()
                .concat(rotations.map(rotation => rotation.cards).flat())
                .concat(sideboard)
            )}
            filename={`${name}.csv`}
            target="_blank"
          >
            Export Cube List to CSV
          </CSVLink>
        </MUITypography>
      </MUICardActions>
    </MUICard>
  );
};