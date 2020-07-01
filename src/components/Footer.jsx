import React from 'react';
import {} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import theme from '../theme';

const useStyles = makeStyles({
  footer: {
    backgroundColor: theme.palette.primary.main,
    bottom: 0,
    color: theme.palette.secondary.main,
    height: '300px',
    padding: '1rem',
    position: 'absolute',
    textAlign: 'center',
    width: '100%',
    zIndex: -1
  }
})

const Footer = () => {

    const classes = useStyles();

    return (
      <footer className={classes.footer}>
        <p>Magic: The Gathering is © Wizards of the Coast. Cube Level Midnight is not affiliated with, produced or endorsed by Wizards of the Coast.</p>
        <p>All card images, mana symbols, expansions and art related to Magic the Gathering are the property of Wizards of the Coast and its parent company, Hasbro, Inc.</p>
        <p>Cube Level Midnight uses <a href="https://scryfall.com/">Scryfall.com</a>'s API to search for and display Magic cards, but is not affiliated with, produced or endorsed by Scryfall LLC. This site endeavours to adhere to the Scryfall data guidelines.</p>
        <p>Opinions expressed by users in comments are not necessarily opinions shared by Cube Level Midnight.</p>
        <p>Cube Level Midnight was built by Casey Johnson using MongoDB, Express, Node.js and React.</p>
      </footer>
    );
}

export default Footer;