import React, { useContext, useState } from 'react';
import MUIAvatar from '@mui/material/Avatar';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUICheckbox from '@mui/material/Checkbox';
import MUIChip from '@mui/material/Chip';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUISearchIcon from '@mui/icons-material/Search';
import MUITextField from '@mui/material/TextField';
import { alpha } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';

const useStyles = makeStyles({
  textfield: {
    margin: 8,
    // minWidth: 300,
    width: 'calc(100% - 16px)',
    '& input[type=text]': {
      color: '#ffffff'
    }
  },
  autocomplete: {
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    borderRadius: theme.shape.borderRadius,
    // color: '#fff',
    // position: 'relative',
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    }
  }
});

export default function ParticipantsInput({ faded, participants, setParticipants }) {
  const { buds, userID } = useContext(AuthenticationContext);
  const [filterText, setFilterText] = useState('');
  const { autocomplete, textfield } = useStyles();

  return (
    <MUIAutocomplete
      className={faded ? autocomplete : undefined}
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
        setParticipants(value);
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
          className={faded ? textfield : undefined}
          color={faded ? 'secondary' : undefined}
          onChange={(event) => setFilterText(event.target.value)}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <React.Fragment>
                <MUISearchIcon style={{ color: faded ? 'white' : theme.palette.primary.main }} />
                {params.InputProps.startAdornment}
              </React.Fragment>
            )
          }}
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
                    setParticipants((prevState) => prevState.filter((p) => p._id !== option._id));
                  }
            }
          />
        ))
      }
      value={participants}
    />
  );
}
