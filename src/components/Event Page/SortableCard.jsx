import React from 'react';
import { SortableElement } from 'react-sortable-hoc';

import MagicCard from '../miscellaneous/MagicCard';

export default SortableElement(({ card, clickFunction }) => {

  const [flipped, setFlipped] = React.useState(false);

  return (
    <MagicCard
      cardData={{ ...card, flipped }}
      clickFunction={clickFunction}
      flipHandler={() => setFlipped(prevState => !prevState)}
      style={{ cursor: 'grab', margin: 4 }}
    />
  );
});