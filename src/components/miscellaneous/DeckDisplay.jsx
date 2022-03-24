import React, { useCallback, useContext, useEffect, useState } from 'react';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUIIconButton from '@mui/material/IconButton';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUIMoreVertIcon from '@mui/icons-material/MoreVert';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { useParams } from 'react-router';

import HoverPreview from './HoverPreview';
import ManaCostSVGs from './ManaCostSVGs';
import ScryfallRequest from './ScryfallRequest';
import setNumberOfDeckCardCopies from '../../graphql/mutations/deck/set-number-of-deck-card-copies';
import customSort from '../../functions/custom-sort';
import specificCardType from '../../functions/specific-card-type';
import { AuthenticationContext } from '../../contexts/Authentication';
import { DeckContext } from '../../contexts/deck-context';

const deckComponents = ['Mainboard', 'Sideboard', 'Maybeboard'];
const generalCardTypes = [
  'Land',
  'Creature',
  'Planeswalker',
  'Artifact',
  'Enchantment',
  'Instant',
  'Sorcery'
];

function MoveToOption({
  cardCountState,
  componentName,
  handleChangeNumberOfCopies,
  multiple,
  otherComponentName,
  scryfall_card,
  setAnchorEl
}) {
  return (
    <MUIMenuItem
      onClick={() => {
        handleChangeNumberOfCopies({
          ...cardCountState[scryfall_card._id],
          [componentName.toLowerCase()]: multiple
            ? 0
            : cardCountState[scryfall_card._id][componentName.toLowerCase()] - 1,
          [otherComponentName.toLowerCase()]:
            cardCountState[scryfall_card._id][otherComponentName.toLowerCase()] +
            (multiple ? cardCountState[scryfall_card._id][componentName.toLowerCase()] : 1),
          scryfall_id: scryfall_card._id
        });
        setAnchorEl(null);
      }}
    >
      {`Move ${multiple ? 'All' : 1} to ${otherComponentName}`}
    </MUIMenuItem>
  );
}

