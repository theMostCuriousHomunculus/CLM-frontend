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
import MUIFormControl from '@mui/material/FormControl';
import MUIImageList from '@mui/material/ImageList';
import MUIImageListItem from '@mui/material/ImageListItem';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import generateCSVList from '../../functions/generate-csv-list';
import randomSampleWOReplacement from '../../functions/random-sample-wo-replacement';
import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { DeckContext } from '../../contexts/deck-context';
import { CSVLink } from 'react-csv';

export default function DeckInfo () {

  const { isLoggedIn, userId } = React.useContext(AuthenticationContext);
  const {
    deckState: {
      creator,
      description,
      format,
      mainboard,
      name,
      sideboard
    },
    cloneDeck,
    editDeck
  } = React.useContext(DeckContext);
  const [descriptionInput, setDescriptionInput] = React.useState(description);
  const [nameInput, setNameInput] = React.useState(name);
  const [sampleHand, setSampleHand] = React.useState([]);

  return (
    <React.Fragment>
      <MUIDialog
        onClose={() => setSampleHand([])}
        open={sampleHand.length > 0}
      >
        <MUIDialogTitle>Sample Hand from {name}</MUIDialogTitle>
        <MUIDialogContent>
          <MUIImageList cols={2} rowHeight={264} sx={{ width: 382 }}>
            {sampleHand.map(card => (
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
          <MUIButton onClick={() => setSampleHand(randomSampleWOReplacement(mainboard, 7))}>
            New Sample Hand
          </MUIButton>
        </MUIDialogActions>
      </MUIDialog>

      <MUICard>
        <MUICardHeader
          action={
            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="format-selector">Format</MUIInputLabel>
              <MUISelect
                disabled={creator._id !== userId}
                fullWidth
                label="Format"
                native
                onChange={event => editDeck(descriptionInput, event.target.value, nameInput)}
                value={format}
                inputProps={{
                  id: 'format-selector'
                }}
              >
                <option value={undefined}>Freeform</option>
                <option value="Classy">Classy</option>
                <option value="Legacy">Legacy</option>
                <option value="Modern">Modern</option>
                <option value="Pauper">Pauper</option>
                <option value="Pioneer">Pioneer</option>
                <option value="Standard">Standard</option>
                <option value="Vintage">Vintage</option>
              </MUISelect>
            </MUIFormControl>
          }
          avatar={<Avatar alt={creator.name} size='large' src={creator.avatar} />}
          title={
            <MUITextField
              disabled={creator._id !== userId}
              inputProps={{ onBlur: () => editDeck(descriptionInput, format, nameInput) }}
              label="Deck Name"
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
                  data={generateCSVList(mainboard, sideboard)}
                  filename={`${name}.csv`}
                  target="_blank"
                >
                  Export Deck List to CSV
                </CSVLink>
              </MUITypography>
            </React.Fragment>
          }
        />

        <MUICardContent>
          <MUITextField
            disabled={creator._id !== userId}
            fullWidth={true}
            inputProps={{ onBlur: () => editDeck(descriptionInput, format, nameInput) }}
            label="Deck Description"
            multiline
            onChange={event => setDescriptionInput(event.target.value)}
            rows={2}
            value={descriptionInput}
          />      
        </MUICardContent>

        <MUICardActions
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          {isLoggedIn &&
            <MUIButton onClick={cloneDeck}>
              Clone Deck
            </MUIButton>
          }

          <MUIButton onClick={() => setSampleHand(randomSampleWOReplacement(mainboard, 7))}>
            Sample Hand
          </MUIButton>
        </MUICardActions>
      </MUICard>
    </React.Fragment>
  );
};