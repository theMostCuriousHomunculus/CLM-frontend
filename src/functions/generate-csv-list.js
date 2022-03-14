export default function generateCSVList(mainboard, sideboard) {
  return 'Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n'
    .concat(
      mainboard.reduce(function (a, c) {
        return `${a}"${c.scryfall_card.name.split(' // ')[0]}",1,${c.scryfall_card.mtgo_id ? c.scryfall_card.mtgo_id : ' '}, , , , ,No,0\n`;
      }, '')
    )
    .concat(
      sideboard.reduce(function (a, c) {
        return `${a}"${c.scryfall_card.name.split(' // ')[0]}",1,${c.scryfall_card.mtgo_id ? c.scryfall_card.mtgo_id : ' '}, , , , ,Yes,0\n`;
      }, '')
    );
}
