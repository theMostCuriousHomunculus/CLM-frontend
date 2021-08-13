import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIInputLabel from '@material-ui/core/InputLabel';
import MUISelect from '@material-ui/core/Select';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { DeckContext } from '../../contexts/deck-context';

export default function DeckInfo () {

  const { userId } = React.useContext(AuthenticationContext);
  const { deckState: { creator, description, format, name }, editDeck } = React.useContext(DeckContext);
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
              margin="dense"
              native
              onChange={event => editDeck(descriptionInput, event.target.value, nameInput)}
              value={format}
              variant="outlined"
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
          disabled={creator._id !== userId}
          fullWidth={true}
          inputProps={{ onBlur: () => editDeck(descriptionInput, format, nameInput) }}
          label="Deck Description"
          margin="dense"
          multiline
          onChange={event => setDescriptionInput(event.target.value)}
          rows={2}
          value={descriptionInput}
          variant="outlined"
        />      
      </MUICardContent>
    </MUICard>
  );
};