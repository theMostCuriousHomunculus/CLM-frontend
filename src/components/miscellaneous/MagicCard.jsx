import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';

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
    face_down,
    face_down_image,
    flipped,
    image,
    tapped
  } = cardData;
  
  let displayedImage;

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

  let css = {
    backgroundImage: `url(${displayedImage})`,
    backgroundSize: 'cover',
    height: 264,
    justifyContent: 'space-between',
    margin: 0,
    padding: '30px 15px',
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
    }
  }

  const useStyles = makeStyles({
    magicCard: css
  });

  const classes = useStyles();

  return (
    <MUIPaper
      className={`${classes.magicCard}${className ? ' ' + className : ''}`}
      id={`drag-${_id}`}
      onClick={() => clickFunction(cardData)}
      onContextMenu={event => rightClickFunction(event)}
      style={{
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