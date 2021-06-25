import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';

import SortableCard from './SortableCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  }
});

export default SortableContainer(({ cards, clickFunction, fromCollection, moveCard, toCollection1, toCollection2 }) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {cards.map(function (card, index) {
        return (
          <SortableCard
            card={card}
            clickFunction={clickFunction}
            collection={fromCollection}
            fromCollection={fromCollection}
            index={index}
            key={card._id}
            moveCard={moveCard}
            toCollection1={toCollection1}
            toCollection2={toCollection2}
          >
          </SortableCard>
        );
      })}
    </div>
  );
});