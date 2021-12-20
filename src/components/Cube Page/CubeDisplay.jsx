import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import MUIWarningRoundedIcon from '@mui/icons-material/WarningRounded';
import { makeStyles } from '@mui/styles';

import customSort from '../../functions/custom-sort';
import generalCardType from '../../functions/general-card-type';
import specificCardType from '../../functions/specific-card-type';
import theme from '../../theme';
import HoverPreview from '../miscellaneous/HoverPreview';
import { monoColors, multiColors } from '../../constants/color-objects';
import {
  generalCardTypes,
  specificCardTypes
} from '../../constants/type-objects';
import { CubeContext } from '../../contexts/cube-context';
import { ReactComponent as MagicSVG } from '../../svgs/magic.svg';

const black = monoColors.find((color) => color.name === 'Black').hex;
const blue = monoColors.find((color) => color.name === 'Blue').hex;
const colorless = monoColors.find((color) => color.name === 'Colorless').hex;
const green = monoColors.find((color) => color.name === 'Green').hex;
const red = monoColors.find((color) => color.name === 'Red').hex;
const white = monoColors.find((color) => color.name === 'White').hex;

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
    backgroundColor: black
  },
  blue: {
    backgroundColor: blue
  },
  cardHeader: {
    paddingBottom: 2,
    '& *': {
      fontWeight: 'bold'
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
    backgroundColor: colorless
  },
  green: {
    backgroundColor: green
  },
  multicolor: {
    backgroundColor: '#efef8f'
  },
  azorius: {
    background: `linear-gradient(-45deg, ${white}, ${blue})`
  },
  boros: {
    background: `linear-gradient(-45deg, ${red}, ${white})`
  },
  dimir: {
    background: `linear-gradient(-45deg, ${blue}, ${black})`
  },
  golgari: {
    background: `linear-gradient(-45deg, ${black}, ${green})`
  },
  gruul: {
    background: `linear-gradient(-45deg, ${red}, ${green})`
  },
  izzet: {
    background: `linear-gradient(-45deg, ${blue}, ${red})`
  },
  orzhov: {
    background: `linear-gradient(-45deg, ${white}, ${black})`
  },
  rakdos: {
    background: `linear-gradient(-45deg, ${black}, ${red})`
  },
  simic: {
    background: `linear-gradient(-45deg, ${green}, ${blue})`
  },
  selesnya: {
    background: `linear-gradient(-45deg, ${green}, ${white})`
  },
  multicolorCardContent: {
    padding: 0
  },
  multicolorSection: {
    padding: 8
  },
  red: {
    backgroundColor: red
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
    backgroundColor: white
  }
});

