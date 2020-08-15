import React from 'react';
import { Link } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
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

import alphabeticalSort from '../../functions/alphabetical-sort';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  flexGrow: {
    flexGrow: 1
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

const BudRequests = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { sendRequest } = useRequest();

  async function acceptBudRequest (event) {
    let formData = {
      action: 'accept',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
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
    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
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
        <MUICard>
          <MUICardHeader title={<MUITypography variant="h3">Aspiring Buds</MUITypography>} />
          <MUIList>
            {props.user.received_bud_requests &&
              alphabeticalSort(props.user.received_bud_requests).map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    {request.avatar &&
                      <MUIAvatar alt={request.name} className={classes.avatarSmall} src={request.avatar} />
                    }
                    <MUITypography className={classes.flexGrow} variant="body1">
                      <Link to={`/account/${request._id}`}>{request.name}</Link>
                    </MUITypography>
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
        <MUICard>
          <MUICardHeader title={<MUITypography variant="h3">Pending Buds</MUITypography>}/>
          <MUIList>
            {props.user.sent_bud_requests &&
              alphabeticalSort(props.user.sent_bud_requests).map(function (request) {
                return (
                  <MUIListItem key={request._id}>
                    {request.avatar &&
                      <MUIAvatar alt={request.name} className={classes.avatarSmall} src={request.avatar} />
                    }
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