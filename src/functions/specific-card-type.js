export default function cardType (type_line) {

  let type = type_line;

  if (type.includes("Creature")) {
    type = "Creature";
  } else if (type.includes("Planeswalker")) {
    type = "Planeswalker";
  } else if (type.includes("Instant")) {
    type = "Instant";
  } else if (type.includes("Sorcery")) {
    type = "Sorcery";
  } else if (type.includes("Enchantment")) {
    type = "Enchantment";
  } else if (type.includes("Artifact")) {
    type = "Artifact";
  } else if (type.includes("Land")) {
    type = "Land";
  } else {
    type = "???"
  }

  return type;
}