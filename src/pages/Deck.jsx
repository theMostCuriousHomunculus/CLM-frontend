import React from 'react';

import DeckDisplay from '../components/miscellaneous/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';

export default function Deck() {
  return (
    <React.Fragment>
      <DeckInfo />

      <DeckDisplay />
    </React.Fragment>
  );
}
