import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../../functions/alphabetical-sort';
import cardType from '../../functions/card-type';
import theme from '../../theme';
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
  cardHeader: {
    textAlign: 'center',
    '& *': {
      lineHeight: 1
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
    justifyContent: 'space-around',
    padding: 4
  },
  typeText: {
    borderTop: '1px solid black',
    fontWeight: 'bold'
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
          const cards_color = props.displayedCards.filter(function (card) {
            return card.color_identity.toString() === color.color_identity;
          });
          return (
            <MUICard className={classes[`${color.name.toLowerCase()}`] + ' ' + classes.basicCard} key={`table-${color.name}`}>
              <MUICardHeader
                disableTypography={true}
                className={classes.cardHeader}
                title={<MUITypography variant="subtitle1">{color.name}</MUITypography>}
                subheader={<MUITypography variant="subtitle1">({cards_color.length})</MUITypography>}
              />
              <MUICardContent>
                {["Creature", "Planeswalker", "Instant", "Sorcery", "Enchantment", "Artifact", "Land", "???"].map(function (type) {
                  const cards_color_type = cards_color.filter(function (card) {
                    return cardType(card.type_line) === type;
                  });
                  return (
                    <React.Fragment key={type}>
                      {cards_color_type.length > 0 &&
                        <React.Fragment>
                          <MUITypography className={classes.typeText} variant="subtitle2">
                            {`${type} (${cards_color_type.length})`}
                          </MUITypography>
                          <React.Fragment>
                            {costs.map(function (cost) {
                              const cards_color_type_cost = cards_color_type.filter(function (card) {
                                return card.cmc === cost || (cost === 7 && card.cmc > cost);
                              });
                              return (
                                <React.Fragment key={cost}>
                                  {cards_color_type_cost.length > 0 &&
                                    <div>
                                      {alphabeticalSort(cards_color_type_cost, 'name').map(function (card) {
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
          );
        })}
      </React.Fragment>
      <MUICard className={classes.multicolor + ' ' + classes.basicCard}>
        <MUICardHeader
          className={classes.cardHeader}
          disableTypography={true}
          title={<MUITypography variant="subtitle1">Multicolor</MUITypography>}
          subheader={<MUITypography variant="subtitle1">
            ({props.displayedCards.filter(function (card) {
              return card.color_identity.length > 1;
            }).length})
          </MUITypography>}
        />
        <MUICardContent>
          {multiColors.map(function (color) {
            const cards_color = props.displayedCards.filter(function (card) {
              return card.color_identity.toString() === color.color_identity;
            });
            return (
              <React.Fragment key={color.name}>
                {cards_color.length > 0 &&
                  <div>
                    <MUITypography className={classes.colorComboText} variant="subtitle2">
                      {`${color.name} (${cards_color.length})`}
                    </MUITypography>
                    <React.Fragment>
                      {[true, false].map(function (isCreature) {
                        const cards_color_isCreature = cards_color.filter(function (card) {
                          return isCreature ? cardType(card.type_line) === "Creature" : cardType(card.type_line) !== "Creature";
                        });
                        return (
                          <div key={isCreature ? "a" : "b"}>
                            <MUITypography style={{ fontStyle: 'italic' }} variant="subtitle2">
                              {isCreature ? "Creature" : "Non-Creature"}
                            </MUITypography>
                            <React.Fragment>
                              {costs.map(function (cost) {
                                const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                                  return card.cmc === cost || (cost === 7 && card.cmc > cost);
                                });
                                return (
                                  <React.Fragment key={cost}>
                                    {cards_color_isCreature_cost.length > 0 &&
                                      alphabeticalSort(cards_color_isCreature_cost, 'name').map(function (card) {
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
                                      })
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
  );
}

function mapStateToProps (state) {
  return {
    displayedCards: state.displayed_cards
  };
}

export default connect(mapStateToProps)(React.memo(TableView));