function TypeCardDisplay({ cardCountState, componentName, scryfall_card, setCardCountState }) {
  const { userID } = useContext(AuthenticationContext);
  const { deckState } = useContext(DeckContext);
  const { eventID, deckID, matchID } = useParams();
  const [anchorEl, setAnchorEl] = useState();

  const isMatch = !!matchID;
  const isEvent = !!eventID;
  const open = !!anchorEl;

  const options = deckComponents
    .filter((value) => componentName !== value)
    .map((value) => ({ otherComponentName: value, multiple: false }));

  for (let index = 0; index < options.length; index++) {
    if (
      !options[index].multiple &&
      (cardCountState[scryfall_card._id]
        ? cardCountState[scryfall_card._id][componentName.toLowerCase()]
        : 0) > 1
    ) {
      options.splice(index + 1, 0, {
        otherComponentName: options[index].otherComponentName,
        multiple: true
      });
    }
  }

  const handleChangeNumberOfCopies = useCallback(
    function ({ mainboard, maybeboard, scryfall_id, sideboard }) {
      if (deckID) {
        setNumberOfDeckCardCopies({
          headers: { DeckID: deckID },
          variables: {
            mainboard_count: mainboard,
            maybeboard_count: maybeboard,
            scryfall_id,
            sideboard_count: sideboard
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
          open ? `${scryfall_card._id}-${componentName.toLowerCase()}-move-menu` : undefined
        }
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        color="primary"
        disabled={deckState.creator._id !== userID}
        id={`${scryfall_card._id}-${componentName.toLowerCase()}-move-button`}
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
        <MUIMoreVertIcon />
      </MUIIconButton>
      <MUIMenu
        id={`${scryfall_card._id}-${componentName.toLowerCase()}-move-menu`}
        MenuListProps={{
          'aria-labelledby': `${scryfall_card._id}-${componentName.toLowerCase()}-move-button`
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        {options.map((option) => (
          <MoveToOption
            cardCountState={cardCountState}
            componentName={componentName}
            handleChangeNumberOfCopies={handleChangeNumberOfCopies}
            key={`${option.otherComponentName}-${option.multiple ? 'multiple' : 'single'}`}
            multiple={option.multiple}
            otherComponentName={option.otherComponentName}
            scryfall_card={scryfall_card}
            setAnchorEl={setAnchorEl}
          />
        ))}
      </MUIMenu>
      <MUITextField
        autoComplete="off"
        disabled={
          isMatch ||
          (isEvent && !scryfall_card.type_line.includes('Basic')) ||
          deckState.creator._id !== userID
        }
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
              [componentName.toLowerCase()]: parseInt(event.target.value)
            }
          }))
        }
        style={{ width: 64 }}
        type="number"
        value={
          cardCountState[scryfall_card._id]
            ? cardCountState[scryfall_card._id][componentName.toLowerCase()]
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

function ComponentTypeDisplay({
  cardCountState,
  componentCards,
  componentName,
  generalCardType,
  setCardCountState
}) {
  const cardsOfType = componentCards.filter(
    (card) => specificCardType(card.scryfall_card.type_line) === generalCardType
  );

  return (
    cardsOfType.length > 0 && (
      <React.Fragment>
        <MUITypography variant="subtitle1">
          {`${generalCardType} (${cardsOfType.reduce(
            (previousValue, currentValue) =>
              previousValue +
              (cardCountState[currentValue.scryfall_card._id]
                ? cardCountState[currentValue.scryfall_card._id][componentName.toLowerCase()]
                : 0),
            0
          )})`}
        </MUITypography>
        {cardsOfType.map(({ scryfall_card }) => (
          <TypeCardDisplay
            cardCountState={cardCountState}
            componentName={componentName}
            key={scryfall_card._id}
            scryfall_card={scryfall_card}
            setCardCountState={setCardCountState}
          />
        ))}
      </React.Fragment>
    )
  );
}

function DeckComponentDisplay({ componentCards, componentName }) {
  const { userID } = useContext(AuthenticationContext);
  const { deckState } = useContext(DeckContext);
  const { deckID } = useParams();

  const [cardCountState, setCardCountState] = useState(
    componentCards.reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue.scryfall_card._id]: {
          mainboard: currentValue.mainboard_count,
          maybeboard: currentValue.maybeboard_count,
          sideboard: currentValue.sideboard_count
        }
      }),
      {}
    )
  );

  function addCardToComponent(cardData) {
    const otherComponents = deckComponents.filter((cmpnnt) => cmpnnt !== componentName);
    const existingCard = deckState.cards.find((card) => card.scryfall_card._id === cardData._id);
    if (existingCard) {
      const variables = otherComponents.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [`${currentValue.toLowerCase()}_count`]:
            existingCard[`${currentValue.toLowerCase()}_count`]
        }),
        {
          scryfall_id: cardData._id,
          [`${componentName.toLowerCase()}_count`]:
            existingCard[`${componentName.toLowerCase()}_count`] + 1
        }
      );
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables
      });
    } else {
      const variables = otherComponents.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [`${currentValue.toLowerCase()}_count`]: 0
        }),
        {
          scryfall_id: cardData._id,
          [`${componentName.toLowerCase()}_count`]: 1
        }
      );
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables
      });
    }
  }

  useEffect(() => {
    setCardCountState(
      componentCards.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.scryfall_card._id]: {
            mainboard: currentValue.mainboard_count,
            maybeboard: currentValue.maybeboard_count,
            sideboard: currentValue.sideboard_count
          }
        }),
        {}
      )
    );
  }, [componentCards]);

  return (
    <MUIGrid item xs={12} md={6} lg={4}>
      <MUICard>
        <MUICardHeader
          title={
            <MUITypography variant="h3">
              {componentName} (
              {Object.values(cardCountState).reduce(
                (previousValue, currentValue) =>
                  previousValue + currentValue[componentName.toLowerCase()],
                0
              )}
              )
            </MUITypography>
          }
        />
        <MUICardContent>
          {generalCardTypes.map((generalCardType) => (
            <ComponentTypeDisplay
              cardCountState={cardCountState}
              componentCards={componentCards}
              componentName={componentName}
              generalCardType={generalCardType}
              key={generalCardType}
              setCardCountState={setCardCountState}
            />
          ))}
        </MUICardContent>
        {deckState && deckState.creator._id === userID && (
          <MUICardActions>
            <ScryfallRequest
              buttonText="+"
              labelText={`Add a card to ${componentName}`}
              onSubmit={addCardToComponent}
            />
          </MUICardActions>
        )}
      </MUICard>
    </MUIGrid>
  );
}

export default function DeckDisplay() {
  const {
    deckState: { cards }
  } = useContext(DeckContext);
  const sortedCards = customSort(cards, [
    'scryfall_card.cmc',
    'scryfall_card.name',
    'scryfall_card._set',
    'scryfall_card.collector_number'
  ]);

  return (
    <MUIGrid container spacing={0}>
      {deckComponents.map((componentName) => (
        <DeckComponentDisplay
          componentCards={sortedCards.filter(
            (card) => card[`${componentName.toLowerCase()}_count`] > 0
          )}
          componentName={componentName}
          key={componentName}
        />
      ))}
    </MUIGrid>
  );
}
