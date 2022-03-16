import React, { useContext, useEffect, useState } from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUIIconButton from '@mui/material/IconButton';
import MUISwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MUISwapVertIcon from '@mui/icons-material/SwapVert';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { makeStyles } from '@mui/styles';
import { useParams } from 'react-router';

import HoverPreview from '../miscellaneous/HoverPreview';
import ManaCostSVGs from '../miscellaneous/ManaCostSVGs';
import addBasics from '../../graphql/mutations/event/add-basics';
import setNumberOfDeckCardCopies from '../../graphql/mutations/deck/set-number-of-deck-card-copies';
import customSort from '../../functions/custom-sort';
import specificCardType from '../../functions/specific-card-type';
import theme, { backgroundColor } from '../../theme';
// import PlaysetDisplay from './PlaysetDisplay';
import { AuthenticationContext } from '../../contexts/Authentication';

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

export default function DeckDisplay({ authorizedID, cards }) {
  const { userID } = useContext(AuthenticationContext);
  const { eventID, deckID, matchID } = useParams();
  const [cardCountState, setCardCountState] = useState(
    cards.reduce(
      (previousValue, currentValue) => ({
        ...previousValue,
        [currentValue.scryfall_card._id]: {
          mainboard: currentValue.mainboard_count,
          sideboard: currentValue.sideboard_count
        }
      }),
      {}
    )
  );
  const classes = useStyles();

  const isMatch = !!matchID;
  const isEvent = !!eventID;

  function handleChangeNumberOfCopies(scryfall_id) {
    if (deckID) {
      setNumberOfDeckCardCopies({
        headers: { DeckID: deckID },
        variables: {
          mainboard_count: cardCountState[scryfall_id].mainboard,
          scryfall_id,
          sideboard_count: cardCountState[scryfall_id].sideboard
        }
      });
    }
  }

  useEffect(() => {
    setCardCountState(
      cards.reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          [currentValue.scryfall_card._id]: {
            mainboard: currentValue.mainboard_count,
            sideboard: currentValue.sideboard_count
          }
        }),
        {}
      )
    );
  }, [cards]);

  return (
    <MUIGrid container spacing={0}>
      {['Mainboard', 'Sideboard'].map((component) => (
        <MUIGrid item key={component} xs={12} md={6}>
          <MUICard>
            <MUICardHeader
              title={
                <MUITypography variant="h3">
                  {component} (
                  {cards.reduce(
                    (previousValue, currentValue) =>
                      previousValue + currentValue[`${component.toLowerCase().concat('_count')}`],
                    0
                  )}
                  )
                </MUITypography>
              }
            />
            <MUICardContent>
              {[
                'Land',
                'Creature',
                'Planeswalker',
                'Artifact',
                'Enchantment',
                'Instant',
                'Sorcery'
              ].map(function (type) {
                const cards_specific_card_type = customSort(cards, [
                  'scryfall_card.cmc',
                  'scryfall_card.name',
                  'scryfall_card._set',
                  'scryfall_card.collector_number'
                ]).filter(
                  (card) =>
                    specificCardType(card.scryfall_card.type_line) === type &&
                    card[`${component.toLowerCase().concat('_count')}`] > 0
                );

                return (
                  cards_specific_card_type.length > 0 && (
                    <React.Fragment key={`${component}-${type}`}>
                      <MUITypography variant="subtitle1">{`${type} (${cards_specific_card_type.reduce(
                        (previousValue, currentValue) =>
                          previousValue +
                          currentValue[`${component.toLowerCase().concat('_count')}`],
                        0
                      )})`}</MUITypography>
                      {cards_specific_card_type.map((card) => (
                        <div
                          key={card.scryfall_card._id}
                          style={{ alignItems: 'center', display: 'flex' }}
                        >
                          <MUITextField
                            autoComplete="off"
                            disabled={
                              isMatch ||
                              (isEvent && !card.scryfall_card.type_line.includes('Basic')) ||
                              authorizedID !== userID
                            }
                            inputProps={{
                              min: 0,
                              onBlur: () => handleChangeNumberOfCopies(card.scryfall_card._id),
                              step: 1,
                              style: {
                                paddingBottom: 4,
                                paddingTop: 4
                              }
                            }}
                            onChange={(event) => {
                              event.persist();
                              setCardCountState((prevState) => ({
                                ...prevState,
                                [card.scryfall_card._id]: {
                                  ...prevState[card.scryfall_card._id],
                                  [component.toLowerCase()]: parseInt(event.target.value)
                                }
                              }));
                              console.log(cardCountState);
                            }}
                            style={{
                              marginLeft: 16,
                              marginTop: 4,
                              width: 64
                            }}
                            type="number"
                            value={cardCountState[card.scryfall_card._id][component.toLowerCase()]}
                          />
                          <div style={{ display: 'flex', flexGrow: 1 }}>
                            <MUITooltip
                              title={`Move One to ${
                                component === 'Mainboard' ? 'Sideboard' : 'Mainboard'
                              }`}
                            >
                              <MUIIconButton
                                className={classes.iconButton}
                                onClick={() => {
                                  if (component === 'Mainboard') {
                                    setCardCountState((prevState) => ({
                                      ...prevState,
                                      [card.scryfall_card._id]: {
                                        mainboard: prevState[card.scryfall_card._id].mainboard--,
                                        sideboard: prevState[card.scryfall_card._id].sideboard++
                                      }
                                    }));
                                  }

                                  if (component === 'Sideboard') {
                                    setCardCountState((prevState) => ({
                                      ...prevState,
                                      [card.scryfall_card._id]: {
                                        mainboard: prevState[card.scryfall_card._id].mainboard++,
                                        sideboard: prevState[card.scryfall_card._id].sideboard--
                                      }
                                    }));
                                  }

                                  handleChangeNumberOfCopies(card.scryfall_card._id);
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
                              <HoverPreview
                                back_image={
                                  card.scryfall_card.image_uris
                                    ? undefined
                                    : card.scryfall_card.card_faces[1].image_uris.large
                                }
                                image={
                                  card.scryfall_card.image_uris
                                    ? card.scryfall_card.image_uris.large
                                    : card.scryfall_card.card_faces[0].image_uris.large
                                }
                              >
                                <span>{card.scryfall_card.name}</span>
                              </HoverPreview>
                              <span>
                                {card.scryfall_card._set.toUpperCase()}
                                <ManaCostSVGs
                                  manaCostString={card.scryfall_card.mana_cost}
                                  size={20}
                                />
                              </span>
                            </MUITypography>
                          </div>
                        </div>
                      ))}
                    </React.Fragment>
                  )
                );
              })}
            </MUICardContent>
          </MUICard>
        </MUIGrid>
      ))}
    </MUIGrid>
  );
}
