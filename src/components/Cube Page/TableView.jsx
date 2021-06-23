import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../../functions/custom-sort';
import generalCardType from '../../functions/general-card-type';
import specificCardType from '../../functions/specific-card-type';
import theme from '../../theme';
import HoverPreview from '../miscellaneous/HoverPreview';
import { monoColors, multiColors } from '../../constants/color-objects';

const useStyles = makeStyles({
  basicCard: {
    margin: 4,
    [theme.breakpoints.up('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 'calc(50% - 8px)'
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc(25% - 8px)'
    },
    [theme.breakpoints.up('lg')]: {
      width: 'calc((100% / 7) - 8px)'
    }
  },
  black: {
    backgroundColor: monoColors.find((color) => color.name === "Black").hex
  },
  blue: {
    backgroundColor: monoColors.find((color) => color.name === "Blue").hex
  },
  cardContent: {
    paddingTop: 2
  },
  cardHeader: {
    paddingBottom: 2,
    textAlign: 'center',
    '& *': {
      fontWeight: 'bold',
      lineHeight: 1.1
    }
  },
  cmcBlock: {
    '& div:not(:last-child)': {
      borderBottom: '1px solid black'
    }
  },
  colorComboText: {
    borderBottom: '1px solid black',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  colorless: {
    backgroundColor: monoColors.find((color) => color.name === "Colorless").hex
  },
  green: {
    backgroundColor: monoColors.find((color) => color.name === "Green").hex
  },
  multicolor: {
    backgroundColor: '#efef8f'
  },
  red: {
    backgroundColor: monoColors.find((color) => color.name === "Red").hex
  },
  tableViewMainContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around'
  },
  typeText: {
    fontWeight: 'bold',
    textAlign: 'center'
  },
  white: {
    backgroundColor: monoColors.find((color) => color.name === "White").hex
  }  
});

export default function TableView ({
  cards,
  setSelectedCard
}) {

  const classes = useStyles();
  const costs = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={classes.tableViewMainContainer}>
      <React.Fragment>
        {monoColors.map(function (color) {
          const cards_color = cards.filter(function (card) {
            return card.color_identity.toString() === color.color_identity;
          });
          return (
            <MUICard className={`${classes[color.name.toLowerCase()]} ${classes.basicCard}`} key={`table-${color.name}`}>
              <MUICardHeader
                disableTypography={true}
                className={classes.cardHeader}
                title={<MUITypography variant="h6">{color.name}</MUITypography>}
                subheader={<MUITypography variant="h6">({cards_color.length})</MUITypography>}
              />
              <MUICardContent className={classes.cardContent}>
                {["Creature", "Planeswalker", "Instant", "Sorcery", "Enchantment", "Artifact", "Land", "???"].map(function (type) {
                  const cards_color_type = cards_color.filter(function (card) {
                    return specificCardType(card.type_line) === type;
                  });
                  return (
                    <React.Fragment key={type}>
                      {cards_color_type.length > 0 &&
                        <React.Fragment>
                          <MUITypography className={classes.typeText} variant="subtitle1">
                            {`${type} (${cards_color_type.length})`}
                          </MUITypography>
                          <div className={classes.cmcBlock}>
                            {costs.map(function (cost) {
                              const cards_color_type_cost = cards_color_type.filter(function (card) {
                                return card.cmc === cost || (cost === 7 && card.cmc > cost);
                              });
                              return (
                                <React.Fragment key={cost}>
                                  {cards_color_type_cost.length > 0 &&
                                    <div>
                                      {customSort(cards_color_type_cost, ['name']).map(function (card, index) {
                                        return (
                                          <span key={card._id}>
                                            <HoverPreview>
                                              <MUITypography
                                                back_image={card.back_image}
                                                image={card.image}
                                                onDoubleClick={() => setSelectedCard(card)}
                                                style={{ cursor: 'pointer' }}
                                                variant="body1"
                                              >
                                                {index + 1}) {card.name}
                                              </MUITypography>
                                            </HoverPreview>
                                          </span>
                                        );
                                      })}
                                    </div>
                                  }
                                </React.Fragment>
                              );
                            })}
                          </div>
                        </React.Fragment>
                      }
                    </React.Fragment>
                  );
                })}
              </MUICardContent>
            </MUICard>
          );
        })}
      </React.Fragment>
      <MUICard className={classes.multicolor + ' ' + classes.basicCard}>
        <MUICardHeader
          className={classes.cardHeader}
          disableTypography={true}
          title={<MUITypography variant="h6">Multicolor</MUITypography>}
          subheader={<MUITypography variant="h6">
            ({cards.filter(card => card.color_identity.length > 1).length})
          </MUITypography>}
        />
        <MUICardContent className={classes.cardContent}>
          {multiColors.map(function (color) {
            const cards_color = cards.filter(card => card.color_identity.toString() === color.color_identity);
            return (
              <React.Fragment key={color.name}>
                {cards_color.length > 0 &&
                  <div>
                    <MUITypography className={classes.colorComboText} variant="subtitle1">
                      {`${color.name} (${cards_color.length})`}
                    </MUITypography>
                    {["Creature", "Non-Creature", "Land"].map(function (value) {
                      const cards_color_type = cards_color.filter(function (card) {
                        return value === generalCardType(card.type_line);
                      });
                      return (
                        <div key={`${color.name}-${value}`}>
                          <MUITypography style={{ fontStyle: 'italic', textAlign: 'center' }} variant="subtitle1">
                            {value}
                          </MUITypography>
                          {customSort(cards_color_type, ['cmc']).map(function (card, index) {
                            return (
                              <span key={card._id}>
                                <HoverPreview>
                                  <MUITypography
                                    back_image={card.back_image}
                                    image={card.image}
                                    onDoubleClick={() => setSelectedCard(card)}
                                    style={{ cursor: 'pointer', userSelect: 'none' }}
                                    variant="body1"
                                  >
                                    {index + 1}) {card.name}
                                  </MUITypography>
                                </HoverPreview>
                              </span>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                }
              </React.Fragment>
            );
          })}
        </MUICardContent>
      </MUICard>
    </div>
  );
};