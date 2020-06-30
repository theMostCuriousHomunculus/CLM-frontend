import React from 'react';
import {
  Card as MUICard,
  CardContent as MUICardContent,
  CardHeader as MUICardHeader,
  Typography as MUITypography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  black: {
    backgroundColor: '#8f8f8f'
  },
  blue: {
    backgroundColor: '#5f8fdf'
  },
  colorless: {
    backgroundColor: '#bfbfbf'
  },
  green: {
    backgroundColor: '#8fdf8f'
  },
  multicolor: {
    backgroundColor: '#efef8f'
  },
  red: {
    backgroundColor: '#df5f5f'
  },
  tableViewMainContainer: {
    display: 'grid',
    gap: '0.5rem',
    gridTemplateColumns: 'repeat(7, 1fr)',
    margin: '1rem',
  },
  white: {
    backgroundColor: '#efefef'
  }
});

const TableView = (props) => {

  const classes = useStyles();

  const monoColors = ["White", "Blue", "Black", "Red", "Green", "Colorless"];
  const multiColors = ["Azorius", "Boros", "Dimir", "Golgari", "Gruul", "Izzet", "Orzhov", "Rakdos", "Selesnya", "Simic", "Abzan", "Bant", "Esper", "Grixis", "Jeskai", "Jund", "Mardu", "Naya", "Sultai", "Temur", "WUBR", "WUBG", "WURG", "WBRG", "UBRG", "WUBRG"];
  const types = ["Creature", "Planeswalker", "Instant", "Sorcery", "Enchantment", "Artifact", "Land", "???"];
  const costs = ["0", "1", "2", "3", "4", "5", "6", "7+"];

  return (
    <div className={classes.tableViewMainContainer}>
      <React.Fragment>
        {monoColors.map(function (color) {
          const cards_color = props.componentState.displayed_cards.filter(function (card) {
            return card.color === color;
          });
          return (
            <MUICard className={classes[`${color.toLowerCase()}`]} key={`table-${color}`}>
              <MUICardHeader title={<MUITypography variant="h3">{color}</MUITypography>} />
              <MUICardContent>
                {types.map(function (type) {
                  const cards_color_type = cards_color.filter(function (card) {
                    return card.type === type;
                  });
                  return (
                    <React.Fragment key={type}>
                      {cards_color_type.length > 0 &&
                        <div>
                          <h4>{type}</h4>
                          <React.Fragment>
                            {costs.map(function (cost) {
                              const cards_color_type_cost = cards_color_type.filter(function (card) {
                                return card.cost === cost;
                              });
                              return (
                                <div key={cost}>
                                  {cards_color_type_cost.map(function (card) {
                                    return (
                                      <div
                                        back_image={card.back_image}
                                        image={card.image}
                                        key={card._id}
                                        onMouseOut={props.hidePreview}
                                        onMouseOver={props.showPreview}
                                      >
                                        {card.name}
                                      </div>
                                    );
                                  })}
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
          );
        })}
      </React.Fragment>
      <MUICard className={classes.multicolor}>
        <MUICardHeader title={<MUITypography variant="h3">Multicolor</MUITypography>} />
        <MUICardContent>
          {multiColors.map(function (color) {
            const cards_color = props.componentState.displayed_cards.filter(function (card) {
              return card.color === color;
            });
            return (
              <React.Fragment key={color}>
                {cards_color.length > 0 &&
                  <div>
                    <MUITypography variant="h4">{color}</MUITypography>
                    <React.Fragment>
                      {[true, false].map(function (isCreature) {
                        const cards_color_isCreature = cards_color.filter(function (card) {
                          return isCreature ? card.type === "Creature" : card.type !== "Creature";
                        });
                        return (
                          <div key={isCreature ? "a" : "b"}>
                            <h4>{isCreature ? "Creature" : "Non-Creature"}</h4>
                            <React.Fragment>
                              {costs.map(function (cost) {
                                const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                                  return card.cost === cost;
                                });
                                return (
                                  <div key={cost}>
                                    {cards_color_isCreature_cost.map(function (card) {
                                      return (
                                        <div
                                          back_image={card.back_image}
                                          image={card.image}
                                          key={card._id}
                                          onMouseOut={props.hidePreview}
                                          onMouseOver={props.showPreview}
                                        >
                                          {card.name}
                                        </div>
                                      );
                                    })}
                                  </div>
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

export default TableView;