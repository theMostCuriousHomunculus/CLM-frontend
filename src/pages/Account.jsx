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

import { AuthenticationContext } from '../contexts/authentication-context';
import theme from '../theme';
import { useRequest } from '../hooks/request-hook';
import BudRequests from '../components/Account Page/BudRequests';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import UserCubeCard from '../components/Account Page/UserCubeCard';
import UserDraftCard from '../components/Account Page/UserDraftCard';

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
  tableBody: {
    '& *': {
      fontSize: '1.6rem'
    }
  },
  tableContainer: {
    maxHeight: '40vh'
  },
  tableHead: {
    '& *': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      fontSize: '2.4rem'
    }
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
  const [drafts, setDrafts] = React.useState([]);
  const [user, setUser] = React.useState({});

  React.useEffect(() => {
    fetchAccount();
  }, [accountId, authentication.token]);

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

  async function fetchAccount () {
    try {
      const headers = authentication.token ? { Authorization: 'Bearer ' + authentication.token } : {};
      const accountData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/${accountId}`, 'GET', null, headers);
      setUser(accountData);
      const cubeData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cube?creator=${accountId}`, 'GET', null, {});
      setCubes(cubeData.cubes);
      const draftData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/draft?drafter=${accountId}`, 'GET', null, {});
      setDrafts(draftData.drafts);
    } catch (error) {
      console.log('Error: ' + error.message);
    }
  };

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
              title={<MUITypography variant="h2">{user.name}</MUITypography>}
              subheader={accountId === authentication.userId ? <MUITypography variant="h3">{user.email}</MUITypography> : null}
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

          <MUIGrid container>

            <MUIGrid item xs={12} lg={6}>
              <UserCubeCard classes={classes} cubes={cubes} />
            </MUIGrid>

            <MUIGrid item xs={12} lg={6}>
              <UserDraftCard buds={user.buds} classes={classes} cubes={cubes} drafts={drafts} />
            </MUIGrid>

          </MUIGrid>

          <MUIGrid container>
            <MUIGrid item xs={12} sm={6} md={4}>
              <MUICard>
                <MUICardHeader title={<MUITypography variant="h3">Buds</MUITypography>} />
                <MUIList>
                  {user.buds &&
                    user.buds.map(function (bud) {
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