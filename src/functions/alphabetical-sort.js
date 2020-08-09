export default function alphabeticalSort (cards) {

  cards.sort(function (a, b) {
    return a['name'].localeCompare(b['name']);
  });

  return cards;
}