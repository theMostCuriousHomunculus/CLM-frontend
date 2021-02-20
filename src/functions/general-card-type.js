export default function cardType (type_line) {

  let type = type_line;

  if (type.includes("Creature")) {
    type = "Creature";
  } else if (type.includes("Land")) {
    type = "Land";
  } else {
    type = "Non-Creature"
  }

  return type;
}