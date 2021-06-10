import React from 'react';
import MUIAutorenewIcon from '@material-ui/icons/Autorenew';
import MUIIconButton from '@material-ui/core/IconButton';
import MUIPaper from '@material-ui/core/Paper';
import MUITooltip from '@material-ui/core/Tooltip';
import ReactCardFlip from 'react-card-flip';
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
      background: theme.palette.primary.dark,
      padding: 18
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
  const { cardData, children, clickFunction, cursor } = props;
  const { back_image, image, tapped } = cardData;
  const [flipped, setFlipped] = React.useState(false);

  return (
    <ReactCardFlip infinite={true} isFlipped={flipped}>
      <MUIPaper
        className={classes.paper}
        key="front"
        onClick={() => clickFunction(cardData)}
        style={{
          backgroundImage: `url(${image})`,
          cursor,
          transform: tapped ? 'rotate(90deg)' : ''
        }}
      >
        <div className={classes.buttonBar}>
          {children && children[0]}

          {back_image &&
            <MUITooltip title="Flip to Back Face">
              <MUIIconButton
                className={classes.iconButton}
                onClick={() => setFlipped(true)}
                size="small"
              >
                <MUIAutorenewIcon />
              </MUIIconButton>
            </MUITooltip>
          }

          {children && children[1]}
        </div>
      </MUIPaper>
      <MUIPaper
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
    </ReactCardFlip>
  );
}

export default MagicCard;