import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIImageList from '@mui/material/ImageList';
import MUIImageListItem from '@mui/material/ImageListItem';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

import generateCSVList from '../../functions/generate-csv-list';
import randomSampleWOReplacement from '../../functions/random-sample-wo-replacement';
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
  const [samplePack, setSamplePack] = React.useState([]);
  const [samplePackDialogOpen, setSamplePackDialogOpen] = React.useState(false);

  React.useEffect(() => {
    setDescriptionInput(description);
  }, [description]);

  React.useEffect(() => {
    setNameInput(name);
  }, [name]);

  return (
    <React.Fragment>
      <MUIDialog
        onClose={() => {
          setSamplePackDialogOpen(false);
          setSamplePack([]);
        }}
        open={samplePackDialogOpen}
      >
        <MUIDialogTitle>Sample Pack from {name}</MUIDialogTitle>
        <MUIDialogContent>
          <MUIImageList cols={2} rowHeight={264} sx={{ width: 382 }}>
            {samplePack.map(card => (
              <MUIImageListItem key={card._id}>
                <img
                  alt={card.name}
                  src={card.image}
                  style={{ height: 264, width: 189 }}
                />
              </MUIImageListItem>
            ))}
          </MUIImageList>
        </MUIDialogContent>
        <MUIDialogActions>
          <MUIButton onClick={() => setSamplePack(randomSampleWOReplacement(mainboard, 15))}>
            New Sample Pack
          </MUIButton>
        </MUIDialogActions>
      </MUIDialog>

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
            <React.Fragment>
              <MUITypography color="textSecondary" variant="subtitle1">
                Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
              </MUITypography>
              <MUITypography variant="subtitle1">
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
            </React.Fragment>
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
          <MUIButton
            onClick={() => {
              setSamplePack(randomSampleWOReplacement(mainboard, 15));
              setSamplePackDialogOpen(true);
            }}
          >
            See a Sample Pack
          </MUIButton>
        </MUICardActions>
      </MUICard>
    </React.Fragment>
  );
};