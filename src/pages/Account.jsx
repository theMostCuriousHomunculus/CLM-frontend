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
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { cloneDeep } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import BudRequests from '../components/Account Page/BudRequests';
import ErrorDialog from '../components/miscellaneous/ErrorDialog';
import HoverPreview from '../components/miscellaneous/HoverPreview';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import SmallAvatar from '../components/miscellaneous/SmallAvatar';
import UserCubeCard from '../components/Account Page/UserCubeCard';
import UserEventCard from '../components/Account Page/UserEventCard';
import WarningButton from '../components/miscellaneous/WarningButton';
import { AuthenticationContext } from '../contexts/authentication-context';
import { editAccount, fetchAccountById } from '../requests/account-requests';

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
  const [errorMessage, setErrorMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);

  const fetchAccount = React.useCallback(async function() {
    try {
      setLoading(true);
      const response = await fetchAccountById(accountId, authentication.token);
      setAccount(response);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [accountId, authentication.token]);

  React.useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  async function submitChanges (changes) {
    try {
      await editAccount(changes, authentication.token);

      if (changes.action) {
        const budsCopy = cloneDeep(account.user.buds);
        const receivedBudRequestsCopy = cloneDeep(account.user.received_bud_requests);

        changes.buds = budsCopy;
        changes.received_bud_requests = receivedBudRequestsCopy;

        switch (changes.action) {
          case 'accept':
            const acceptedIndex = receivedBudRequestsCopy.findIndex((request) => request._id === changes.other_user_id);
            const newBud = receivedBudRequestsCopy.splice(acceptedIndex, 1);
            budsCopy.push(newBud[0]);
            break;
          case 'reject':
            const rejectedIndex = receivedBudRequestsCopy.findIndex((request) => request._id === changes.other_user_id);
            receivedBudRequestsCopy.splice(rejectedIndex, 1);
            break;
          case 'remove':
            const removedIndex = budsCopy.findIndex((bud) => bud._id === changes.other_user_id);
            budsCopy.splice(removedIndex, 1);
            break;
          case 'send':
            receivedBudRequestsCopy.push({ _id: authentication.userId });
            break;
          default:
            // should never happen
        }

        delete changes.action;
        delete changes.other_user_id;
      }

      setAccount((prevState) => {
        return {
          ...prevState,
          user: {
            ...prevState.user,
            ...changes
          }
        };
      });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  return (
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <React.Fragment>

          <ErrorDialog
            clear={() => setErrorMessage(null)}
            message={errorMessage}
          />

          <MUICard style={{ marginBottom: 0 }}>
            <MUICardHeader
              avatar={account.user.avatar &&
                <MUIAvatar alt={account.user.name} className={classes.avatarLarge} src={account.user.avatar} />
              }
              className={classes.cardHeader}
              disableTypography={true}
              title={accountId === authentication.userId ?
                <MUITextField
                  autoComplete="off"
                  defaultValue={account.user.name}
                  inputProps={{
                    onBlur: (event) => submitChanges({ name: event.target.value })
                  }}
                  label="Account Name"
                  style={{
                    width: 300
                  }}
                  type="text"
                  variant="outlined"
                />
                : <MUITypography variant="h5">
                  {account.user.name}
                </MUITypography>
              }
              subheader={accountId === authentication.userId &&
                <MUITypography color="textSecondary" variant="subtitle1">
                  {account.user.email}
                </MUITypography>
              }
            />
            {accountId === authentication.userId &&
              <MUICardActions>
                <HoverPreview>
                  <ScryfallRequest
                    buttonText="Change Avatar"
                    labelText="Change your avatar"
                    onSubmit={(chosenCard) => submitChanges({ avatar: chosenCard.art_crop })}
                  />
                </HoverPreview>
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
                  onClick={() => submitChanges({ action: 'send', other_user_id: accountId })}
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
                              onClick={() => submitChanges({ action: 'remove', other_user_id: bud._id })}
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
              <BudRequests
                manageBuds={submitChanges}
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