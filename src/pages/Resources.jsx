import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';

export default function Resources () {

  const resourcesArray = [
    {
      description: 'MTG Cube draft strategy and theory for players and curators.',
      link: 'https://www.youtube.com/channel/UC-6jOdvL1awVWd-ME7QAV8Q',
      name: 'Cultic Cube',
      platform: 'YouTube'
    },
    {
      description: 'Limited Resources is a place to learn about and improve at Magic: the Gathering with an emphasis on Limited play.',
      link: 'https://www.youtube.com/c/LimitedResourcesPodcast/featured',
      name: 'Limited Resources',
      platform: 'YouTube'
    },
    {
      description: `A channel dedicated to talkin' about the best game ever created - Magic: The Gathering.`,
      link: 'https://www.youtube.com/c/MiloDaGreat1/featured',
      name: 'Milo the Gathering',
      platform: 'YouTube'
    },
    {
      description: 'Path to Cube is dedicated to providing current and relevant content relating to cube and it’s ever growing popularity among Magic players.',
      link: 'https://soundcloud.com/user-184099770',
      name: 'Path to Cube',
      platform: 'Podcast'
    }
  ];
  
  return (
    <MUIGrid container spacing={0}>
      {resourcesArray.map(resource => (
        <MUIGrid item key={resource.link} xs={12} sm={6} md={4} lg={3} xl={2}>
          <MUICard>
            <MUICardHeader
              title={resource.name}
              subheader={resource.platform}
            />
            <MUICardContent>
              <MUITypography variant="body1">{resource.description}</MUITypography>
            </MUICardContent>
            <MUICardActions>
              <MUIButton
                color="primary"
                href={resource.link}
                size="small"
                variant="contained"
              >
                Learn More
              </MUIButton>
            </MUICardActions>
          </MUICard>
        </MUIGrid>
      ))}
    </MUIGrid>
  );
};