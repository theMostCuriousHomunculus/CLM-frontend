import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import MUIArrowRightIcon from '@material-ui/icons/ArrowRight';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemIcon from '@material-ui/core/ListItemIcon';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  paragraph: {
    textIndent: 16
  }
});

export default function Classy() {

  const classes = useStyles();
  const sections = [
    {
      id: 'core-values-and-guiding-principles',
      info:
        <React.Fragment>
          <MUITypography align="center" variant="subtitle1">No "Gotcha" Cards.</MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            Some cards either do nothing at all if your opponent has an answer (typically an answer which is pretty narrow and that decks often can't afford to mainbaord), or effectively win the game by radically shifting Magic's goal posts at a mana cost that is far too cheap and only ask the player to satisfy a very easy condition.  <a href="https://scryfall.com/card/2xm/253/ensnaring-bridge" rel="noreferrer" target="_blank">Ensnaring Bridge</a> is the quintessential example.  Such cards are not classy.
          </MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            "Gotcha" cards typically reduce the outcome of a game of Magic to a few yes/no questions (Did I draw the card and have enough mana to cast it?  Did my opponent draw their answer and were they able to cast it?).  There is often little or no meaningful interaction or interesting decisions to be made in those games.  Players are not rewarded or punished for decisions they make regarding sequencing, attacking, blocking, bluffing, exchanging resources, managing life totals and tempo.  Instead, they are punished for playing Magic the way they are supposed to and pretty much just win or lose based on the luck of the draw.
          </MUITypography>
          <MUITypography align="center" variant="subtitle1">No Free Spells.</MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            
          </MUITypography>
          <MUITypography align="center" variant="subtitle1">No Companions.</MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            
          </MUITypography>
          <MUITypography align="center" variant="subtitle1">No Tier 0 Cards.</MUITypography>
          <MUITypography className={classes.paragraph} paragraph={true} variant="body2">
            
          </MUITypography>
        </React.Fragment>,
      title: 'Core Values and Guiding Principles'
    },
    {
      id: 'card-legality',
      info: <MUITypography variant="body1">Pubes</MUITypography>,
      title: 'Card Legality'
    },
    {
      id: 'banned-list',
      info: <MUITypography variant="body1">Shaft</MUITypography>,
      title: 'Banned List'
    },
    {
      id: 'deck-size-and-copy-limit',
      info: <MUITypography variant="body1">Balls</MUITypography>,
      title: 'Deck Size and Copy Limit'
    }
  ];

  const { hash } = useLocation();

  React.useEffect(() => {
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
    <React.Fragment>
      <MUICard>
        <MUICardHeader
          title="Classy"
          subheader="The hot new MTG format the cool kids can't get enough of"
        />
        <MUICardContent>
          <MUITypography variant="body1">
            I'm a big modern fan, but there are aspects of the format that I have always hated.  Since I've got my own website now, I invented Classy.
          </MUITypography>
          <MUIList>
            {sections.map(section => (
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
      {sections.map(section => (
        <MUICard id={section.id} key={section.id}>
          <MUICardHeader
            title={section.title}
          />
          <MUICardContent>
            {section.info}
          </MUICardContent>
        </MUICard>
      ))}
    </React.Fragment>
  );
}