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

import BudRequests from '../components/Account Page/BudRequests';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import SmallAvatar from '../components/miscellaneous/SmallAvatar';
import UserCubeCard from '../components/Account Page/UserCubeCard';
import UserEventCard from '../components/Account Page/UserEventCard';
import WarningButton from '../components/miscellaneous/WarningButton';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';


const useStyles = makeStyles({
  avatarLarge: {
    height: '75px',
    width: '75px'
  },
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
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
    height: '40vh'
  }
});

const Account = () => {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, sendRequest } = useRequest();

  const [account, setAccount] = React.useState({
    cubes: [],
    events: [],
    user: {
      _id: accountId,
      avatar: '',
      buds: [],
      name: '',
      received_bud_requests: [],
      sent_bud_requests: []
    }
  });

  const fetchAccount = React.useCallback(async function() {
    try {
      const headers = authentication.token ? { Authorization: 'Bearer ' + authentication.token } : {};
      const accountData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/${accountId}`, 'GET', null, headers);
      setAccount(accountData);
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

  async function manageBuds (response, otherUserId) {
    try {
      await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account`,
        'PATCH',
        JSON.stringify({
          action: response,
          other_user_id: otherUserId
        }),
        {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      });
      fetchAccount();
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          <MUICard style={{ marginBottom: 0 }}>
            <MUICardHeader
              avatar={account.user.avatar &&
                <MUIAvatar alt={account.user.name} className={classes.avatarLarge} src={account.user.avatar} />
              }
              className={classes.cardHeader}
              disableTypography={true}
              title={<MUITypography variant="h5">{account.user.name}</MUITypography>}
              subheader={accountId === authentication.userId &&
                <MUITypography color="textSecondary" variant="subtitle1">{account.user.email}</MUITypography>
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
              account.user.buds.filter(function (bud) {
                return bud._id === authentication.userId;
              }).length === 0 &&
              account.user.received_bud_requests.filter(function (request) {
                return request._id === authentication.userId;
              }).length === 0 &&
              account.user.sent_bud_requests.filter(function (request) {
                return request._id === authentication.userId;
              }).length === 0 &&
              // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
              <MUICardActions>
                <MUIButton
                  color="primary"
                  onClick={() => manageBuds('send', accountId)}
                  variant="contained"
                >
                  <MUIPersonAddIcon />
                </MUIButton>
              </MUICardActions>
            }
          </MUICard>

          <MUIGrid container spacing={2}>

            <MUIGrid item xs={12} lg={6}>
              <UserCubeCard
                cubes={account.cubes}
                pageClasses={classes}
              />
            </MUIGrid>

            <MUIGrid item xs={12} lg={6}>
              <UserEventCard
                buds={account.user.buds}
                cubes={account.cubes}
                events={account.events}
                pageClasses={classes}
              />
            </MUIGrid>

          </MUIGrid>

          <MUIGrid container spacing={2}>
            <MUIGrid item xs={12} sm={6} md={4}>
              <MUICard>
                <MUICardHeader
                  disableTypography={true}
                  title={<MUITypography variant="h5">Buds</MUITypography>}
                />
                <MUIList>
                  {account.user.buds &&
                    account.user.buds.map(function (bud) {
                      return (
                        <MUIListItem key={bud._id}>
                          <SmallAvatar alt={bud.name} src={bud.avatar} />
                          <MUITypography className={classes.flexGrow} variant="body1">
                            <Link to={`/account/${bud._id}`}>{bud.name}</Link>
                          </MUITypography>
                          {accountId === authentication.userId &&
                            <WarningButton
                              onClick={() => manageBuds('remove', bud._id)}
                            >
                              Delete Bud
                            </WarningButton>
                          }
                        </MUIListItem>
                      );
                    })
                  }
                </MUIList>
              </MUICard>
            </MUIGrid>

            {accountId === authentication.userId &&
              // passing fetchAccount as a prop so that the page reloads when a user responds to a request...  there is probably a better way to do this
              <BudRequests
                manageBuds={manageBuds}
                received_bud_requests={account.user.received_bud_requests}
                sent_bud_requests={account.user.sent_bud_requests}
              />
            }
          </MUIGrid>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default Account;