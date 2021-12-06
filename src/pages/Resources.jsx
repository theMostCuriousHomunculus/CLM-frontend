import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  resourceHyperlink: {
    '&:visited': {
      color: 'white'
    }
  }
});

export default function Resources() {
  const classes = useStyles();
  const resourcesArray = [
    {
      description:
        'MTG Cube draft strategy and theory for players and curators.',
      link: 'https://www.youtube.com/channel/UC-6jOdvL1awVWd-ME7QAV8Q',
      name: 'Cultic Cube',
      platform: 'YouTube'
    },
    {
      description:
        'Limited Resources is a place to learn about and improve at Magic: the Gathering with an emphasis on Limited play.',
      link: 'https://www.youtube.com/c/LimitedResourcesPodcast/featured',
      name: 'Limited Resources',
      platform: 'YouTube'
    },
    {
      description:
        "A channel dedicated to talkin' about the best game ever created - Magic: The Gathering.",
      link: 'https://www.youtube.com/c/MiloDaGreat1/featured',
      name: 'Milo the Gathering',
      platform: 'YouTube'
    },
    {
      description: 'Scryfall is a powerful Magic: The Gathering card search',
      link: 'https://scryfall.com/',
      name: 'Scryfall',
      platform: 'Web Site'
    },
    {
      description:
        'Path to Cube is dedicated to providing current and relevant content relating to cube and it’s ever growing popularity among Magic players.',
      link: 'https://soundcloud.com/user-184099770',
      name: 'Path to Cube',
      platform: 'Podcast'
    },
    {
      description: 'Prices - Decks - Strategy',
      link: 'https://www.mtggoldfish.com/',
      name: 'MTGGoldfish',
      platform: 'Web Site'
    },
    {
      description:
        "'The 540', a Magic: The Gathering podcast from Star City Games, features Justin Parnell and Ryan Overturf discussing their favorite Magic format of all time — Cube!",
      link: 'https://www.youtube.com/playlist?list=PL5d1KNNFArSNcPm8nmlDOuFpe6u3QYYAL',
      name: 'The 540',
      platform: 'YouTube'
    },
    {
      description:
        'A completely free map tool to help players find both events and Wizards Play Network locations.',
      link: 'https://locator.wizards.com/',
      name: 'Wizards of the Coast Store & Event Locator',
      platform: 'Web Site'
    }
  ];

  return (
    <MUIGrid container spacing={0}>
      {resourcesArray.map((resource) => (
        <MUIGrid
          container
          item
          key={resource.link}
          xs={12}
          sm={6}
          md={4}
          lg={3}
          xl={2}
        >
          <MUICard
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1
            }}
          >
            <MUICardHeader
              title={resource.name}
              subheader={resource.platform}
            />
            <MUICardContent style={{ flexGrow: 1 }}>
              <MUITypography variant="body1">
                {resource.description}
              </MUITypography>
            </MUICardContent>
            <MUICardActions>
              <MUIButton
                className={classes.resourceHyperlink}
                href={resource.link}
              >
                Learn More
              </MUIButton>
            </MUICardActions>
          </MUICard>
        </MUIGrid>
      ))}
    </MUIGrid>
  );
}
