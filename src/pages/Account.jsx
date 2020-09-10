import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAvatar from '@material-ui/core/Avatar';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUITypography from '@material-ui/core/Typography';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../functions/alphabetical-sort';
import BudRequests from '../components/Account Page/BudRequests';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import theme from '../theme';
import UserCubeCard from '../components/Account Page/UserCubeCard';
import UserEventCard from '../components/Account Page/UserEventCard';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';


const useStyles = makeStyles({
  avatarLarge: {
    height: '150px',
    width: '150px'
  },
  avatarSmall: {
    height: '75px',
    marginRight: '16px',
    width: '75px'
  },
  cardActions: {
    justifyContent: 'flex-end'
  },
  flexGrow: {
    flexGrow: 1
  },
  inline: {
    display: 'inline'
  },
  table: {
    minWidth: 350
  },
  tableContainer: {
    maxHeight: '40vh'
  },
  warningButton: {
    backgroundColor: theme.palette.warning.main,
    color: '#ffffff',
    '&:hover': {
      backgroundColor: theme.palette.warning.dark
    }
  }
});

const Account = () => {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, sendRequest } = useRequest();

  const [cubes, setCubes] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [user, setUser] = React.useState({});

  const fetchAccount = React.useCallback(async function() {
    try {
      const headers = authentication.token ? { Authorization: 'Bearer ' + authentication.token } : {};
      const accountData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/${accountId}`, 'GET', null, headers);
      setUser(accountData);
      // I should clean this up by adding virtuals to the models on the backend; no need for multiple requests to the server to get this data
      const cubeData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cube?creatorId=${accountId}`, 'GET', null, {});
      setCubes(cubeData.cubes);
      const eventData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/event?playerId=${accountId}`, 'GET', null, {});
      setEvents(eventData.events);
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  }, [accountId, authentication.token, sendRequest]);

  React.useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  async function changeAvatar (chosenCard) {
    try {
      const accountChanges = JSON.stringify({
        avatar: chosenCard.art_crop
      });

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/account/`,
        'PATCH',
        accountChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      fetchAccount();

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  async function deleteBud (event) {
    let formData = {
      action: 'remove',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
      'PATCH',
      JSON.stringify(formData),
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    fetchAccount();
  }

  async function sendBudRequest (event) {
    let formData = {
      action: 'send',
      other_user_id: event.currentTarget.getAttribute('data-id')
    };

    await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
      'PATCH',
      JSON.stringify(formData),
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    fetchAccount();
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          <MUICard>
            <MUICardHeader
              avatar={user.avatar && <MUIAvatar alt={user.name} className={classes.avatarLarge} src={user.avatar} />}
              disableTypography={true}
              title={<MUITypography variant="subtitle1">{user.name}</MUITypography>}
              subheader={accountId === authentication.userId ?
                <MUITypography color="textSecondary" variant="subtitle2">{user.email}</MUITypography> :
                null
              }
            />
            {accountId === authentication.userId &&
              <MUICardActions>
                <ScryfallRequest
                  buttonText="Change Avatar"
                  labelText="Change your avatar"
                  onSubmit={changeAvatar}
                />
              </MUICardActions>
            }
            {authentication.isLoggedIn &&
              accountId !== authentication.userId &&
              user.buds &&
              user.buds.filter(function (bud) {
                return bud._id === authentication.userId;
              }).length === 0 &&
              user.received_bud_requests.filter(function (request) {
                return request._id === authentication.userId;
              }).length === 0 &&
              user.sent_bud_requests.filter(function (request) {
                return request._id === authentication.userId;
              }).length === 0 &&
              // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
              <MUICardActions className={classes.cardActions}>
                <MUIButton
                  color="primary"
                  data-id={accountId}
                  onClick={sendBudRequest}
                  variant="contained"
                >
                  <MUIPersonAddIcon />
                </MUIButton>
              </MUICardActions>
            }
          </MUICard>

          <MUIGrid container spacing={2}>

            <MUIGrid item xs={12} lg={6}>
              <UserCubeCard classes={classes} cubes={cubes} />
            </MUIGrid>

            <MUIGrid item xs={12} lg={6}>
              <UserEventCard buds={user.buds} classes={classes} cubes={cubes} events={events} />
            </MUIGrid>

          </MUIGrid>

          <MUIGrid container spacing={2}>
            <MUIGrid item xs={12} sm={6} md={4}>
              <MUICard>
                <MUICardHeader
                  disableTypography={true}
                  title={<MUITypography variant="subtitle1">Buds</MUITypography>}
                />
                <MUIList>
                  {user.buds &&
                    alphabeticalSort(user.buds).map(function (bud) {
                      return (
                        <MUIListItem key={bud._id}>
                          {bud.avatar &&
                            <MUIAvatar alt={bud.name} className={classes.avatarSmall} src={bud.avatar} />
                          }
                          <MUITypography className={classes.flexGrow} variant="body1">
                            <Link to={`/account/${bud._id}`}>{bud.name}</Link>
                          </MUITypography>
                          {accountId === authentication.userId &&
                            <MUIButton
                              className={classes.warningButton}
                              data-id={bud._id}
                              onClick={deleteBud}
                              variant="contained"
                            >
                              Delete Bud
                            </MUIButton>
                          }
                        </MUIListItem>
                      );
                    })
                  }
                </MUIList>
              </MUICard>
            </MUIGrid>

            {accountId === authentication.userId &&
              <BudRequests user={user} fetchAccount={fetchAccount} />
            }
          </MUIGrid>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Account;