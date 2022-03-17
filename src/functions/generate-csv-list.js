export default function generateCSVList(cards) {
  let mainboard = '';
  let sideboard = '';

  for (const card of cards) {
    const {
      mainboard_count,
      scryfall_card: { mtgo_id, name, rarity, _set },
      sideboard_count
    } = card;
    if (mainboard_count > 0) {
      mainboard += `"${name.split(' // ')[0]}",${mainboard_count},${mtgo_id ? mtgo_id : ' '},${
        rarity.charAt(0).toUpperCase() + rarity.slice(1)
      },${_set.toUpperCase()}, , ,No,0\n`;
    }
    if (sideboard_count > 0) {
      sideboard += `"${name.split(' // ')[0]}",${sideboard_count},${mtgo_id ? mtgo_id : ' '},${
        rarity.charAt(0).toUpperCase() + rarity.slice(1)
      },${_set.toUpperCase()}, , ,Yes,0\n`;
    }
  }

  return 'Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n'
    .concat(mainboard)
    .concat(sideboard);
}
