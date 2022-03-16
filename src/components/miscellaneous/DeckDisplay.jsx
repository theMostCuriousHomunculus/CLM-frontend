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
  const sideBySide = useMediaQuery(theme.breakpoints.up('md'));
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
                  {Object.values(cardCountState).reduce(
                    (previousValue, currentValue) =>
                      previousValue + currentValue[component.toLowerCase()],
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
                    card[`${component.toLowerCase()}_count`] > 0
                );

                return (
                  cards_specific_card_type.length > 0 && (
                    <React.Fragment key={`${component}-${type}`}>
                      <MUITypography variant="subtitle1">
                        {`${type} (${cards_specific_card_type.reduce(
                          (previousValue, currentValue) =>
                            previousValue +
                            (cardCountState[currentValue.scryfall_card._id]
                              ? cardCountState[currentValue.scryfall_card._id][
                                  component.toLowerCase()
                                ]
                              : 0),
                          0
                        )})`}
                      </MUITypography>
                      {cards_specific_card_type.map(({ scryfall_card }) => (
                        <div
                          key={scryfall_card._id}
                          style={{ alignItems: 'center', display: 'flex' }}
                        >
                          <MUITextField
                            autoComplete="off"
                            disabled={
                              isMatch ||
                              (isEvent && !scryfall_card.type_line.includes('Basic')) ||
                              authorizedID !== userID
                            }
                            inputProps={{
                              min: 0,
                              onBlur: () => handleChangeNumberOfCopies(scryfall_card._id),
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
                                  [component.toLowerCase()]: parseInt(event.target.value)
                                }
                              }))
                            }
                            style={{
                              marginLeft: 16,
                              marginTop: 4,
                              width: 64
                            }}
                            type="number"
                            value={
                              cardCountState[scryfall_card._id]
                                ? cardCountState[scryfall_card._id][component.toLowerCase()]
                                : 0
                            }
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
                                      [scryfall_card._id]: {
                                        mainboard: prevState[scryfall_card._id].mainboard--,
                                        sideboard: prevState[scryfall_card._id].sideboard++
                                      }
                                    }));
                                  }

                                  if (component === 'Sideboard') {
                                    setCardCountState((prevState) => ({
                                      ...prevState,
                                      [scryfall_card._id]: {
                                        mainboard: prevState[scryfall_card._id].mainboard++,
                                        sideboard: prevState[scryfall_card._id].sideboard--
                                      }
                                    }));
                                  }

                                  handleChangeNumberOfCopies(scryfall_card._id);
                                }}
                                size="small"
                                style={{ alignSelf: 'center' }}
                              >
                                {sideBySide ? <MUISwapHorizIcon /> : <MUISwapVertIcon />}
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
                                  scryfall_card.image_uris
                                    ? undefined
                                    : scryfall_card.card_faces[1].image_uris.large
                                }
                                image={
                                  scryfall_card.image_uris
                                    ? scryfall_card.image_uris.large
                                    : scryfall_card.card_faces[0].image_uris.large
                                }
                              >
                                <span>{scryfall_card.name}</span>
                              </HoverPreview>
                              <span>
                                {scryfall_card._set.toUpperCase()}
                                <ManaCostSVGs manaCostString={scryfall_card.mana_cost} size={20} />
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
