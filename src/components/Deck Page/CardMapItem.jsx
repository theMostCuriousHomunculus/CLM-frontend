import React, { useCallback, useContext, useState } from 'react';
import MUIIconButton from '@mui/material/IconButton';
import MUIMenu from '@mui/material/Menu';
import MUIMoreVertIcon from '@mui/icons-material/MoreVert';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { useParams } from 'react-router';

import HoverPreview from '../miscellaneous/HoverPreview';
import ManaCostSVGs from '../miscellaneous/ManaCostSVGs';
import MoveToOption from './MoveToOption';
import deckComponents from '../../constants/deck-components';
import setNumberOfDeckCardCopies from '../../graphql/mutations/deck/set-number-of-deck-card-copies';
import { AuthenticationContext } from '../../contexts/Authentication';
import { DeckContext } from '../../contexts/deck-context';

export default function CardMapItem({
  cardCountState,
  component,
  scryfall_card,
  setCardCountState
}) {
  const { userID } = useContext(AuthenticationContext);
  const { deckState } = useContext(DeckContext);
  const { deckID } = useParams();
  const [anchorEl, setAnchorEl] = useState();
  const open = !!anchorEl;

  const options = deckComponents
    .filter((value) => component.field_name !== value.field_name)
    .map((value) => ({ ...value, multiple: false }));

  for (let index = 0; index < options.length; index++) {
    if (
      !options[index].multiple &&
      (cardCountState[scryfall_card._id]
        ? cardCountState[scryfall_card._id][component.field_name]
        : 0) > 1
    ) {
      options.splice(index + 1, 0, {
        ...options[index],
        multiple: true
      });
    }
  }

  const handleChangeNumberOfCopies = useCallback(
    function ({ mainboard_count, maybeboard_count, scryfall_id, sideboard_count }) {
      if (deckID) {
        setNumberOfDeckCardCopies({
          headers: { DeckID: deckID },
          variables: {
            mainboard_count,
            maybeboard_count,
            scryfall_id,
            sideboard_count
          }
        });
      }
    },
    [deckID]
  );

  return (
    <div style={{ alignItems: 'center', columnGap: 8, display: 'flex' }}>
      <MUIIconButton
        aria-label="move-card"
        aria-controls={
          open
            ? `${scryfall_card._id}-${component.display_name.toLowerCase()}-move-menu`
            : undefined
        }
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="primary"
        disabled={deckState.creator._id !== userID}
        id={`${scryfall_card._id}-${component.display_name.toLowerCase()}-move-button`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MUIMoreVertIcon />
      </MUIIconButton>
      <MUIMenu
        id={`${scryfall_card._id}-${component.display_name.toLowerCase()}-move-menu`}
        MenuListProps={{
          'aria-labelledby': `${
            scryfall_card._id
          }-${component.display_name.toLowerCase()}-move-button`
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {options.map((option) => (
          <MoveToOption
            cardCountState={cardCountState}
            component={component}
            handleChangeNumberOfCopies={handleChangeNumberOfCopies}
            key={`${option.display_name.toLowerCase()}-${option.multiple ? 'multiple' : 'single'}`}
            option={option}
            scryfall_card={scryfall_card}
            setAnchorEl={setAnchorEl}
          />
        ))}
      </MUIMenu>
      <MUITextField
        autoComplete="off"
        disabled={deckState.creator._id !== userID}
        inputProps={{
          min: 0,
          onBlur: () =>
            handleChangeNumberOfCopies({
              ...cardCountState[scryfall_card._id],
              scryfall_id: scryfall_card._id
            }),
          step: 1,
          style: {
            paddingBottom: 4,
            paddingTop: 4
          }
        }}
        onChange={(event) =>
          setCardCountState((prevState) => ({
            ...prevState,
            [scryfall_card._id]: {
              ...prevState[scryfall_card._id],
              [component.field_name]: parseInt(event.target.value)
            }
          }))
        }
        style={{ width: 64 }}
        type="number"
        value={
          cardCountState[scryfall_card._id]
            ? cardCountState[scryfall_card._id][component.field_name]
            : 0
        }
      />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <MUITypography
          variant="body1"
          style={{
            columnGap: 8,
            display: 'inline-flex',
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <HoverPreview
            back_image={
              scryfall_card.image_uris ? undefined : scryfall_card.card_faces[1].image_uris.large
            }
            image={scryfall_card.image_uris?.large ?? scryfall_card.card_faces[0].image_uris.large}
          >
            <span>{scryfall_card.name}</span>
          </HoverPreview>
          <span style={{ textAlign: 'right' }}>
            <span style={{ marginRight: 8 }}>{scryfall_card._set.toUpperCase()}</span>
            <ManaCostSVGs manaCostString={scryfall_card.mana_cost} size={20} />
          </span>
        </MUITypography>
      </div>
    </div>
  );
}
