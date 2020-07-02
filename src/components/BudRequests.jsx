import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Avatar as MUIAvatar,
  Button as MUIButton,
  Card as MUICard,
  CardHeader as MUICardHeader,
  Grid as MUIGrid,
  List as MUIList,
  ListItem as MUIListItem,
  Typography as MUITypography
} from '@material-ui/core';
import {
  PersonAdd as MUIPersonAddIcon,
  NotInterested as MUINotInterestedIcon
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  basicCard: {
    margin: '1rem'
  },
  flexGrow: {
    flexGrow: 1
  },
  warningButton: {
    backgroundColor: '#ff0000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#df2000'
    }
  }
});

const BudRequests = (props) => {

  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function acceptBudRequest (event) {
    let formData = {
      action: 'accept',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    await sendRequest('http://localhost:5000/api/account',
      'PATCH',
      JSON.stringify(formData),
      {
      Authorization: 'Bearer ' + authentication.token,
      'Content-Type': 'application/json'
    });
    props.fetchAccount();
  }

  async function rejectBudRequest (event) {
    let formData = {
      action: 'reject',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };
    await sendRequest('http://localhost:5000/api/account',
    'PATCH',
    JSON.stringify(formData),
    {
      Authorization: 'Bearer ' + authentication.token,
      'Content-Type': 'application/json'
    });
    props.fetchAccount();
  }

  return (
    <React.Fragment>
      <MUIGrid item xs={12} sm={6} md={4}>
        <MUICard className={classes.basicCard}>
          <MUICardHeader title={<MUITypography variant="h3">Aspiring Buds</MUITypography>} />
          <MUIList>
            {props.user.received_bud_requests &&
              props.user.received_bud_requests.map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    {request.avatar &&
                      <MUIAvatar alt={request.name} className={classes.avatarSmall} src={request.avatar} />
                    }
                    <Link className={classes.flexGrow} to={`/account/${request._id}`}>{request.name}</Link>
                    <MUIButton
                      className={classes.warningButton}
                      data-id={request._id}
                      onClick={rejectBudRequest}
                      variant="contained"
                    >
                      <MUINotInterestedIcon />
                    </MUIButton>
                    <MUIButton
                      color="primary"
                      data-id={request._id}
                      onClick={acceptBudRequest}
                      style={{ marginLeft: '1rem' }}
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
        <MUICard className={classes.basicCard}>
          <MUICardHeader title={<MUITypography variant="h3">Pending Buds</MUITypography>}/>
          <MUIList>
            {props.user.sent_bud_requests &&
              props.user.sent_bud_requests.map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    {request.avatar &&
                      <MUIAvatar alt={request.name} className={classes.avatarSmall} src={request.avatar} />
                    }
                    <Link to={`/account/${request._id}`}>{request.name}</Link>
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