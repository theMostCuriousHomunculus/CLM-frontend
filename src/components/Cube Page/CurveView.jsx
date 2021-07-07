import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../../functions/custom-sort';
import cardType from '../../functions/specific-card-type';
import HoverPreview from '../miscellaneous/HoverPreview';
import { monoColors, multiColors } from '../../constants/color-objects';

const black = monoColors.find(color => color.name === "Black").hex;
const blue = monoColors.find(color => color.name === "Blue").hex;
const colorless = monoColors.find(color => color.name === "Colorless").hex;
const green = monoColors.find(color => color.name === "Green").hex;
const red = monoColors.find(color => color.name === "Red").hex;
const white = monoColors.find(color => color.name === "White").hex;

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

export default function CurveView ({
  cards,
  setSelectedCard
}) {

  const classes = useStyles();

  return (
    <React.Fragment>
      {[...monoColors, ...multiColors].map(function (color) {
        const cards_color = cards.filter(card => card.color_identity.toString() === color.color_identity);
        return (
          <MUICard className={(classes[`${color.name.toLowerCase()}`] || classes.multicolor)} key={`curve-${color.name}`}>
            <MUICardHeader title={color.name} />
            <MUICardContent style={{ overflowX: 'auto' }}>
              {[true, false].map(function (isCreature) {
                const cards_color_isCreature = cards_color.filter(function (card) {
                  return isCreature ? cardType(card.type_line) === "Creature" : cardType(card.type_line) !== "Creature";
                });
                return (
                  <React.Fragment key={isCreature ? "a" : "b"}>
                    <MUITypography variant="subtitle1">{isCreature ? "Creature" : "Non-Creature"}</MUITypography>
                    <div className={classes.curveViewTypeContainer}>
                      {[0, 1, 2, 3, 4, 5, 6, 7].map(function (cost) {
                        const cards_color_isCreature_cost = cards_color_isCreature.filter(function (card) {
                          return card.cmc === cost || (cost === 7 && card.cmc > cost);
                        });
                        return (
                          <div key={cost} style={{ display: 'flex', flexDirection: 'column' }}>
                            <MUITypography variant="subtitle2">{cost} CMC</MUITypography>
                            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'flex-end' }}>
                              {customSort(cards_color_isCreature_cost, ['name']).map(function (card) {
                                return (
                                  <span key={card._id}>
                                    <HoverPreview back_image={card.back_image} image={card.image}>
                                      <MUITypography
                                        onDoubleClick={() => setSelectedCard(card)}
                                        style={{ cursor: 'pointer' }}
                                        variant="body1"
                                      >
                                        {card.name}
                                      </MUITypography>
                                    </HoverPreview>
                                  </span>
                                );
                              })}
                            </div>
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
    </React.Fragment>
  );
};