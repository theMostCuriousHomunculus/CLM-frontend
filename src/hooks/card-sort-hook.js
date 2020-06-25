export const useCardSort = () => {

  function appendPropertiesAndSort (cards) {

    cards.forEach(function (card) {
      card['cost'] = getCost(card);
      card['color'] = getColor(card);
      card['type'] = getType(card);
    });

    cards.sort(function (a, b) {
      return a['name'].localeCompare(b['name']);
    });

    return cards;
  }

  function getCost (card) {

    const COST_MAP = new Map ([
      [0, "0"],
      [1, "1"],
      [2, "2"],
      [3, "3"],
      [4, "4"],
      [5, "5"],
      [6, "6"],
      [7, "7+"],
      [8, "7+"],
      [9, "7+"],
      [10, "7+"],
      [11, "7+"],
      [12, "7+"],
      [13, "7+"],
      [14, "7+"],
      [15, "7+"],
      [16, "7+"]
    ]);

    return COST_MAP.get(card.cmc);
  }

  function getColor (card) {

    const COLOR_MAP = new Map ([
      ["W", "White"],
      ["U", "Blue"],
      ["B", "Black"],
      ["R", "Red"],
      ["G", "Green"],
      ["", "Colorless"],
      ["U,W", "Azorius"],
      ["R,W", "Boros"],
      ["B,U", "Dimir"],
      ["B,G", "Golgari"],
      ["G,R", "Gruul"],
      ["R,U", "Izzet"],
      ["B,W", "Orzhov"],
      ["B,R", "Rakdos"],
      ["G,W", "Selesnya"],
      ["G,U", "Simic"],
      ["B,G,W", "Abzan"],
      ["G,U,W", "Bant"],
      ["B,U,W", "Esper"],
      ["B,R,U", "Grixis"],
      ["R,U,W", "Jeskai"],
      ["B,G,R", "Jund"],
      ["B,R,W", "Mardu"],
      ["G,R,W", "Naya"],
      ["B,G,U", "Sultai"],
      ["G,R,U", "Temur"],
      ["B,R,U,W", "WUBR"],
      ["B,G,U,W", "WUBG"],
      ["G,R,U,W", "WURG"],
      ["B,G,R,W", "WBRG"],
      ["B,G,R,U", "UBRG"],
      ["B,G,R,U,W", "WUBRG"]
    ]);

    return COLOR_MAP.get(card.color_identity.toString());
  }

  function getType (card) {

    let type = card.type_line;

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
    } else {
      type = "Land";
    }

    return type;
  }

  return { appendPropertiesAndSort };
}