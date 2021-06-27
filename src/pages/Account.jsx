import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../functions/custom-sort';
import useRequest from '../hooks/request-hook';
import BudRequests from '../components/Account Page/BudRequests';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import Avatar from '../components/miscellaneous/Avatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import UserCubeCard from '../components/Account Page/UserCubeCard';
import UserEventCard from '../components/Account Page/UserEventCard';
import UserMatchCard from '../components/Account Page/UserMatchCard';
import WarningButton from '../components/miscellaneous/WarningButton';
import { AuthenticationContext } from '../contexts/authentication-context';

const useStyles = makeStyles({
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

export default function Account () {

  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, sendRequest } = useRequest();
  const [account, setAccount] = React.useState({
    _id: accountId,
    avatar: '',
    buds: [],
    cubes: [],
    events: [],
    matches: [],
    name: '',
    received_bud_requests: [],
    sent_bud_requests: []
  });
  const [budToDelete, setBudToDelete] = React.useState({ _id: null, avatar: null, name: null })
  const desiredAccountInfo = `
    avatar
    buds {
      _id
      avatar
      name
    }
    cubes {
      _id
      description
      mainboard {
        _id
      }
      modules {
        _id
        cards {
          _id
        }
        name
      }
      name
      rotations {
        _id
        cards {
          _id
        }
        name
        size
      }
      sideboard {
        _id
      }
    }
    events {
      _id
      createdAt
      host {
        _id
        avatar
        name
      }
      name
      players {
        account {
          _id
          avatar
          name
        }
      }
    }
    matches {
      _id
      cube {
        _id
        name
      }
      event {
        _id
        createdAt
        name
      }
      players {
        account {
          _id
          avatar
          name
        }
      }
    }
    name
    received_bud_requests {
      _id
      avatar
      name
    }
    sent_bud_requests {
      _id
      avatar
      name
    }
  `;

  React.useEffect(() => {
    async function fetchAccount () {
      await sendRequest({
        callback: (data) => {
          setAccount(data);
        },
        operation: 'fetchAccountByID',
        load: true,
        get body () {
          return {
            query: `
              query {
                ${this.operation}(_id: "${accountId}") {
                  ${desiredAccountInfo}
                }
              }
            `
          }
        }
      });
    }

    fetchAccount();
  }, [accountId, desiredAccountInfo, sendRequest]);

  async function submitChanges (changes) {
    await sendRequest({
      callback: (data) => {
        if (changes.includes('send')) {
          setAccount(prevState => ({
            ...prevState,
            received_bud_requests: [...prevState.received_bud_requests, { _id: authentication.userId }]
          }));
        } else {
          setAccount(data);
        }
      },
      operation: 'editAccount',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  ${changes}
                }
              ) {
                ${desiredAccountInfo}
              }
            }
          `
        }
      }
    });
  }

  function updateCubeList (cubeId) {
    setAccount((prevState) => {
      return {
        ...prevState,
        cubes: prevState.cubes.filter((cube) => cube._id !== cubeId)
      };
    });
  }

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        <ConfirmationDialog
          confirmHandler={() => {
            submitChanges(`action: "remove",\nother_user_id: "${budToDelete._id}"`);
            setBudToDelete({ _id: null, avatar: null, name: null });
          }}
          open={!!budToDelete._id}
          title={`Are you sure you want to un-bud ${budToDelete.name}?`}
          toggleOpen={() => setBudToDelete({ _id: null, avatar: null, name: null })}
        >
          <div style={{ display: 'flex' }}>
            <Avatar alt={budToDelete.name} size='large' src={budToDelete.avatar} style={{ marginRight: 16 }} />
            <MUITypography variant="body1">
              Think of all the good times you've had.  And how lonely they'll be without you.
            </MUITypography>
          </div>
        </ConfirmationDialog>

        <MUICard>
          <MUICardHeader
            avatar={<Avatar alt={account.name} size='large' src={account.avatar} />}
            className={classes.cardHeader}
            title={accountId === authentication.userId ?
              <MUITextField
                autoComplete="off"
                inputProps={{ onBlur: event => submitChanges(`name: "${event.target.value}"`) }}
                label="Account Name"
                margin="dense"
                onChange={(event) => {
                  event.persist();
                  setAccount(prevState => ({
                    ...prevState,
                    name: event.target.value
                  }));
                }}
                style={{
                  width: 300
                }}
                type="text"
                value={account.name}
                variant="outlined"
              /> :
              <MUITypography variant="h2">
                {account.name}
              </MUITypography>
            }
            subheader={accountId === authentication.userId &&
              <MUITypography color="textSecondary" variant="subtitle1">
                {account.email}
              </MUITypography>
            }
          />
          {accountId === authentication.userId &&
            <MUICardActions>
              <ScryfallRequest
                buttonText="Change Avatar"
                labelText="Change your avatar"
                onSubmit={chosenCard => submitChanges(`avatar: "${chosenCard.art_crop}"`)}
              />
            </MUICardActions>
          }
          {authentication.isLoggedIn &&
            accountId !== authentication.userId &&
            account.buds.filter(bud => bud._id === authentication.userId).length === 0 &&
            account.received_bud_requests.filter(request => request._id === authentication.userId).length === 0 &&
            account.sent_bud_requests.filter(request => request._id === authentication.userId).length === 0 &&
            // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
            <MUICardActions>
              <MUIButton
                color="primary"
                onClick={() => submitChanges(`action: "send",\nother_user_id: "${accountId}"`)}
                size="small"
                variant="contained"
              >
                <MUIPersonAddIcon />
              </MUIButton>
            </MUICardActions>
          }
        </MUICard>

        <MUIGrid container spacing={0}>
          <MUIGrid item xs={12} lg={6}>
            <UserCubeCard
              cubes={account.cubes}
              pageClasses={classes}
              updateCubeList={updateCubeList}
            />
          </MUIGrid>

          <MUIGrid item xs={12} lg={6}>
            <MUICard>
              <MUICardHeader title="Decks" />
              <MUICardContent>
              </MUICardContent>
              <MUICardActions>
              </MUICardActions>
            </MUICard>
          </MUIGrid>

          <MUIGrid item xs={12} lg={6}>
            <UserEventCard
              buds={account.buds}
              cubes={account.cubes}
              events={account.events}
              pageClasses={classes}
            />
          </MUIGrid>

          <MUIGrid item xs={12} lg={6}>
            <UserMatchCard
              events={account.events}
              matches={account.matches}
              pageClasses={classes}
            />
          </MUIGrid>

          <MUIGrid item xs={12} sm={6} md={4}>
            <MUICard>
              <MUICardHeader title="Buds" />
              <MUIList>
                {customSort(account.buds, ['name']).map(bud => (
                  <MUIListItem key={bud._id} style={{ justifyContent: 'space-between' }}>
                    <Link to={`/account/${bud._id}`}>
                      <Avatar alt={bud.name} size='small' src={bud.avatar} />
                    </Link>
                    {accountId === authentication.userId &&
                      <WarningButton onClick={() => setBudToDelete(bud)}>
                        Un-Bud
                      </WarningButton>
                    }
                  </MUIListItem>
                ))}
              </MUIList>
            </MUICard>
          </MUIGrid>

          {accountId === authentication.userId &&
            <BudRequests
              manageBuds={submitChanges}
              received_bud_requests={account.received_bud_requests}
              sent_bud_requests={account.sent_bud_requests}
            />
          }
        </MUIGrid>
      </React.Fragment>
  );
};