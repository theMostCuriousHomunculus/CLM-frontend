import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MUIArrowRightIcon from '@mui/icons-material/ArrowRight';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import classyBannedList from '../constants/classy-banned-list';
import theme from '../theme';
import ScryfallCardLink from '../components/miscellaneous/ScryfallCardLink';

const useStyles = makeStyles({
  multiColumnList: {
    [theme.breakpoints.up('sm')]: {
      columnCount: 2
    },
    [theme.breakpoints.up('md')]: {
      columnCount: 3
    },
    [theme.breakpoints.up('lg')]: {
      columnCount: 4
    },
    [theme.breakpoints.up('xl')]: {
      columnCount: 5
    }
  },
  paragraph: {
    textIndent: 16
  }
});

export default function Classy() {
  const { hash } = useLocation();
  const [classyBannedListState, setClassyBannedListState] = useState(classyBannedList);
  const classes = useStyles();
  const sections = [
    {
      id: 'core-values-and-guiding-principles',
      info: (
        <React.Fragment>
          <MUITypography align="center" variant="h3">
            No "Gotcha" Cards.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "Some cards either do nothing at all if your opponent has an answer (typically an answer which is pretty narrow and that decks often can't afford to mainbaord), or effectively win the game by radically shifting Magic's goal posts at a mana cost that is far too cheap and only ask the player to satisfy a very easy condition.  "
            }
            <ScryfallCardLink card={classyBannedListState['Ensnaring Bridge']} />
            {' is the quintessential example. Such cards are NOT classy.'}
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              '"Gotcha" cards typically reduce the outcome of a game of Magic to a few yes/no questions. Did I draw the card and have enough mana to cast it? Did my opponent draw their answer and were they able to cast it? There is often little or no meaningful interaction or interesting decisions to be made in those games. Players are not rewarded or punished for decisions they make regarding sequencing, attacking, blocking, bluffing, exchanging resources, managing life totals and tempo. Instead, players are punished for playing Magic the way they are supposed to, rewarded for building decks that seek to force the game to be played on a completely unrelated axis, and pretty much just win or lose based on the luck of the draw. If you\'re into that kind of thing, Modern is a great format!'
            }
          </MUITypography>
          <MUITypography align="center" variant="h3">
            No Free Spells.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "In order to help keep this format fair enough that it can be a brewer's paradise, free spells (non-land cards that do not require a mana investment in order to cast) are not allowed. This includes 0 mana cost artifacts like "
            }
            <ScryfallCardLink card={classyBannedListState["Mishra's Bauble"]} />
            {' and '}
            <ScryfallCardLink card={classyBannedListState.Memnite} />
            {', cards which can be cast for only Phyrexian mana such as '}
            <ScryfallCardLink card={classyBannedListState['Gut Shot']} />
            {' and '}
            <ScryfallCardLink card={classyBannedListState['Surgical Extraction']} />
            {' as well as the free spell '}
            <ScryfallCardLink card={classyBannedListState.Manamorphose} />
            {'.  These spells are NOT classy.'}
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {'Cards whose mana cost can be reduced to 0 by satisfying certain conditions, such as '}
            <a href="https://scryfall.com/card/mm2/215/frogmite" rel="noreferrer" target="_blank">
              Frogmite
            </a>
            {', or paying alternative costs such as '}
            <a
              href="https://scryfall.com/card/m15/11/ephemeral-shields"
              rel="noreferrer"
              target="_blank"
            >
              Ephemeral Shields
            </a>
            {
              ' are allowed, so long as those alternative costs typically require a mana investment (it is possible your opponent cast '
            }
            <a
              href="https://scryfall.com/card/m21/116/necromentia"
              rel="noreferrer"
              target="_blank"
            >
              Necromentia
            </a>
            {' leaving you with 3 zombie tokens which you could use to cast '}
            <a
              href="https://scryfall.com/card/m11/92/demon-of-deaths-gate"
              rel="noreferrer"
              target="_blank"
            >
              Demon of Death's Gate
            </a>
            {
              ', but since there are no free spells allowed in the Classy format, you generally would have spent mana on the three creatures you are sacrificing).  Therefore, the "Force of" cycle from '
            }
            <a href="https://scryfall.com/sets/mh1?order=set" rel="noreferrer" target="_blank">
              Modern Horizons
            </a>
            {' and the "Evoke Elemental" cycle from '}
            <a href="https://scryfall.com/sets/mh2?order=set" rel="noreferrer" target="_blank">
              Modern Horizons 2
            </a>
            {
              ' are NOT classy because their alternative costs require the exiling of cards from your hand, which means, in all likelihood, no mana has yet been invested in them.'
            }
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              'Another gray area concerns cards which can recur from the graveyard without paying any mana, such as '
            }
            <a href="https://scryfall.com/card/ima/82/bloodghast" rel="noreferrer" target="_blank">
              Bloodghast
            </a>
            {
              '. When graveyard enablers have been too good, modern has been dominated by fast, unfair graveyard decks such as dredge and Izzet phoenix. Since the banning of '
            }
            <ScryfallCardLink card={classyBannedListState['Faithless Looting']} />
            {
              ', these decks have completely fallen out of favor.  That suggests recursive creatures are often not the problem, but rather cards which too easily enable players to abuse their graveyards.  Extracting value from the graveyard is something many decks seek to do and can really make you feel like a naughty boy. It is not my desire to preclude players from playing such cards; only that all decks seek to play by the "normal" rules of the game (casting spells, playing to the board, etc...). Recursive cards are classy.'
            }
          </MUITypography>
          <MUITypography align="center" variant="h3">
            No Companions.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "If I wanted to play commander, which I don't, then I'd play commander. Companions are NOT classy."
            }
          </MUITypography>
          <MUITypography align="center" variant="h3">
            No Tier 0 Cards.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "This restriction is admittedly a bit subjective. I would describe a tier 0 card as one which is provides so much value at it's color/CMC/card type and asks so little of you in terms of deck building concessions that all decks playing that color and archetype (by which I mean aggro, combo, control and midrange) either play the card or are self-handicapping by not playing it. For a tier 0 card, there are often many cards which are comparable in function and are good enough that they would see play if the tier 0 card was not legal. When tier 0 cards are allowed to exist in a format, their alternatives are largely precluded from serious consideration which means the pool of viable cards which brewers have to work with is smaller than it should be."
            }
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              'Tier 0 cards, in more moder Magic sets, are permanents more often than not. For example, in Modern, '
            }
            <a href="https://scryfall.com/card/m21/59/opt" rel="noreferrer" target="_blank">
              Opt
            </a>
            {
              "is the most ubiquitous one mana blue cantrip, but I don't believe that makes it tier 0.  There simply aren't many options for this sort of effect. To be exact, as of writing this (August 2021), there are 14 one mana blue instants legal in Modern that draw a card, and Opt is the only one that offers card selection. If Opt wasn't legal, I don't think decks would start playing "
            }
            <a
              href="https://scryfall.com/card/cn2/110/fleeting-distraction"
              rel="noreferrer"
              target="_blank"
            >
              Fleeting Distraction
            </a>
            {' or '}
            <a
              href="https://scryfall.com/card/tpr/79/whispers-of-the-muse"
              rel="noreferrer"
              target="_blank"
            >
              Whispers of the Muse
            </a>
            {".  Those cards just aren't good enough for Modern.  "}
            <a
              href="https://scryfall.com/card/jmp/185/thought-scour"
              rel="noreferrer"
              target="_blank"
            >
              Thought Scour
            </a>
            {' and '}
            <a
              href="https://scryfall.com/card/uma/81/visions-of-beyond"
              rel="noreferrer"
              target="_blank"
            >
              Visions of Beyond
            </a>
            {
              " do see play in more niche decks, but the bottom line is that Opt just doesn't have a lot of competition.  It is not a busted card that feels miserable to have played against you.  It is a reasonably costed card for the effect it provides.  Decks that are interested in that sort of effect will play it (at least until Midnight Hunt comes out, and then "
            }
            <a href="https://scryfall.com/card/mid/44/consider" rel="noreferrer" target="_blank">
              Consider
            </a>
            {
              " will probably replace it in most decks), but decks don't go out of their way to include it.  People don't splash blue just so they can run Opt, which, when that is happening, is another indication of a tier 0 card (such as when all sorts of decks were dipping into blue and green in order to play "
            }
            <ScryfallCardLink card={classyBannedListState['Oko, Thief of Crowns']} />
            {' before it was finally banned).'}
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {"Next let's consider "}
            <ScryfallCardLink card={classyBannedListState["Dragon's Rage Channeler"]} />
            {
              " (DRC), a new card from Modern Horizons 2. For a single red mana, you get a 1/1 body which lets you surveil any time you cast a non-creature spell. And if you have 4 or more card types in your graveyard, it gets +2/+2, flying and must attack each combat if able. After MH2 released, DRC became an instant staple of blue-red, Grixis and Rakdos decks and is also seeing play in Jeskai and Jund builds as well. These decks were all very solid before DRC, most at or near the top of the metagame. In terms of it's body, as soon as it was spoiled, it was drawing comparisons to "
            }
            <a
              href="https://scryfall.com/card/isd/51/delver-of-secrets-insectile-aberration"
              rel="noreferrer"
              target="_blank"
            >
              Delver of Secrets
            </a>
            {
              ', which only 3 years ago was named by ChannelFireball the 46th best Magic card of all time, and the 7th best creature (you can watch the videos '
            }
            <a
              href="https://strategy.channelfireball.com/all-strategy/tag/top-100-cards/"
              rel="noreferrer"
              target="blank"
            >
              here
            </a>
            {
              ').  DRC blows Delver out of the water.  It offers you card selection on every non-creature spell you cast and, unless your opponent has out '
            }
            <a
              href="https://scryfall.com/card/a25/32/rest-in-peace"
              rel="noreferrer"
              target="_blank"
            >
              Rest in Peace
            </a>
            {
              ' or something, and can more reliably be "turned on" than Delver.  Also, despite being a very powerful card, Delver of Secrets has never been the powerhouse in modern that it is in Legacy since '
            }
            <a href="" rel="noreferrer" target="_blank">
              Brainstorm
            </a>
            {
              ' is not legal in the format, meaning a turn 2 Insectile Aberration is far less likely.  Blue decks are also not generally about winning by attacking with french-vanilla creatures.  It would almost be like if you gave green access to a card like '
            }
            <a href="" rel="noreferrer" target="_blank">
              Serum Visions
            </a>
            {
              " or something.  Green's strength is in mana ramping and playing to the board, so even though green players have access to some decent cantrips, they don't see nearly as much play as blue cantrips.  Spending mana to exchange a card in your hand for something else means you didn't spend that mana playing to the board.  Although there are some green based combo decks like certain Elf builds and "
            }
            <a href="" rel="noreferrer" target="_blank">
              Primeval Titan
            </a>
            {
              " decks, typical green decks are more about overwhelming the opponent with board presence and resources and less about assembling specific pieces for a combo finish.  Green doesn't get many payoffs for having instant and sorcery cards in their library.  Similarly, you could argue that Delver of Secrets is less powerful than it would be if it was red, a color whose supporting cards and normal gameplan would more naturally be interested in such a cheap, evasive creature with high power for its mana cost and which requires a decent portion of your deck to be instant and sorcery spells in order to work.  Despite all of these balancing factors though, Delver has seen some modest modern play at various points.  Even today, it is playable.  Not tier 1, but it is good enough that if you wanted to play it, you could and still have some success."
            }
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "At it's core, DRC is a cheap, aggressive, red creature, of which there are several only a half step behind DRC in terms of their ability to quickly damage your opponent.  Several of them were good enough to see significant Modern play right up until DRC was released and I am positive that should Wizards of the Coast ever admit DRC was too pushed and ban it, those cards would immediately see, not just play, but considerable success, once again.  So to recap, not only is DRC the best in its class at reliably getting in for damage, it also offers superb card selection, which is huge because one of the ways aggressive decks can lose is by casting all of their cheap, relatively less impactful spells, and then stalling out by drawing too many lands, at which point an opponent with a more balanced mana curve has an opportunity to turn the corner.  Card selection is also something which no other red 1 CMC creature offers at all (even in the inferior version of surveil, scry).  It also helps decks abuse the graveyard, traditionally something very powerful in eternal formats, by freely putting cards there from your library.  The card does so much more than just about every other red one drop, with the exception of a single other card also introduced in Modern Horizons 2 ("
            }
            <ScryfallCardLink card={classyBannedListState['Ragavan, Nimble Pilferer']} />
            {
              ').  Yes, they both die to removal but so do all other red one drops.  And it is hard to make the argument that a one drop which must be answered almost immediately or it will provide a nearly insurmountable amount of value is a reasonable and fair Magic card. DRC simply does too much, which makes deck building and brewing less interesting.  It is to aggressive decks what '
            }
            <ScryfallCardLink card={classyBannedListState["Uro, Titan of Nature's Wrath"]} />
            {
              ' was to control decks before it was finally banned. Cards like these are so good that you are either forced to include them or you are handicapping yourself.  They give players fewer viable options, homogenize decks and are NOT classy.'
            }
          </MUITypography>
          <MUITypography align="center" variant="h3">
            No Snow.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              'I have always thought snow was so lame. Other than the fact that two cards now exist ('
            }
            <a
              href="https://scryfall.com/card/mh2/77/break-the-ice"
              rel="noreferrer"
              target="_blank"
            >
              Break the Ice
            </a>
            {' and '}
            <a
              href="https://scryfall.com/card/khm/21/reidane-god-of-the-worthy-valkmira-protectors-shield"
              rel="noreferrer"
              target="_blank"
            >
              Reidane, God of the Worthy
            </a>
            {
              '), which don\'t even see any play because they are pretty narrow and not even that good as hate cards, snow basic lands are just strict upgrades to basic lands.  They function the exact same way; they just have the word "snow" on them.  So although there is essentially no downside to playing snow basics, there is upside as you get access to cards like '
            }
            <a
              href="https://scryfall.com/card/khm/79/blood-on-the-snow"
              rel="noreferrer"
              target="_blank"
            >
              Blood on the Snow
            </a>
            {
              '.  There are also only a few different printings of snow basics, which means your choices for art are limited. Which is a shame because there is so much cool artwork on basic lands.  My format, my rules; snow is NOT classy.'
            }
          </MUITypography>
          <MUITypography align="center" variant="h3">
            No Dredge.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "Dredge is just a super busted mechanic. It is a 10 on Mark Rosewater's storm scale (you can read more about that "
            }
            <a href="https://mtg.fandom.com/wiki/Storm_Scale" rel="noreferrer" target="_blank">
              here
            </a>
            {
              '), which basically means Wizards of the Coast knows that it was a mistake to ever print.  If you look at a dredge deck, cards with the dredge mechanic are terrible Magic cards, but the fact that they have the dredge mechanic makes them busted as graveyard enablers.  Dredge decks do not seek to cast many of the spells in their deck.  Dredge cards are NOT classy.'
            }
          </MUITypography>
        </React.Fragment>
      ),
      title: 'Core Values and Guiding Principles'
    },
    {
      id: 'card-legality',
      info: (
        <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
          {
            'All cards which have been printed into a standard-legal set beginning with Eighth Edition, or which have been printed into a Modern Horizons set, and which are not on the Classy banned list, enumerated below, are classy.  In other words, all cards from sets which are legal in the Modern format, with the exception of banned cards, are legal.'
          }
        </MUITypography>
      ),
      title: 'Card Legality'
    },
    {
      id: 'banned-list',
      info: (
        <React.Fragment>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              'In order to maintain a fair, interesting and balanced environment, in line with the ideals of the Classy format, a banned list is necessary.  This banned list is independent of the banned list for the Modern format and will never be managed by Wizards of the Coast.  Notable cards which are currently banned in Modern but are legal in Classy are '
            }
            <a
              href="https://scryfall.com/card/mm2/129/splinter-twin"
              rel="noreferrer"
              target="_blank"
            >
              Splinter Twin
            </a>
            {' and '}
            <a href="https://scryfall.com/card/cmr/84/preordain" rel="noreferrer" target="_blank">
              Preordain
            </a>
            {
              '.  Keep in mind that many of these cards are on the list not for power level concerns, but for violating one of the hard rules of the format, such as '
            }
            <ScryfallCardLink card={classyBannedListState['Snow-Covered Forest']} />
            {'.  The following cards are NOT classy:'}
          </MUITypography>
          <MUIList className={classes.multiColumnList}>
            {Object.entries(classyBannedList).map(([key, value], index) => (
              <MUIListItem key={value.oracle_id}>
                <MUIListItemText disableTypography={true}>
                  <MUITypography variant="body2">
                    {index + 1}) <ScryfallCardLink card={classyBannedListState[key]} />
                  </MUITypography>
                </MUIListItemText>
              </MUIListItem>
            ))}
          </MUIList>
        </React.Fragment>
      ),
      title: 'Banned List'
    },
    {
      id: 'deck-size-and-copy-limit',
      info: (
        <React.Fragment>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              'Being the Classy format, a deck must contain exactly 69 cards in the mainboard and can contain up to 21 cards in the sideboard.  The increased deck size is intended to decrease the odds of games playing out in similar ways over and over again.  The increased sideboard size acknowledges that Magic decks do powerful and diverse things so allowing players access to more cards to try to better match up in games 2 and 3 should lead to fewer non-games and, hopefully, the format not being dominated by decks doing very obscure things.'
            }
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              '69 and 21 (and therefore 90 as well) are not cleanly divisible by 4.  So aesthetically, limiting copies to 3 feels more satisfying.  This also will require players to experiment with and include pet cards that might not make the cut in tier 1 competitive lists if there was a 4 copy limit.  A 3 copy limit still allows decks to have some of the redundancy that they rely on, but a bit less of it.  So, for all NON-LEGENDARY, NON-LAND cards, the limit is 3 copies.'
            }
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            {
              "For LEGENDARY cards and NON-BASIC lands, the limit is 1 copy. This is much more sensible from a flavor point of view. It can be very frustrating to sink resources into dealing with a powerful legendary creature or planeswalker only to have your opponent play a second copy.  This should help legendary cards feel more special when they are played since they won't be drawn in most games.  Although some non-basic lands are legendary, others, based on their name, should have been given the legendary supertype (for example, "
            }
            <a
              href="https://scryfall.com/card/zen/228/valakut-the-molten-pinnacle"
              rel="noreferrer"
              target="_blank"
            >
              Valkut,{' '}
              <i>
                <b>THE</b>
              </i>{' '}
              Molten Pinnacle
            </a>
            {
              ', emphasis added).  Limiting non-basic lands to a single copy is primarily about keeping mana bases modest, decks a bit more affordable, forcing players to get a bit more creative in finding synergies between their land base and their spells and making them work a little harder to get delerium or to delve away a bunch of cards.  There are a lot of respectable non-basics out there; it has always seemed a bit of a shame to me that so many of them just never really see much play because fetches and shocks are typically the best options, but only by a couple of percentage points.  For BASIC lands, the limit is 90 copies in a deck.'
            }
          </MUITypography>
        </React.Fragment>
      ),
      title: 'Deck Size and Copy Limit'
    }
  ];

  useEffect(() => {
    (async () => {
      const bannedCardsIdentifierArray = Object.values(classyBannedList).map(({ name }) => ({
        name
      }));
      const numberOfScryfallRequests = Math.ceil(bannedCardsIdentifierArray.length / 75);
      const scryfallRequestArrays = [];

      for (let requestNumber = 0; requestNumber < numberOfScryfallRequests; requestNumber++) {
        scryfallRequestArrays.push(bannedCardsIdentifierArray.splice(0, 75));
      }

      const populatedObject = {};

      for (const request of scryfallRequestArrays) {
        const rawScryfallResponse = await fetch('https://api.scryfall.com/cards/collection', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ identifiers: request })
        });
        const parsedScryfallResponse = await rawScryfallResponse.json();

        for (const card of parsedScryfallResponse.data) {
          const { layout, name, oracle_id, scryfall_uri } = card;
          let back_image, image;
          switch (layout) {
            case 'meld':
              const meldResult = await fetch(
                card.all_parts.find((part) => part.component === 'meld_result').uri
              ).json();
              back_image = meldResult.image_uris.large;
              image = card.image_uris.large;
              break;
            case 'modal_dfc':
              back_image = card.card_faces[1].image_uris.large;
              image = card.card_faces[0].image_uris.large;
              break;
            case 'transform':
              back_image = card.card_faces[1].image_uris.large;
              image = card.card_faces[0].image_uris.large;
              break;
            default:
              back_image = null;
              image = card.image_uris.large;
          }
          populatedObject[name] = {
            back_image,
            image,
            name,
            oracle_id,
            scryfall_uri
          };
        }
      }

      setClassyBannedListState(populatedObject);
    })();
  });

  useEffect(() => {
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  }, [hash]);

  return (
    Object.values(classyBannedListState).some(({ scryfall_uri }) => !!scryfall_uri) && (
      <React.Fragment>
        <MUICard>
          <MUICardHeader
            title={<MUITypography variant="h2">Classy</MUITypography>}
            subheader="The hot new MTG format the cool kids can't get enough of"
          />
          <MUICardContent>
            <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
              {
                "I'm a big fan of the Modern format, but there are aspects of it that I have always hated. Since I've got my own website, I invented Classy."
              }
            </MUITypography>
            <MUIList>
              {sections.map((section) => (
                <MUIListItem key={section.id}>
                  <MUIListItemIcon>
                    <MUIArrowRightIcon />
                  </MUIListItemIcon>
                  <MUIListItemText>
                    <Link to={`#${section.id}`}>{section.title}</Link>
                  </MUIListItemText>
                </MUIListItem>
              ))}
            </MUIList>
          </MUICardContent>
        </MUICard>
        {sections.map((section) => (
          <MUICard id={section.id} key={section.id}>
            <MUICardHeader title={<MUITypography variant="h2">{section.title}</MUITypography>} />
            <MUICardContent>{section.info}</MUICardContent>
          </MUICard>
        ))}
      </React.Fragment>
    )
  );
}
