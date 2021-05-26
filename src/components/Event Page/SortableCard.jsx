import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITooltip from '@material-ui/core/Tooltip';
import { SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';

import MagicCard from './MagicCard';
import theme from '../../theme';

const useStyles = makeStyles({
  iconButton: {
    background: theme.palette.primary.main,
    color: '#ffffff',
    height: 30,
    width: 30,
    '&:hover': {
      background: theme.palette.primary.dark,
      padding: 18
    }
  }
});

export default SortableElement(({ card, clickFunction, fromCollection, moveCard, toCollection1, toCollection2 }) => {

  const classes = useStyles();

  return (
    <MagicCard
      cardData={card}
      clickFunction={clickFunction}
      cursor="grab"
    >
      {toCollection1 &&
        <MUITooltip title={`Move to ${toCollection1}`}>
          <MUIIconButton
            className={classes.iconButton}
            onClick={() => moveCard(card._id, toCollection1, fromCollection)}
            size="small"
          >
            {toCollection1[0].toUpperCase()}
          </MUIIconButton>
        </MUITooltip>
      }

      {toCollection2 &&
        <MUITooltip title={`Move to ${toCollection2}`}>
          <MUIIconButton
            className={classes.iconButton}
            onClick={() => moveCard(card._id, toCollection2, fromCollection)}
            size="small"
          >
            {toCollection2[0].toUpperCase()}
          </MUIIconButton>
        </MUITooltip>
      }
    </MagicCard>
  );
});