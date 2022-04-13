import classyBannedList from '../constants/classy-banned-list';

export default function validateDeck({ format, mainboard, sideboard }, setWarnings) {
  const validationIssues = [];
  switch (format) {
    case 'Classy':
      if (mainboard.length < 69) {
        validationIssues.push(
          `Mainboard does not contain enough cards!  69 cards are required, but there are currently only ${mainboard.length}.`
        );
      }
      if (mainboard.length > 69) {
        validationIssues.push(
          `Mainboard contains too many cards!  69 cards are required, but there are currently ${mainboard.length}.`
        );
      }
      if (sideboard.length > 21) {
        validationIssues.push(
          `Sideboard contains too many cards!  21 is the limit, but there are currently ${sideboard.length}.`
        );
      }

      const cardCountObject = {};

      for (const card of mainboard.concat(sideboard)) {
        if (card.scryfall_card.name in cardCountObject) {
          cardCountObject[card.scryfall_card.name].count++;
        } else {
          cardCountObject[card.scryfall_card.name] = {
            ...card.scryfall_card,
            count: 1
          };
        }
      }

      for (const [name, cardObject] of Object.entries(cardCountObject)) {
        if (cardObject.legalities.not_legal.includes('modern')) {
          validationIssues.push(
            `Deck contains ${cardObject.count} cop${
              cardObject.count === 1 ? 'y' : 'ies'
            } of "${name}", which has never been printed into a set that is legal in Classy!`
          );
        } else if (Object.keys(classyBannedList).includes(name)) {
          validationIssues.push(
            `Deck contains ${cardObject.count} cop${
              cardObject.count === 1 ? 'y' : 'ies'
            } of the banned card "${name}"!`
          );
        } else if (cardObject.count > 1) {
          if (cardObject.type_line.includes('Legendary')) {
            validationIssues.push(
              `Deck contains ${cardObject.count} copies of the Legendary card "${name}"!  A maximum of 1 copy is allowed.`
            );
          } else if (
            cardObject.type_line.includes('Land') &&
            !cardObject.type_line.includes('Basic')
          ) {
            validationIssues.push(
              `Deck contains ${cardObject.count} copies of the nonbasic land "${name}"!  A maximum of 1 copy is allowed.`
            );
          } else if (
            cardObject.count > 3 &&
            !cardObject.type_line.includes('Basic') &&
            !cardObject.oracle_text?.includes(`A deck can have any number of cards named ${name}`)
          ) {
            validationIssues.push(
              `Deck contains ${cardObject.count} copies of "${name}"!  A maximum of 3 copies are allowed.`
            );
          }
        }
      }
      break;
    default:
  }
  setWarnings(validationIssues);
}
