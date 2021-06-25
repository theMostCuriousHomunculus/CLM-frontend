import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  magicCard: {
    backgroundSize: 'cover',
    height: 264,
    justifyContent: 'space-between',
    margin: 0,
    padding: '30px 15px',
    position: 'relative',
    width: 189,
  }
});

export default function MagicCard ({
  cardData,
  children,
  clickFunction = () => null,
  customStyle,
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
    face_down_image,
    flipped,
    image,
    tapped
  } = cardData;
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
      className={`${classes.magicCard}${className ? ' ' + className : ''}`}
      id={`drag-${_id}`}
      onClick={() => clickFunction(cardData)}
      onContextMenu={event => rightClickFunction(event)}
      style={{
        backgroundImage: `url(${displayedImage})`,
        ...customStyle,
        ...style,
        transform: `${ style && style.transform ? style.transform : ''}${tapped ? ' rotate(90deg)' : ''}`
      }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {children}
    </MUIPaper>
  );
};