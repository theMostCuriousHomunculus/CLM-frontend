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
    height: 200,
    // margin: 4,
    margin: 0,
    // paddingLeft: 20,
    // paddingRight: 20,
    // paddingTop: 36,
    padding: 0,
    width: 143
  }
});

const MagicCard = (props) => {

  const classes = useStyles();
  const { cardData, children, clickFunction, draggable, dragStartFunction, dragEndFunction, style } = props;
  const { back_image, face_down_image, flipped, image, x_coordinate, y_coordinate, z_index } = cardData;
  let displayedImage;
  
  if (image && !flipped) {
    displayedImage = image;
  } else if (back_image && flipped) {
    displayedImage = back_image;
  } else {
    displayedImage = face_down_image;
  }

  return (
    <div
      draggable={draggable}
      onDragEnd={(event) => {
        event.persist();
        dragEndFunction();
        event.target.style.opacity = 1;
      }}
      onDragStart={(event) => {
        event.persist();
        dragStartFunction();
        event.target.style.opacity = 0.3;
      }}
      style={{
        left: `${x_coordinate}%`,
        position: 'absolute',
        top: `${y_coordinate}%`,
        zIndex: z_index
      }}
    >
      <MUIPaper
        className={classes.paper}
        onClick={() => clickFunction(cardData)}
        style={{
          backgroundImage: `url(${displayedImage})`,
          ...style
        }}
      >
        {children || back_image && <div className={classes.buttonBar}>
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
    </div>
  );
}

export default MagicCard;