import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

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

  const mainboardString = mainboard.reduce(function (a, c) {
    return c && c.mtgo_id ? `${a}"${c.name.split(' // ')[0]}",1,${c.mtgo_id}, , , , ,No,0\n` : a;
  }, "");

  const sideboardString = modules.map(module => module.cards).flat()
    .concat(rotations.map(rotation => rotation.cards).flat())
    .concat(sideboard)
    .reduce(function (a, c) {
      return c && c.mtgo_id ? `${a}"${c.name.split(' // ')[0]}",1,${c.mtgo_id}, , , , ,Yes,0\n` : a;
    }, "");

  return (
    <MUICard>
      <MUICardHeader
        avatar={<Avatar alt={creator.name} size='large' src={creator.avatar} />}
        title={
          <MUITextField
            disabled={userId !== creator._id}
            inputProps={{ onBlur: () => editCube(descriptionInput, nameInput) }}
            label="Cube Name"
            margin="dense"
            onChange={event => setNameInput(event.target.value)}
            type="text"
            value={nameInput}
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
          disabled={userId !== creator._id}
          fullWidth={true}
          inputProps={{ onBlur: () => editCube(descriptionInput, nameInput) }}
          label="Cube Description"
          margin="dense"
          multiline
          onChange={event => setDescriptionInput(event.target.value)}
          rows={2}
          value={descriptionInput}
          variant="outlined"
        />       
      </MUICardContent>

      <MUICardActions>
        <MUITypography variant="body1">
          <CSVLink
            data={`Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n${mainboardString}${sideboardString}`}
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