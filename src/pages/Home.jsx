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
import searchPrintings from '../graphql/queries/card/search-printings';

export default function Home() {
  const navigate = useNavigate();
  const features = [
    'Enjoy a simple UI to create, manage and discover Magic the Gathering cubes and decks',
    'Connect with your friends by sending and receiving bud requests',
    'Connect with nearby players if you opt in to location services (opt out any time)',
    'Draft your cubes in real time or generate sealed pools',
    'Turn on notifications and be alerted whenever you have a pick to make',
    'Export deck lists to CSV files then upload to MTGO and duke it out with your buds',
    // 'Play matches with your buds in real time using either decks from a limited event or constructed decks stored on CLM',
    'Check out "Classy", an independently managed, constructed format and brewer\'s paradise',
    'Dive into topical and set review articles from our brialliant contributors'
  ];

  return (
    <MUICard>
      <MUICardHeader
        title={
          <MUITypography variant="h2">
            A Feature Rich Application for Cube Enthusiasts
          </MUITypography>
        }
      />
      <MUICardContent>
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
      {/* <MUICardActions>
        <MUIButton onClick={() => navigate('/cube/60e4a02d0347dc0017bfab0e')}>
          Casey's Cube
        </MUIButton>
      </MUICardActions> */}
    </MUICard>
  );
}
