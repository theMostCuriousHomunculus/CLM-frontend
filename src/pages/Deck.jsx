import React from 'react';

import DeckDisplay from '../components/Deck Page/DeckDisplay';
import DeckInfo from '../components/Deck Page/DeckInfo';

export default function Deck() {
  return (
    <React.Fragment>
      <DeckInfo />

      <DeckDisplay />
    </React.Fragment>
  );
}
