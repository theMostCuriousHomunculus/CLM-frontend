import React from 'react';
import { Card as MUICard } from '@material-ui/core/Card';
import { CardContent as MUICardContent } from '@material-ui/core/CardContent';
import { CardHeader as MUICardHeader } from '@material-ui/core/CardHeader';
import { Typography as MUITypography } from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const black = '#8f8f8f';
const blue = '#5f8fdf';
const colorless = '#bfbfbf';
const green = '#8fdf8f';
const red = '#df5f5f';
const white = '#efefef';

const useStyles = makeStyles({
  azorius: {
    background: `linear-gradient(45deg, ${white}, ${blue})`
  },
  black: {
    backgroundColor: black
  },
  blue: {
    backgroundColor: blue
  },
  boros: {
    background: `linear-gradient(45deg, ${red}, ${white})`
  },
  colorless: {
    backgroundColor: colorless
  },
  curveViewMainContainer: {
    margin: '1rem'
  },
  curveViewSubContainer: {
    margin: '1rem 0'
  },
  curveViewTypeContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(8, 1fr)'
  },
  dimir: {
    background: `linear-gradient(45deg, ${blue}, ${black})`
  },
  golgari: {
    background: `linear-gradient(45deg, ${black}, ${green})`
  },
  green: {
    backgroundColor: green
  },
  gruul: {
    background: `linear-gradient(45deg, ${red}, ${green})`
  },
  izzet: {
    background: `linear-gradient(45deg, ${blue}, ${red})`
  },
  multicolor: {
    backgroundColor: '#efef8f'
  },
  orzhov: {
    background: `linear-gradient(45deg, ${white}, ${black})`
  },
  rakdos: {
    background: `linear-gradient(45deg, ${black}, ${red})`
  },
  red: {
    backgroundColor: red
  },
  simic: {
    background: `linear-gradient(45deg, ${green}, ${blue})`
  },
  selesnya: {
    background: `linear-gradient(45deg, ${green}, ${white})`
  },
  white: {
    backgroundColor: white
  }
});

const CubeView = (props) => {

  const classes = useStyles();

  const monoColors = ["White", "Blue", "Black", "Red", "Green", "Colorless"];
  const multiColors = ["Azorius", "Boros", "Dimir", "Golgari", "Gruul", "Izzet", "Orzhov", "Rakdos", "Selesnya", "Simic", "Abzan", "Bant", "Esper", "Grixis", "Jeskai", "Jund", "Mardu", "Naya", "Sultai", "Temur", "WUBR", "WUBG", "WURG", "WBRG", "UBRG", "WUBRG"];
  const costs = ["0", "1", "2", "3", "4", "5", "6", "7+"];

  return (
    <div className={classes.curveViewMainContainer}>
      {[...monoColors, ...multiColors].map(function (color) {
        const cards_color = props.componentState.displayed_cards.filter(function (card) {
          return card.color === color;
        });
        return (
          <MUICard className={(classes[`${color.toLowerCase()}`] || classes.multicolor) + " " + classes.curveViewSubContainer} key={`curve-${color}`}>
            <MUICardHeader title={<MUITypography variant="h3">{color}</MUITypography>} />
            <MUICardContent>
              {[true, false].map(function (isCreature) {
                const cards_color_isCreature = cards_color.filter(function (card) {
                  return isCreature ? card.type === "Creature" : card.type !== "Creature";
                });
                return (
                  <React.Fragment key={isCreature ? "a" : "b"}>
                    <MUITypography variant="h4">{isCreature ? "Creature" : "Non-Creature"}</MUITypography>
                    <div className={classes.curveViewTypeContainer}>
                      {costs.map(function (cost) {
                        const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                          return card.cost === cost;
                        });
                        return (
                          <div key={cost}>
                            <MUITypography variant="h5">{cost} CMC</MUITypography>
                            {cards_color_isCreature_cost.map(function (card) {
                              return (
                                <MUITypography
                                  back_image={card.back_image}
                                  image={card.image}
                                  key={card._id}
                                  onMouseOut={props.hidePreview}
                                  onMouseOver={props.showPreview}
                                  variant="body1"
                                >
                                  {card.name}
                                </MUITypography>
                              );
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </React.Fragment>
                );
              })}
            </MUICardContent>
          </MUICard>
        );
      })}
    </div>
  );
}

export default CubeView;