const cardQuery = `
_id
cmc
color_identity
notes
scryfall_card {
  _id
  card_faces {
    image_uris {
      large
    }
    mana_cost
    name
    oracle_text
  }
  cmc
  collector_number
  color_identity
  image_uris {
    large
  }
  keywords
  mana_cost
  mtgo_id
  name
  oracle_text
  _set
  type_line
}
type_line
`;

export default `
_id
creator {
  _id
  avatar
  name
}
description
image {
  _id
  image_uris {
    art_crop
  }
  name
  card_faces {
    image_uris {
      art_crop
    }
    name
  }
}
mainboard {${cardQuery}}
modules {
  _id
  cards {${cardQuery}}
  name
}
name
published
rotations {
  _id
  cards {${cardQuery}}
  name
  size
}
sideboard {${cardQuery}}
`;
