import React from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';

import SortableCard from './SortableCard';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: -4
  }
});

export default SortableContainer(({ cards, clickFunction, fromCollection }) => {

  const classes = useStyles();

  return (
    <div className={classes.container}>
      {cards.map((card, index) => (
        <SortableCard
          card={card}
          clickFunction={clickFunction}
          collection={fromCollection}
          index={index}
          key={card._id}
        >
        </SortableCard>
      ))}
    </div>
  );
});