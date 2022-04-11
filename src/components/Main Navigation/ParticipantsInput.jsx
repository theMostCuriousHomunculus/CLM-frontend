import React, { useContext, useState } from 'react';
import MUIAvatar from '@mui/material/Avatar';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUICheckbox from '@mui/material/Checkbox';
import MUIChip from '@mui/material/Chip';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUITextField from '@mui/material/TextField';

import { AuthenticationContext } from '../../contexts/Authentication';

export default function ParticipantsInput({ participants, setNewConversationParticipants }) {
  const { buds, userID } = useContext(AuthenticationContext);
  const [filterText, setFilterText] = useState('');

  return (
    <MUIAutocomplete
      clearOnBlur={false}
      clearOnEscape
      disableClearable
      fullWidth
      getOptionLabel={(option) => option.name}
      id="bud-include-input"
      inputValue={filterText}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      multiple
      onChange={function (event, value) {
        setNewConversationParticipants(value);
      }}
      onInputChange={(event, newInputValue) => {
        setFilterText(newInputValue);
      }}
      options={buds.sort((a, b) => {
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        return 1;
      })}
      renderInput={(params) => (
        <MUITextField
          {...params}
          label="Participants"
          onChange={(event) => setFilterText(event.target.value)}
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li {...props}>
          <MUIFormControlLabel
            control={<MUICheckbox checked={selected} color="primary" />}
            label={
              <MUIAvatar
                alt={option.name}
                src={
                  option.avatar.image_uris
                    ? option.avatar.image_uris.art_crop
                    : option.avatar.card_faces[0].image_uris.art_crop
                }
              />
            }
          />
          {option.name}
        </li>
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <MUIChip
            label={option.name}
            {...getTagProps({ index })}
            avatar={
              <MUIAvatar
                alt={option.name}
                src={
                  option.avatar.image_uris
                    ? option.avatar.image_uris.art_crop
                    : option.avatar.card_faces[0].image_uris.art_crop
                }
              />
            }
            color="primary"
            disabled={option._id === userID}
            onDelete={
              option._id === userID
                ? undefined
                : () => {
                    setNewConversationParticipants((prevState) =>
                      prevState.filter((p) => p._id !== option._id)
                    );
                  }
            }
          />
        ))
      }
      value={participants}
    />
  );
}
