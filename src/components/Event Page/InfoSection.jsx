import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUITypography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import Avatar from '../miscellaneous/Avatar';

export default function InfoSection (props) {

  const { event: { name, players } } = props;

  return (
    <MUICard>
      <MUICardHeader
        disableTypography={true}
        title={<MUITypography variant="h5">{name}</MUITypography>}
      />
      <MUICardContent>
        <MUIGrid container justify="space-around" spacing={2}>
          {players.map(function (player) {
            return (
              <MUIGrid
                container
                item
                justify="center"
                key={player.account._id}
                xs={6}
                sm={4}
                md={3}
                lg={2}
                xl={1}
              >
                <Link to={`/account/${player.account._id}`}>
                  <Avatar alt={player.account.name} size='small' src={player.account.avatar} />
                </Link>
              </MUIGrid>
            );
          })}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
};