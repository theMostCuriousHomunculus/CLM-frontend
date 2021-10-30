import React from 'react';
import MUIAutorenewIcon from '@mui/icons-material/Autorenew';
import MUIBadge from '@mui/material/Badge';
import MUIIconButton from '@mui/material/IconButton';
import MUIPaper from '@mui/material/Paper';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import lightGreen from '@mui/material/colors/lightGreen';
import deepOrange from '@mui/material/colors/deepOrange';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import HoverPreview from './HoverPreview';

export default function MagicCard({
  cardData,
  clickFunction = () => null,
  customStyle,
  flipHandler,
  hoverPreview,
  rightClickFunction = () => null,
  // for Draggable wrapped cards
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd
}) {
  const {
    _id,
    back_image,
    counters,
    face_down,
    face_down_image,
    flipped,
    image,
    isCopyToken,
    tapped
  } = cardData;

  let displayedImage;

  switch (face_down_image) {
    case 'foretell':
      displayedImage = '"/images/Foretell.jpg"';
      break;
    case 'manifest':
      displayedImage = '"/images/Manifest.jpg"';
      break;
    case 'morph':
      displayedImage = '"/images/Morph.jpg"';
      break;
    default:
      displayedImage = '"/images/MTG Card Back.jpg"';
  }

  let css = {
    backgroundImage: `url(${displayedImage})`,
    backgroundSize: 'cover',
    borderRadius: 8,
    height: 264,
    justifyContent: 'space-between',
    margin: 0,
    padding: 0,
    position: 'relative',
    width: 189
  };

  if (face_down) {
    // cards in graveyards are always faceup and visible to all players.
    if (image) {
      css = {
        ...css,
        '&:hover': {
          backgroundImage: `url(${image})`
        }
      };
    }
  } else {
    if (image && !flipped) {
      displayedImage = image;
    } else if (back_image && flipped) {
      displayedImage = back_image;
    }

    css = {
      ...css,
      backgroundImage: `url(${displayedImage})`
    };
  }

  if (isCopyToken) {
    css = {
      ...css,
      boxShadow: 'inset 1000px 0 0 0 rgba(255, 255, 0, 0.5)'
    };
  }

  const useStyles = makeStyles({
    counterBadge: {
      '& > .MuiBadge-badge': {
        transform: 'translate(12px, -12px)'
      }
    },
    counterContainer: {
      padding: '12px 12px 4px 4px'
    },
    countersContainer: {
      alignContent: 'space-between',
      display: 'flex',
      flexWrap: 'wrap',
      height: '100%',
      justifyContent: 'space-between',
      left: 0,
      overflowY: 'auto',
      position: 'absolute',
      top: 0,
      width: '100%'
    },
    counterIcon: {
      background: '#afafaf',
      borderRadius: '100%',
      height: 24,
      position: 'relative',
      width: 24
    },
    counterLabel: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    },
    flipButton: {
      background: theme.palette.primary.main,
      color: '#ffffff',
      height: 30,
      left: '50%',
      position: 'absolute',
      top: '44%',
      transform: 'translateX(-50%)',
      width: 30,
      '&:hover': {
        background: theme.palette.primary.dark
      }
    },
    magicCard: css
  });

  const classes = useStyles();

  return (
    <MUIPaper
      className={`${classes.magicCard}${className ? ' ' + className : ''}`}
      id={`drag-${_id}`}
      onClick={() => clickFunction(cardData)}
      onContextMenu={(event) => rightClickFunction(event)}
      style={{
        ...customStyle,
        ...style,
        transform: `${style && style.transform ? style.transform : ''}${
          tapped ? ' rotate(90deg)' : ''
        }`
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {hoverPreview && (
        <HoverPreview back_image={back_image} image={image}>
          <div
            className={classes.countersContainer}
            id={`hover-${_id}`}
            onClick={(event) => {
              clickFunction(cardData);
              event.stopPropagation();
            }}
          >
            {counters &&
              counters.map((counter) => {
                const style = {};
                if (counter.counterType === '+1/+1')
                  style.backgroundColor = lightGreen[500];
                if (counter.counterType === '-1/-1')
                  style.backgroundColor = deepOrange[500];
                return (
                  <div
                    className={classes.counterContainer}
                    key={counter.counterType}
                  >
                    <MUIBadge
                      badgeContent={counter.counterAmount}
                      className={classes.counterBadge}
                      color="primary"
                      overlap="circular"
                    >
                      <MUITooltip title={counter.counterType}>
                        <div className={classes.counterIcon} style={style}>
                          <MUITypography
                            className={classes.counterLabel}
                            variant="caption"
                          >
                            {counter.counterType[0].toUpperCase()}
                          </MUITypography>
                        </div>
                      </MUITooltip>
                    </MUIBadge>
                  </div>
                );
              })}
          </div>
        </HoverPreview>
      )}
      {back_image && (
        <MUITooltip title="Flip Card">
          <MUIIconButton
            className={classes.flipButton}
            onClick={(event) => {
              flipHandler();
              event.stopPropagation();
            }}
            size="small"
          >
            <MUIAutorenewIcon />
          </MUIIconButton>
        </MUITooltip>
      )}
    </MUIPaper>
  );
}
