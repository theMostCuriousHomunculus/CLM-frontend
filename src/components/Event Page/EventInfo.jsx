import React from 'react';
import MUICard from '@mui/material/Card';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUIGrid from '@mui/material/Grid';
import MUITypography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

import Avatar from '../miscellaneous/Avatar';
import { EventContext } from '../../contexts/event-context';

export default function InfoSection() {
  const {
    eventState: { name, players }
  } = React.useContext(EventContext);

  return (
    <MUICard>
      <MUICardHeader
        title={<MUITypography variant="h2">{name}</MUITypography>}
      />
      <MUICardContent>
        <MUIGrid container justifyContent="space-around" spacing={0}>
          {players.map((player) => (
            <MUIGrid
              container
              item
              justifyContent="center"
              key={player.account._id}
              xs={6}
              sm={3}
              md={1}
            >
              <Link to={`/account/${player.account._id}`}>
                <Avatar
                  alt={player.account.name}
                  size="large"
                  src={player.account.avatar}
                />
              </Link>
            </MUIGrid>
          ))}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
}
