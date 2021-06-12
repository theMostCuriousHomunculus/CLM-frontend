import React from 'react';
import MUIAutorenewIcon from '@material-ui/icons/Autorenew';
import MUIIconButton from '@material-ui/core/IconButton';
import MUIPaper from '@material-ui/core/Paper';
import MUITooltip from '@material-ui/core/Tooltip';
// import ReactCardFlip from 'react-card-flip';
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
    margin: 4,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 36,
    width: 143
  }
});

const MagicCard = (props) => {

  const classes = useStyles();
  const { cardData, children, clickFunction, cursor, draggable, dragStartFunction, dragEndFunction, style } = props;
  const { back_image, face_down_image, flipped, image, tapped } = cardData;
  const [dragging, setDragging] = React.useState(false);
  let displayedImage;
  
  if (image && !flipped) {
    displayedImage = image;
  } else if (back_image && flipped) {
    displayedImage = back_image;
  } else {
    displayedImage = face_down_image;
  }

  return (
    /*<ReactCardFlip infinite={true} isFlipped={flipped}>*/
      <MUIPaper
        className={classes.paper}
        draggable={draggable}
        key="front"
        onClick={() => clickFunction(cardData)}
        onDragEnd={(event) => {
          dragEndFunction();
          setDragging(false);
        }}
        onDragStart={() => {
          dragStartFunction();
          setTimeout(() => setDragging(true), 0);
        }}
        style={{
          backgroundImage: `url(${displayedImage})`,
          cursor,
          display: dragging ? 'none' : 'inherit',
          transform: tapped ? 'rotate(90deg)' : '',
          ...style
        }}
      >
        <div className={classes.buttonBar}>
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
        </div>
      </MUIPaper>
      /*<MUIPaper
        className={classes.paper}
        key="back"
        onClick={clickFunction}
        style={{
          backgroundImage: `url(${back_image})`,
          cursor,
          transform: tapped ? 'rotate(90deg)' : ''
        }}
      >
        <div className={classes.buttonBar}>
          {children && children[0]}

          <MUITooltip title="Flip to Front Face">
            <MUIIconButton
              className={classes.iconButton}
              onClick={() => setFlipped(false)}
              size="small"
            >
              <MUIAutorenewIcon />
            </MUIIconButton>
          </MUITooltip>
          
          {children && children[1]}
        </div>
      </MUIPaper>
    </ReactCardFlip>*/
  );
}

export default MagicCard;