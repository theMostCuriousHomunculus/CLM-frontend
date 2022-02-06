const cardQuery = `
_id
cmc
color_identity
notes
scryfall_id
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
image
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
