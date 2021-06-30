import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITooltip from '@material-ui/core/Tooltip';
import { SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';

import theme from '../../theme';
import MagicCard from '../miscellaneous/MagicCard';

const useStyles = makeStyles({
  buttonBar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
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

export default SortableElement(({ card, clickFunction, fromCollection, moveCard, otherCollections }) => {

  const classes = useStyles();
  const [flipped, setFlipped] = React.useState(false);

  return (
    <MagicCard
      cardData={{ ...card, flipped }}
      clickFunction={clickFunction}
      flipHandler={() => setFlipped(prevState => !prevState)}
      style={{ cursor: 'grab', margin: 4 }}
    >
      <div className={classes.buttonBar}>
        {otherCollections.map(toCollection => (
          <MUITooltip key={toCollection} title={`Move to ${toCollection}`}>
            <MUIIconButton
              className={classes.iconButton}
              onClick={event => {
                moveCard(card._id, toCollection, fromCollection);
                event.stopPropagation();
              }}
              size='small'
            >
              {toCollection[0].toUpperCase()}
            </MUIIconButton>
          </MUITooltip>
        ))}
      </div>
    </MagicCard>
  );
});