import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIFormControl from '@mui/material/FormControl';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import generateCSVList from '../../functions/generate-csv-list';
import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { DeckContext } from '../../contexts/deck-context';
import { CSVLink } from 'react-csv';

export default function DeckInfo () {

  const { userId } = React.useContext(AuthenticationContext);
  const { deckState: { creator, description, format, mainboard, name, sideboard }, editDeck } = React.useContext(DeckContext);
  const [descriptionInput, setDescriptionInput] = React.useState(description);
  const [nameInput, setNameInput] = React.useState(name);

  return (
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
          <MUITypography color="textSecondary" variant="subtitle1">
            Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
          </MUITypography>
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

      <MUICardActions>
        <MUITypography variant="body1">
          <CSVLink
          data={generateCSVList(mainboard, sideboard)}
          filename={`${name}.csv`}
          target="_blank"
          >
            Export Deck List to CSV
          </CSVLink>
        </MUITypography>
      </MUICardActions>
    </MUICard>
  );
};