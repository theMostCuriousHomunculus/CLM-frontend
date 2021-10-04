export default function generateCSVList (mainboard, sideboard) {

  return 'Card Name,Quantity,ID #,Rarity,Set,Collector #,Premium,Sideboarded,Annotation\n'
    .concat(mainboard.reduce(function (a, c) {
      return `${a}"${c.name.split(' // ')[0]}",1,${c.mtgo_id ? c.mtgo_id : ' '}, , , , ,No,0\n`;
    }, ""))
    .concat(sideboard.reduce(function (a, c) {
      return `${a}"${c.name.split(' // ')[0]}",1,${c.mtgo_id ? c.mtgo_id : ' '}, , , , ,Yes,0\n`;
    }, ""));
}