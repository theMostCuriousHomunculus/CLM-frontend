import React from 'react';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles'

import theme from '../../theme';

const useStyles = makeStyles({
  footer: {
    alignItems: 'center',
    background: `radial-gradient(${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
    color: theme.palette.secondary.main,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    justifyContent: 'center',
    padding: 8,
    textAlign: 'center',
    width: '100%',
    '& a': {
      color: '#ffffff'
    }
  }
})

const Footer = () => {

    const classes = useStyles();

    return (
      <footer className={classes.footer}>
        <MUITypography variant="body2">Magic: The Gathering is © Wizards of the Coast. Cube Level Midnight is not affiliated with, produced or endorsed by Wizards of the Coast.</MUITypography>
        <MUITypography variant="body2">All card images, mana symbols, expansions and art related to Magic the Gathering are the property of Wizards of the Coast and its parent company, Hasbro, Inc.</MUITypography>
        <MUITypography variant="body2">Cube Level Midnight uses <a href="https://scryfall.com/">Scryfall.com</a>'s API to search for and display Magic cards, but is not affiliated with, produced or endorsed by Scryfall LLC. This site endeavours to adhere to the Scryfall data guidelines.</MUITypography>
        <MUITypography variant="body2">Opinions expressed by users in comments are not necessarily opinions shared by Cube Level Midnight.</MUITypography>
        <MUITypography variant="body2">Cube Level Midnight was built by Casey Johnson using MongoDB, Express, React, Node and Material UI.</MUITypography>
      </footer>
    );
}

export default Footer;