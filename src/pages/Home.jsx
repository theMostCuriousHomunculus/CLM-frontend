import React from 'react';
import { useNavigate } from 'react-router-dom';
import MUIArrowRightIcon from '@mui/icons-material/ArrowRight';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemIcon from '@mui/material/ListItemIcon';
import MUIListItemText from '@mui/material/ListItemText';
import MUITypography from '@mui/material/Typography';

export default function Home() {
  const navigate = useNavigate();
  const features = [
    'Provides a simple UI to create and manage Magic the Gathering cubes with innovative, exclusive features termed "modules" and "rotations"',
    'Allows you to connect with your friends by sending and receiving bud requests',
    'Allows you to locate and connect with nearby players if you opt in to location services (opt out any time)',
    'Allows you and your buds to draft your cubes in real time or generate sealed pools',
    'Provides a simple deck building tool for both limited decks you assemble on CLM and for various constructed formats',
    // 'Allows you to play matches with your buds in real time using either decks from a limited event or constructed decks stored on CLM',
    'Introduces "Classy", an independently managed, constructed format and brewer\'s paradise'
  ];

  return (
    <MUICard>
      <MUICardHeader title="A New Website for Cube Curators and Magic the Gathering Enthusiasts" />
      <MUICardContent>
        <MUITypography variant="body1">Cube Level Midnight</MUITypography>
        <MUIList>
          {features.map((feature, index) => (
            <MUIListItem key={`feature-${index}`}>
              <MUIListItemIcon>
                <MUIArrowRightIcon />
              </MUIListItemIcon>
              <MUIListItemText>{feature}</MUIListItemText>
            </MUIListItem>
          ))}
        </MUIList>
      </MUICardContent>
      <MUICardActions>
        <MUIButton onClick={() => navigate('/cube/60e4a02d0347dc0017bfab0e')}>
          Casey's Cube
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
}
