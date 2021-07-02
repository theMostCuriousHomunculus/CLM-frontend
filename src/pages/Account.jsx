import React from 'react';
import { Link, useParams } from 'react-router-dom';
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
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../functions/custom-sort';
import BudRequests from '../components/Account Page/BudRequests';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import CubeCard from '../components/Account Page/CubeCard';
import DeckCard from '../components/Account Page/DeckCard';
import Avatar from '../components/miscellaneous/Avatar';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import EventCard from '../components/Account Page/EventCard';
import MatchCard from '../components/Account Page/MatchCard';
import WarningButton from '../components/miscellaneous/WarningButton';
import { AccountContext } from '../contexts/account-context';
import { AuthenticationContext } from '../contexts/authentication-context';

const useStyles = makeStyles({
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
  },
  flexGrow: {
    flexGrow: 1
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
  const { isLoggedIn, userId } = React.useContext(AuthenticationContext);
  const { loading, accountState, setAccountState, editAccount, fetchAccountByID } = React.useContext(AccountContext);
  const classes = useStyles();
  const [budToDelete, setBudToDelete] = React.useState({ _id: null, avatar: null, name: null })

  React.useEffect(() => {
    async function initialize () {
      await fetchAccountByID();
    }

    initialize();
  }, [fetchAccountByID]);

  return (
    loading ?
      <LoadingSpinner /> :
      <React.Fragment>
        <ConfirmationDialog
          confirmHandler={() => {
            editAccount(`action: "remove",\nother_user_id: "${budToDelete._id}"`);
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
            avatar={<Avatar alt={accountState.name} size='large' src={accountState.avatar} />}
            className={classes.cardHeader}
            title={accountId === userId ?
              <MUITextField
                autoComplete="off"
                inputProps={{ onBlur: event => editAccount(`name: "${event.target.value}"`) }}
                label="Account Name"
                margin="dense"
                onChange={(event) => {
                  event.persist();
                  setAccountState(prevState => ({
                    ...prevState,
                    name: event.target.value
                  }));
                }}
                style={{
                  width: 300
                }}
                type="text"
                value={accountState.name}
                variant="outlined"
              /> :
              <MUITypography variant="h2">
                {accountState.name}
              </MUITypography>
            }
            subheader={accountId === userId &&
              <MUITypography color="textSecondary" variant="subtitle1">
                {accountState.email}
              </MUITypography>
            }
          />
          {accountId === userId &&
            <MUICardActions>
              <ScryfallRequest
                buttonText="Change Avatar"
                labelText="Change your avatar"
                onSubmit={chosenCard => editAccount(`avatar: "${chosenCard.art_crop}"`)}
              />
            </MUICardActions>
          }
          {isLoggedIn &&
            accountId !== userId &&
            accountState.buds.filter(bud => bud._id === userId).length === 0 &&
            accountState.received_bud_requests.filter(request => request._id === userId).length === 0 &&
            accountState.sent_bud_requests.filter(request => request._id === userId).length === 0 &&
            // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
            <MUICardActions>
              <MUIButton
                color="primary"
                onClick={() => editAccount(`action: "send",\nother_user_id: "${accountId}"`)}
                size="small"
                variant="contained"
              >
                <MUIPersonAddIcon />
              </MUIButton>
            </MUICardActions>
          }
        </MUICard>

        <MUIGrid container spacing={0}>
          <MUIGrid item xs={12} md={6}>
            <CubeCard pageClasses={classes} />
          </MUIGrid>

          <MUIGrid item xs={12} md={6}>
            <DeckCard pageClasses={classes} />
          </MUIGrid>

          <MUIGrid item xs={12} md={6}>
            <EventCard
              buds={accountState.buds}
              cubes={accountState.cubes}
              events={accountState.events}
              pageClasses={classes}
            />
          </MUIGrid>

          <MUIGrid item xs={12} md={6}>
            <MatchCard
              events={accountState.events}
              matches={accountState.matches}
              pageClasses={classes}
            />
          </MUIGrid>

          <MUIGrid item xs={12} sm={6} md={4}>
            <MUICard>
              <MUICardHeader title="Buds" />
              <MUIList>
                {customSort(accountState.buds, ['name']).map(bud => (
                  <MUIListItem key={bud._id} style={{ justifyContent: 'space-between' }}>
                    <Link to={`/account/${bud._id}`}>
                      <Avatar alt={bud.name} size='small' src={bud.avatar} />
                    </Link>
                    {accountId === userId &&
                      <WarningButton onClick={() => setBudToDelete(bud)}>
                        Un-Bud
                      </WarningButton>
                    }
                  </MUIListItem>
                ))}
              </MUIList>
            </MUICard>
          </MUIGrid>

          {accountId === userId &&
            <BudRequests />
          }
        </MUIGrid>
      </React.Fragment>
  );
};