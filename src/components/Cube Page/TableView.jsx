import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../../functions/alphabetical-sort';
import cardType from '../../functions/card-type';
import theme from '../../theme';
import { monoColors, multiColors } from '../../constants/color-objects';

const useStyles = makeStyles({
  basicCard: {
    height: '100%',
    margin: 0,
    width: '100%'
  },
  black: {
    backgroundColor: monoColors.find((color) => color.name === "Black").hex
  },
  blue: {
    backgroundColor: monoColors.find((color) => color.name === "Blue").hex
  },
  cardWrapper: {
    margin: '0.5rem',
    textAlign: 'center',
    [theme.breakpoints.up('xs')]: {
      width: '100%'
    },
    [theme.breakpoints.up('sm')]: {
      width: 'calc((100% - 2rem) / 2)'
    },
    [theme.breakpoints.up('md')]: {
      width: 'calc((100% - 4rem) / 4)'
    },
    [theme.breakpoints.up('lg')]: {
      width: 'calc((100% - 7rem) / 7)'
    }
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
    justifyContent: 'space-around',
    margin: '0 0.5rem 1rem 0.5rem'
  },
  white: {
    backgroundColor: monoColors.find((color) => color.name === "White").hex
  }  
});

const TableView = (props) => {

  const classes = useStyles();

  const costs = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <div className={classes.tableViewMainContainer}>
      <React.Fragment>
        {monoColors.map(function (color) {
          const cards_color = props.componentState.displayed_cards.filter(function (card) {
            return card.color_identity.toString() === color.color_identity;
          });
          return (
            <div className={classes.cardWrapper} key={`table-${color.name}`}>
              <MUICard className={classes[`${color.name.toLowerCase()}`] + ' ' + classes.basicCard}>
                <MUICardHeader title={<MUITypography variant="h3">{`${color.name} (${cards_color.length})`}</MUITypography>} />
                <MUICardContent>
                  {["Creature", "Planeswalker", "Instant", "Sorcery", "Enchantment", "Artifact", "Land", "???"].map(function (type) {
                    const cards_color_type = cards_color.filter(function (card) {
                      return cardType(card.type_line) === type;
                    });
                    return (
                      <React.Fragment key={type}>
                        {cards_color_type.length > 0 &&
                          <React.Fragment>
                            <MUITypography variant="h4">{`${type} (${cards_color_type.length})`}</MUITypography>
                            <React.Fragment>
                              {costs.map(function (cost) {
                                const cards_color_type_cost = cards_color_type.filter(function (card) {
                                  return card.cmc === cost || (cost === 7 && card.cmc > cost);
                                });
                                return (
                                  <React.Fragment key={cost}>
                                    {cards_color_type_cost.length > 0 &&
                                      <div>
                                        {alphabeticalSort(cards_color_type_cost).map(function (card) {
                                          return (
                                            <MUITypography
                                              back_image={card.back_image}
                                              image={card.image}
                                              key={card._id}
                                              onMouseOut={props.hidePreview}
                                              onMouseOver={props.showPreview}
                                              style={{ cursor: 'default' }}
                                              variant="body1"
                                            >
                                              {card.name}
                                            </MUITypography>
                                          );
                                        })}
                                      </div>
                                    }
                                  </React.Fragment>
                                );
                              })}
                            </React.Fragment>
                          </React.Fragment>
                        }
                      </React.Fragment>
                    );
                  })}
                </MUICardContent>
              </MUICard>
            </div>
          );
        })}
      </React.Fragment>
      <div className={classes.cardWrapper}>
        <MUICard className={classes.multicolor + ' ' + classes.basicCard}>
          <MUICardHeader title={<MUITypography variant="h3">Multicolor</MUITypography>} />
          <MUICardContent>
            {multiColors.map(function (color) {
              const cards_color = props.componentState.displayed_cards.filter(function (card) {
                return card.color_identity.toString() === color.color_identity;
              });
              return (
                <React.Fragment key={color.name}>
                  {cards_color.length > 0 &&
                    <div>
                      <MUITypography variant="h4">{`${color.name} (${cards_color.length})`}</MUITypography>
                      <React.Fragment>
                        {[true, false].map(function (isCreature) {
                          const cards_color_isCreature = cards_color.filter(function (card) {
                            return isCreature ? cardType(card.type_line) === "Creature" : cardType(card.type_line) !== "Creature";
                          });
                          return (
                            <div key={isCreature ? "a" : "b"}>
                              <MUITypography variant="h5">{isCreature ? "Creature" : "Non-Creature"} {`(${cards_color_isCreature.length})`}</MUITypography>
                              <React.Fragment>
                                {costs.map(function (cost) {
                                  const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                                    return card.cmc === cost || (cost === 7 && card.cmc > cost);
                                  });
                                  return (
                                    <React.Fragment key={cost}>
                                      {cards_color_isCreature_cost.length > 0 &&
                                        <div>
                                          {alphabeticalSort(cards_color_isCreature_cost).map(function (card) {
                                            return (
                                              <MUITypography
                                                back_image={card.back_image}
                                                image={card.image}
                                                key={card._id}
                                                onMouseOut={props.hidePreview}
                                                onMouseOver={props.showPreview}
                                                style={{ cursor: 'default' }}
                                                variant="body1"
                                              >
                                                {card.name}
                                              </MUITypography>
                                            );
                                          })}
                                        </div>
                                      }
                                    </React.Fragment>
                                  );
                                })}
                              </React.Fragment>
                            </div>
                          );
                        })}
                      </React.Fragment>
                    </div>
                  }
                </React.Fragment>
              );
            })}
          </MUICardContent>
        </MUICard>
      </div>
    </div>
  );
}

export default TableView;