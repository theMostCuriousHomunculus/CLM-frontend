import React from 'react';
import { Link } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUITypography from '@material-ui/core/Typography';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUINotInterestedIcon from '@material-ui/icons/NotInterested';

import Avatar from '../miscellaneous/Avatar';
import WarningButton from '../miscellaneous/WarningButton';

export default function BudRequests ({
  manageBuds,
  received_bud_requests,
  sent_bud_requests
}) {

  return (
    <React.Fragment>
      <MUIGrid item xs={12} sm={6} md={4}>
        <MUICard>
          <MUICardHeader
            disableTypography={true}
            title={<MUITypography variant="h5">Aspiring Buds</MUITypography>}
          />
          <MUIList>
            {received_bud_requests.map(function (request) {
              return (
                <MUIListItem key={request._id}>
                  <Link to={`/account/${request._id}`}><Avatar alt={request.name} size='small' src={request.avatar} /></Link>
                  <WarningButton onClick={() => manageBuds(`action: "reject",\nother_user_id: "${request._id}"`)}>
                    <MUINotInterestedIcon />
                  </WarningButton>

                  <MUIButton
                    color="primary"
                    onClick={() => manageBuds(`action: "accept",\nother_user_id: "${request._id}"`)}
                    size="small"
                    style={{ marginLeft: '8px' }}
                    variant="contained"
                  >
                    <MUIPersonAddIcon />
                  </MUIButton>
                </MUIListItem>
              );
            })}
          </MUIList>
        </MUICard>
      </MUIGrid>
        
      <MUIGrid item xs={12} sm={6} md={4}>
        <MUICard>
          <MUICardHeader
            disableTypography={true}
            title={<MUITypography variant="h5">Pending Buds</MUITypography>}
          />
          <MUIList>
            {sent_bud_requests.map(function (request) {
              return (
                <MUIListItem key={request._id}>
                  <Link to={`/account/${request._id}`}><Avatar alt={request.name} size='small' src={request.avatar} /></Link>
                </MUIListItem>
              );
            })}
          </MUIList>
        </MUICard>
      </MUIGrid>
    </React.Fragment>
  );
};