export default function CubeDisplay({ setSelectedCard }) {
  const classes = useStyles();
  const {
    activeComponentState: { displayedCards }
  } = React.useContext(CubeContext);

  return (
    <div className={classes.tableViewMainContainer}>
      {monoColors.map(function (color) {
        const cards_color = displayedCards.filter(
          (card) => card.color_identity.toString() === color.color_identity
        );
        return (
          <MUICard
            className={`${classes[color.name.toLowerCase()]} ${
              classes.basicCard
            }`}
            key={`table-${color.name}`}
          >
            <MUICardHeader
              avatar={React.cloneElement(color.svg, {
                style: { height: 32, width: 32 }
              })}
              className={classes.cardHeader}
              title={
                <MUITypography variant="h3">
                  ({cards_color.length})
                </MUITypography>
              }
            />
            <MUICardContent>
              {specificCardTypes.map(function (type) {
                const cards_color_type = cards_color.filter(
                  (card) => specificCardType(card.type_line) === type.name
                );
                return (
                  <React.Fragment key={type.name}>
                    {cards_color_type.length > 0 && (
                      <React.Fragment>
                        <MUITypography
                          className={classes.typeText}
                          variant="h4"
                        >
                          {React.cloneElement(type.svg, {
                            style: { height: 20, marginRight: 8, width: 20 }
                          })}
                          {`${type.name} (${cards_color_type.length})`}
                        </MUITypography>
                        <div className={classes.cmcBlock}>
                          {[...Array(16).keys()].map(function (cost) {
                            const cards_color_type_cost =
                              cards_color_type.filter(
                                (card) => card.cmc === cost
                              );
                            return (
                              <React.Fragment key={cost}>
                                {cards_color_type_cost.length > 0 && (
                                  <div>
                                    {customSort(cards_color_type_cost, [
                                      'name'
                                    ]).map(function (card, index) {
                                      return (
                                        <span key={card._id}>
                                          <HoverPreview
                                            back_image={card.back_image}
                                            image={card.image}
                                          >
                                            <MUITypography
                                              onDoubleClick={() =>
                                                setSelectedCard(card)
                                              }
                                              style={{ cursor: 'pointer' }}
                                              variant="body1"
                                            >
                                              {index + 1}) {card.name}
                                              {!card.mtgo_id && (
                                                <MUITooltip
                                                  title={`This version of ${card.name} is not available on MTGO.`}
                                                >
                                                  <MUIWarningRoundedIcon
                                                    style={{
                                                      color:
                                                        theme.palette.warning
                                                          .main,
                                                      fontSize: 20
                                                    }}
                                                  />
                                                </MUITooltip>
                                              )}
                                            </MUITypography>
                                          </HoverPreview>
                                        </span>
                                      );
                                    })}
                                  </div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                );
              })}
            </MUICardContent>
          </MUICard>
        );
      })}
      <MUICard className={classes.multicolor + ' ' + classes.basicCard}>
        <MUICardHeader
          avatar={<MagicSVG style={{ height: 32, width: 32 }} />}
          className={classes.cardHeader}
          title={
            <MUITypography variant="h3">
              (
              {
                displayedCards.filter((card) => card.color_identity.length > 1)
                  .length
              }
              )
            </MUITypography>
          }
        />
        <MUICardContent className={classes.multicolorCardContent}>
          {multiColors.map(function (color) {
            const cards_color = displayedCards.filter(
              (card) => card.color_identity.toString() === color.color_identity
            );
            return (
              <React.Fragment key={color.name}>
                {cards_color.length > 0 && (
                  <div
                    className={`${classes[color.name.toLowerCase()]} ${
                      classes.multicolorSection
                    }`}
                  >
                    <MUITypography
                      className={classes.colorComboText}
                      variant="h4"
                    >
                      {color.svg &&
                        React.cloneElement(color.svg, {
                          style: { height: 24, marginRight: 8, width: 24 }
                        })}
                      {`${color.name} (${cards_color.length})`}
                    </MUITypography>
                    {generalCardTypes.map(function (type) {
                      const cards_color_type = cards_color.filter(
                        (card) => type.name === generalCardType(card.type_line)
                      );
                      return (
                        cards_color_type.length > 0 && (
                          <div key={`${color.name}-${type.name}`}>
                            <MUITypography
                              style={{
                                fontStyle: 'italic',
                                textAlign: 'center'
                              }}
                              variant="h4"
                            >
                              {React.cloneElement(type.svg, {
                                style: { height: 20, marginRight: 8, width: 20 }
                              })}
                              {type.name}
                            </MUITypography>
                            {customSort(cards_color_type, ['cmc']).map(
                              function (card, index) {
                                return (
                                  <span key={card._id}>
                                    <HoverPreview
                                      back_image={card.back_image}
                                      image={card.image}
                                    >
                                      <MUITypography
                                        onDoubleClick={() =>
                                          setSelectedCard(card)
                                        }
                                        style={{
                                          cursor: 'pointer',
                                          userSelect: 'none'
                                        }}
                                        variant="body1"
                                      >
                                        {index + 1}) {card.name}
                                        {!card.mtgo_id && (
                                          <MUITooltip
                                            title={`This version of ${card.name} is not available on MTGO.`}
                                          >
                                            <MUIWarningRoundedIcon
                                              style={{
                                                color:
                                                  theme.palette.warning.main,
                                                fontSize: 20
                                              }}
                                            />
                                          </MUITooltip>
                                        )}
                                      </MUITypography>
                                    </HoverPreview>
                                  </span>
                                );
                              }
                            )}
                          </div>
                        )
                      );
                    })}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </MUICardContent>
      </MUICard>
    </div>
  );
}
