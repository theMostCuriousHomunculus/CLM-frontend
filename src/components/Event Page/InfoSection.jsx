import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import { Link } from 'react-router-dom';

import Avatar from '../miscellaneous/Avatar';

export default function InfoSection ({ name, players }) {

  return (
    <MUICard>
      <MUICardHeader title={name} />
      <MUICardContent>
        <MUIGrid container justify="space-around" spacing={0}>
          {players.map(account => (
            <MUIGrid
              container
              item
              justify="center"
              key={account._id}
              xs={6}
              sm={4}
              md={3}
              lg={2}
              xl={1}
            >
              <Link to={`/account/${account._id}`}>
                <Avatar alt={account.name} size='small' src={account.avatar} />
              </Link>
            </MUIGrid>
          ))}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
};