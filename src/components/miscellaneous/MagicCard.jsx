import React from 'react';
import MUIAutorenewIcon from '@material-ui/icons/Autorenew';
import MUIIconButton from '@material-ui/core/IconButton';
import MUIPaper from '@material-ui/core/Paper';
import MUITooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';

const useStyles = makeStyles({
  buttonBar: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  iconButton: {
    background: theme.palette.primary.main,
    color: '#ffffff',
    height: 30,
    width: 30,
    '&:hover': {
      background: theme.palette.primary.dark
    }
  }
});

export default function MagicCard ({
  cardData: {
    _id,
    back_image,
    face_down_image,
    flipped,
    image,
    tapped
  },
  children,
  clickFunction,
  customStyle,
  rightClickFunction,
  // for Draggable wrapped cards
  style,
  className,
  onMouseDown,
  onMouseUp,
  onTouchStart,
  onTouchEnd
}) {

  const classes = useStyles();
  let displayedImage;
  
  if (image && !flipped) {
    displayedImage = image;
  } else if (back_image && flipped) {
    displayedImage = back_image;
  } else {
    switch(face_down_image) {
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
  }

  return (
    <MUIPaper
      className={className}
      id={`drag-${_id}`}
      onClick={clickFunction ? () => clickFunction() : () => null}
      onContextMenu={rightClickFunction ? (event) => rightClickFunction(event) : () => null}
      style={{
        backgroundImage: `url(${displayedImage})`,
        backgroundSize: 'cover',
        height: 264,
        margin: 0,
        padding: 0,
        width: 189,
        ...customStyle,
        ...style,
        transform: `${style.transform ? style.transform : ''}${tapped ? ' rotate(90deg)' : ''}`
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {(children || back_image) && <div className={classes.buttonBar}>
        {children && children[0]}

        {back_image &&
          <MUITooltip title="Flip Card">
            <MUIIconButton
              className={classes.iconButton}
              // onClick={() => setFlipped(true)}
              size="small"
            >
              <MUIAutorenewIcon />
            </MUIIconButton>
          </MUITooltip>
        }

        {children && children[1]}
      </div>}
    </MUIPaper>
  );
};