import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUITooltip from '@material-ui/core/Tooltip';
import MUITypography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import SmallAvatar from '../miscellaneous/SmallAvatar';

const InfoSection = (props) => {

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
                <MUITooltip title={player.account.name}>
                  <Link to={`/account/${player.account._id}`}>
                    <SmallAvatar
                      alt={player.account.name}
                      src={player.account.avatar}
                    />
                  </Link>
                </MUITooltip>
              </MUIGrid>
            );
          })}
        </MUIGrid>
      </MUICardContent>
    </MUICard>
  );
};

export default InfoSection;