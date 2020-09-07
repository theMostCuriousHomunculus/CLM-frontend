import React from 'react';
import { Button as MUIButton } from '@material-ui/core';
import { Card as MUICard } from '@material-ui/core';
import { CardActions as MUICardActions } from '@material-ui/core';
import { CardContent as MUICardContent } from '@material-ui/core';
import { CardHeader as MUICardHeader } from '@material-ui/core';
import { Grid as MUIGrid } from '@material-ui/core';
import { Typography as MUITypography } from '@material-ui/core';

const Resources = () => {

  const resources = [
    {
      description: 'MTG Cube draft strategy and theory for players and curators.',
      link: 'https://www.youtube.com/channel/UC-6jOdvL1awVWd-ME7QAV8Q',
      name: 'Cultic Cube',
      platform: 'YouTube'
    },
    {
      description: 'Path to Cube is dedicated to providing current and relevant content relating to cube and it’s ever growing popularity among Magic players.',
      link: 'https://pathtocube.com/',
      name: 'Path to Cube',
      platform: 'Podcast'
    }
  ]

  return (
    <MUIGrid container spacing={2}>
      {
        resources.map(function (resource, index) {
          return (
            <MUIGrid item key={index} xs={12} sm={6} md={4} lg={3} xl={2}>
              <MUICard>
                <MUICardHeader
                  disableTypography={true}
                  title={<MUITypography variant="subtitle1">{resource.name}</MUITypography>}
                  subheader={<MUITypography color="textSecondary" variant="subtitle2">{resource.platform}</MUITypography>}
                />
                <MUICardContent>
                  <MUITypography variant="body1">{resource.description}</MUITypography>
                </MUICardContent>
                <MUICardActions>
                  <MUIButton color="primary" href={resource.link} variant="contained">Learn More</MUIButton>
                </MUICardActions>
              </MUICard>
            </MUIGrid>
          );
        })
      }
    </MUIGrid>
  );
}

export default Resources;