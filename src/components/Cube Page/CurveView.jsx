import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../../functions/alphabetical-sort';
import cardType from '../../functions/card-type';
import { monoColors, multiColors } from '../../constants/color-objects';
import { useCube } from '../../hooks/cube-hook';

const black = monoColors.find((color) => color.name === "Black").hex;
const blue = monoColors.find((color) => color.name === "Blue").hex;
const colorless = monoColors.find((color) => color.name === "Colorless").hex;
const green = monoColors.find((color) => color.name === "Green").hex;
const red = monoColors.find((color) => color.name === "Red").hex;
const white = monoColors.find((color) => color.name === "White").hex;

const useStyles = makeStyles({
  azorius: {
    background: `linear-gradient(45deg, ${white}, ${blue})`
    // background: `radial-gradient(${white}, #a7bfe7, ${blue})`
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
    marginTop: 16
  },
  curveViewSubContainer: {
    margin: 8
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

  console.log('render');
  const cubeState = useCube(true)[0];
  const classes = useStyles();

  return (
    <div className={classes.curveViewMainContainer}>
      {[...monoColors, ...multiColors].map(function (color) {
        const cards_color = cubeState.displayed_cards.filter(function (card) {
          return card.color_identity.toString() === color.color_identity;
        });
        return (
          <MUICard className={(classes[`${color.name.toLowerCase()}`] || classes.multicolor) + " " + classes.curveViewSubContainer} key={`curve-${color.name}`}>
            <MUICardHeader
              disableTypography={true}
              title={<MUITypography variant="subtitle1">{color.name}</MUITypography>}
            />
            <MUICardContent>
              {[true, false].map(function (isCreature) {
                const cards_color_isCreature = cards_color.filter(function (card) {
                  return isCreature ? cardType(card.type_line) === "Creature" : cardType(card.type_line) !== "Creature";
                });
                return (
                  <React.Fragment key={isCreature ? "a" : "b"}>
                    <MUITypography variant="subtitle2">{isCreature ? "Creature" : "Non-Creature"}</MUITypography>
                    <div className={classes.curveViewTypeContainer}>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(function (cost) {
                        const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                          return card.cmc === cost || (cost === 7 && card.cmc > cost);
                        });
                        return (
                          <div key={cost}>
                            <MUITypography variant="subtitle2">{cost} CMC</MUITypography>
                            {alphabeticalSort(cards_color_isCreature_cost).map(function (card) {
                              return (
                                <MUITypography
                                  back_image={card.back_image}
                                  image={card.image}
                                  key={card._id}
                                  onMouseOut={props.hidePreview}
                                  onMouseOver={props.showPreview}
                                  style={{ cursor: 'default' }}
                                  variant="body2"
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