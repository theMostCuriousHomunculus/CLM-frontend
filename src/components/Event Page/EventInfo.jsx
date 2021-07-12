import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

import Avatar from '../miscellaneous/Avatar';
import { EventContext } from '../../contexts/event-context';

export default function InfoSection () {

  const { eventState: { name, players } } = React.useContext(EventContext);

  return (
    <MUICard>
      <MUICardHeader title={name} />
      <MUICardContent>
        <MUIGrid container justify="space-around" spacing={0}>
          {players.map(player => (
            <MUIGrid
              container
              item
              justify="center"
              key={player.account._id}
              xs={6}
              sm={3}
              md={1}
            >
              <Link to={`/account/${player.account._id}`}>
                <Avatar alt={player.account.name} size='small' src={player.account.avatar} />
              </Link>
            </MUIGrid>
          ))}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
};