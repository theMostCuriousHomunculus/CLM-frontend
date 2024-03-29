import React from 'react';
import MUIIconButton from '@mui/material/IconButton';
import MUISwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MUISwapVertIcon from '@mui/icons-material/SwapVert';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams } from 'react-router';

import theme, { backgroundColor } from '../../theme';
import HoverPreview from '../miscellaneous/HoverPreview';
import ManaCostSVGs from '../miscellaneous/ManaCostSVGs';
import { AuthenticationContext } from '../../contexts/Authentication';
import addBasics from '../../graphql/mutations/event/add-basics';
import removeBasics from '../../graphql/mutations/event/remove-basics';
import toggleMainboardSideboardEvent from '../../graphql/mutations/event/toggle-mainboard-sideboard-event';

const useStyles = makeStyles({
  iconButton: {
    background: theme.palette.secondary.main,
    color: backgroundColor,
    marginLeft: 8,
    marginRight: 8,
    '&:hover': {
      background: theme.palette.secondary.dark
    }
  }
});

export default function PlaysetDisplay({
  add,
  authorizedID,
  component,
  playset: { card, copies },
  remove,
  toggle
}) {
  const { eventID, deckID, matchID } = useParams();
  const { userID } = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [updatedCount, setUpdatedCount] = React.useState(copies.length);

  React.useEffect(() => {
    setUpdatedCount(copies.length);
  }, [copies.length]);

  const isMatch = !!useParams().matchID;
  const isEvent = !!useParams().eventID;

  function handleChangeNumberOfCopies() {
    if (copies.length < updatedCount) {
      if (eventID) {
        addBasics({
          headers: { EventID: eventID },
          variables: {
            component,
            name: card.name,
            numberOfCopies: updatedCount - copies.length,
            scryfall_id: card.scryfall_id
          }
        });
      } else {
        // TODO don't pass add as props for deck
        add(card, component, updatedCount - copies.length);
      }
    } else if (copies.length > updatedCount) {
      if (eventID) {
        removeBasics({
          headers: { EventID: eventID },
          variables: {
            cardIDs: copies.slice(updatedCount),
            component
          }
        });
      }
      // TODO don't pass remove as props for deck
      remove(copies.slice(updatedCount), component);
    } else {
      // don't do anything; no changes
    }
  }

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <MUITextField
        autoComplete="off"
        disabled={
          isMatch ||
          (isEvent && !card.type_line.includes('Basic')) ||
          authorizedID !== userID
        }
        inputProps={{
          min: 0,
          onBlur: handleChangeNumberOfCopies,
          step: 1,
          style: {
            paddingBottom: 4,
            paddingTop: 4
          }
        }}
        onChange={(event) => setUpdatedCount(event.target.value)}
        style={{
          marginLeft: 16,
          marginTop: 4,
          width: 64
        }}
        type="number"
        value={updatedCount}
      />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <MUITooltip
          title={`Move One to ${
            component === 'mainboard' ? 'Sideboard' : 'Mainboard'
          }`}
        >
          <MUIIconButton
            className={classes.iconButton}
            onClick={() => {
              if (eventID) {
                toggleMainboardSideboardEvent({
                  headers: { EventID: eventID },
                  cardID: copies[0]
                });
              } else {
                // TODO don't pass toggle as prop
                toggle(copies[0]);
              }
            }}
            size="small"
            style={{ alignSelf: 'center' }}
          >
            {useMediaQuery(theme.breakpoints.up('md')) ? (
              <MUISwapHorizIcon />
            ) : (
              <MUISwapVertIcon />
            )}
          </MUIIconButton>
        </MUITooltip>
        <MUITypography
          variant="body1"
          style={{
            display: 'inline-flex',
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >
          <HoverPreview back_image={card.back_image} image={card.image}>
            <span>{card.name}</span>
          </HoverPreview>
          <span>
            {card.set.toUpperCase()}
            <ManaCostSVGs manaCostString={card.mana_cost} size={20} />
          </span>
        </MUITypography>
      </div>
    </div>
  );
}
