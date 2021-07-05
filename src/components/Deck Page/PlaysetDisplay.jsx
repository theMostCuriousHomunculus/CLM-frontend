import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import MUISwapHorizIcon from '@material-ui/icons/SwapHoriz'
import MUITextField from '@material-ui/core/TextField';
import MUITooltip from '@material-ui/core/Tooltip';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import theme, { backgroundColor } from '../../theme';
import HoverPreview from '../miscellaneous/HoverPreview';
import ManaCostSVGs from '../miscellaneous/ManaCostSVGs';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { DeckContext } from '../../contexts/deck-context';

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

export default function PlaysetDisplay ({
  component,
  playset: { card, copies }
}) {

  const { userId } = React.useContext(AuthenticationContext);
  const {
    deckState: { creator },
    addCardsToDeck,
    removeCardsFromDeck,
    toggleMainboardSideboard
  } = React.useContext(DeckContext);
  const classes = useStyles();
  const [updatedCount, setUpdatedCount] = React.useState(copies.length);

  React.useEffect(() => {
    setUpdatedCount(copies.length);
  }, [copies.length])

  function handleChangeNumberOfCopies () {

    if (copies.length < updatedCount) {
      addCardsToDeck(card, component, updatedCount - copies.length);
    } else if (copies.length > updatedCount) {
      removeCardsFromDeck(copies.slice(updatedCount), component);
    } else {
      // don't do anything; no changes
    }

  }

  return (
    <div style={{ alignItems: 'center', display: 'flex' }}>
      <MUITextField
        autoComplete="off"
        disabled={creator._id !== userId}
        inputProps={{
          min: 0,
          onBlur: handleChangeNumberOfCopies,
          step: 1,
          style: {
            paddingBottom: 4,
            paddingTop: 4
          }
        }}
        margin="dense"
        onChange={event => setUpdatedCount(event.target.value)}
        style={{
          marginLeft: 16,
          marginTop: 4,
          width: 64
        }}
        type="number"
        value={updatedCount}
        variant="outlined"
      />
      <div style={{ display: 'flex', flexGrow: 1 }}>
        <MUITooltip title={`Move One to ${component === 'mainboard' ? 'Sideboard' : 'Mainboard'}`}>
          <MUIIconButton
            className={classes.iconButton}
            onClick={() => toggleMainboardSideboard(copies[0])}
            size="small"
          >
            <MUISwapHorizIcon />
          </MUIIconButton>
        </MUITooltip>
        <MUITypography
          variant="body1"
          style={{ display: 'inline-flex', flexGrow: 1, justifyContent: 'space-between' }}
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