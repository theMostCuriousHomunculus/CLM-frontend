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
import { makeStyles } from '@material-ui/core/styles';

import SmallAvatar from '../miscellaneous/SmallAvatar';
import WarningButton from '../miscellaneous/WarningButton';

const useStyles = makeStyles({
  flexGrow: {
    flexGrow: 1
  }
});

const BudRequests = (props) => {

  const classes = useStyles();

  return (
    <React.Fragment>
      <MUIGrid item xs={12} sm={6} md={4}>
        <MUICard>
          <MUICardHeader
            disableTypography={true}
            title={<MUITypography variant="h5">Aspiring Buds</MUITypography>}
          />
          <MUIList>
            {props.received_bud_requests &&
              props.received_bud_requests.map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    {request.avatar &&
                      <SmallAvatar alt={request.name} src={request.avatar} />
                    }
                    <MUITypography className={classes.flexGrow} variant="body1">
                      <Link to={`/account/${request._id}`}>{request.name}</Link>
                    </MUITypography>
                    <WarningButton
                      onClick={() => props.manageBuds('reject', request._id)}
                    >
                      <MUINotInterestedIcon />
                    </WarningButton>

                    <MUIButton
                      color="primary"
                      onClick={() => props.manageBuds('accept', request._id)}
                      style={{ marginLeft: '8px' }}
                      variant="contained"
                    >
                      <MUIPersonAddIcon />
                    </MUIButton>
                  </MUIListItem>
                );
              })
            }
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
            {props.sent_bud_requests &&
              props.sent_bud_requests.map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    <SmallAvatar alt={request.name} src={request.avatar} />
                    <MUITypography variant="body1">
                      <Link to={`/account/${request._id}`}>{request.name}</Link>
                    </MUITypography>
                  </MUIListItem>
                );
              })
            }
          </MUIList>
        </MUICard>
      </MUIGrid>
    </React.Fragment>
  );
}

export default BudRequests;