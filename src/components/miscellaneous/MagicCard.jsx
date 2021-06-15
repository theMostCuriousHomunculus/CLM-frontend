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
  },
  paper: {
    backgroundSize: 'cover',
    // margin: 4,
    margin: 0,
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingTop: 36,
    padding: 0
  }
});

const MagicCard = (props) => {

  const classes = useStyles();
  const { cardData, children, clickFunction, rightClickFunction, style } = props;
  const { back_image, face_down_image, flipped, image } = cardData;
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
      className={classes.paper}
      onClick={clickFunction ? () => clickFunction() : () => null}
      onContextMenu={rightClickFunction ? (event) => rightClickFunction(event) : () => null}
      style={{
        backgroundImage: `url(${displayedImage})`,
        // default dimensions
        height: 264,
        width: 189,
        ...style
      }}
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
}

export default MagicCard;