import React from 'react';

import HoverPreview from './HoverPreview';

const ScryfallCardLink = ({ card }) => (
  <HoverPreview back_image={card.back_image} image={card.image}>
    <a href={card.scryfall_uri} rel="noreferrer" target="_blank">
      {card.name}
    </a>
  </HoverPreview>
);

export default ScryfallCardLink;
