import React from 'react';
import { useHistory } from 'react-router-dom';
import MUIArrowRightIcon from '@material-ui/icons/ArrowRight';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemIcon from '@material-ui/core/ListItemIcon';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUITypography from '@material-ui/core/Typography';

export default function Home () {

  const history = useHistory();
  const features = [
    'Provides a simple UI to create and manage Magic the Gathering cubes with innovative, exclusive features termed "modules" and "rotations"',
    'Allows you to connect with your friends by sending and receiving bud requests',
    'Allows you and your buds to draft your cubes in real time or generate sealed pools',
    'Provides a simple deck building tool for both limited decks you assemble through draft or seald here on CLM and for various constructed formats',
    'Allows you to play matches with your buds in real time using either decks from a limited event or constructed decks stored on CLM',
    `Introduces "Classy", an independently managed, constructed format intended to be a brewers paradise with a very large card pool but free from Magic's most opressive cards`
  ];

  return (
    <MUICard>
      <MUICardHeader title="A New Website for Cube Curators and Magic the Gathering Enthusiasts" />
      <MUICardContent>
        <MUITypography variant="body1">
          Cube Level Midnight
        </MUITypography>
        <MUIList>
          {features.map((feature, index) => (
            <MUIListItem key={`feature-${index}`}>
              <MUIListItemIcon>
                <MUIArrowRightIcon />
              </MUIListItemIcon>
              <MUIListItemText>
                {feature}
              </MUIListItemText>
            </MUIListItem>
          ))}
        </MUIList>
      </MUICardContent>
      <MUICardActions>
        <MUIButton
          color="primary"
          onClick={() => history.push('/cube/60e4a02d0347dc0017bfab0e')}
          size="small"
          variant="contained"
        >
          Casey's Cube
        </MUIButton>
      </MUICardActions>
    </MUICard>
  );
};