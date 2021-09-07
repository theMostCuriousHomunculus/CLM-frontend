import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIBadge from '@material-ui/core/Badge';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUINotInterestedIcon from '@material-ui/icons/NotInterested';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../functions/custom-sort';
import Avatar from '../components/miscellaneous/Avatar';
import ConfirmationDialog from '../components/miscellaneous/ConfirmationDialog';
import CubeAccordion from '../components/Account Page/CubeAccordion';
import DeckAccordion from '../components/Account Page/DeckAccordion';
import EventAccordion from '../components/Account Page/EventAccordion';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MatchAccordion from '../components/Account Page/MatchAccordion';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AccountContext } from '../contexts/account-context';
import { AuthenticationContext } from '../contexts/authentication-context';

const useStyles = makeStyles({
  badge: {
    '& > .MuiBadge-badge': {
      borderRadius: '100%',
      color: 'white',
      cursor: 'pointer',
      height: 28,
      padding: 4,
      width: 28
    }
  },
  badgeIcon: {
    height: 20,
    width: 20
  },
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
    maxHeight: 'calc(100vh - 8px)'
  }
});

export default function Account () {

  const accountId = useParams().accountId;
  const { isLoggedIn, userId } = React.useContext(AuthenticationContext);
  const {
    loading,
    accountState: {
      avatar,
      buds,
      cubes,
      // decks,
      email,
      events,
      matches,
      name,
      received_bud_requests,
      sent_bud_requests
    },
    setAccountState,
    editAccount,
    fetchAccountByID
  } = React.useContext(AccountContext);
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
            avatar={<Avatar alt={name} size='large' src={avatar} />}
            className={classes.cardHeader}
            title={
              <MUITextField
                autoComplete="off"
                disabled={accountId !== userId}
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
                value={name}
                variant="outlined"
              />
            }
            subheader={accountId === userId &&
              <MUITypography color="textSecondary" variant="subtitle1">
                {email}
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
            buds.filter(bud => bud._id === userId).length === 0 &&
            received_bud_requests.filter(request => request._id === userId).length === 0 &&
            sent_bud_requests.filter(request => request._id === userId).length === 0 &&
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

        <CubeAccordion pageClasses={classes} />

        <DeckAccordion pageClasses={classes} />

        <EventAccordion
          buds={buds}
          cubes={cubes}
          events={events}
          pageClasses={classes}
        />

        <MatchAccordion
          events={events}
          matches={matches}
          pageClasses={classes}
        />

        <MUIAccordion>
          <MUIAccordionSummary
            expandIcon={<MUIExpandMoreIcon />}
            aria-controls="bud-content"
            id="bud-header"
          >
            <MUITypography variant="h5">Buds</MUITypography>
          </MUIAccordionSummary>
          <MUIAccordionDetails>
            <MUIList style={{ display: 'flex' }}>
              {customSort(buds, ['name']).map(bud => (
                <MUIListItem key={bud._id}>
                  {accountId === userId ?
                    <MUIBadge
                      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                      badgeContent={<MUIDeleteForeverIcon className={classes.badgeIcon} />}
                      className={classes.badge}
                      color="secondary"
                      onClick={event => {
                        if (event.target.closest('span').classList.contains("MuiBadge-colorSecondary")) {
                          setBudToDelete(bud);
                        }
                      }}
                      overlap="circle"
                      style={{ transform: 'translate(20px, 20px)' }}
                    >
                      <Link to={`/account/${bud._id}`}>
                        <Avatar alt={bud.name} size='small' src={bud.avatar} />
                      </Link>
                    </MUIBadge> :
                    <Link to={`/account/${bud._id}`}>
                      <Avatar alt={bud.name} size='small' src={bud.avatar} />
                    </Link>
                  }
                </MUIListItem>
              ))}
            </MUIList>
          </MUIAccordionDetails>
        </MUIAccordion>

        {accountId === userId &&
          <React.Fragment>
            <MUIAccordion>
              <MUIAccordionSummary
                expandIcon={<MUIExpandMoreIcon />}
                aria-controls="aspiring-bud-content"
                id="aspiring-bud-header"
              >
                <MUITypography variant="h5">Aspring Buds</MUITypography>
              </MUIAccordionSummary>
              <MUIAccordionDetails>
                <MUIList style={{ display: 'flex' }}>
                  {received_bud_requests.map(function (request) {
                    return (
                      <MUIListItem key={request._id}>
                        <MUIBadge
                          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                          badgeContent={<MUINotInterestedIcon className={classes.badgeIcon} />}
                          className={classes.badge}
                          color="secondary"
                          onClick={event => {
                            if (event.target.closest('span').classList.contains("MuiBadge-colorSecondary")) {
                              editAccount(`action: "reject",\nother_user_id: "${request._id}"`);
                            }
                          }}
                          overlap="circle"
                          style={{ transform: 'translate(20px, 20px)' }}
                        >
                          <MUIBadge
                            anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                            badgeContent={<MUIPersonAddIcon className={classes.badgeIcon} />}
                            className={classes.badge}
                            color="primary"
                            onClick={event => {
                              if (event.target.closest('span').classList.contains("MuiBadge-colorPrimary")) {
                                editAccount(`action: "accept",\nother_user_id: "${request._id}"`);
                              }
                            }}
                            overlap="circle"
                          >
                            <Link to={`/account/${request._id}`}>
                              <Avatar alt={request.name} size='small' src={request.avatar} />
                            </Link>
                          </MUIBadge>
                        </MUIBadge>
                      </MUIListItem>
                    );
                  })}
                </MUIList>
              </MUIAccordionDetails>
            </MUIAccordion>

            <MUIAccordion>
              <MUIAccordionSummary
                expandIcon={<MUIExpandMoreIcon />}
                aria-controls="pending-bud-content"
                id="pending-bud-header"
              >
                <MUITypography variant="h5">Pending Buds</MUITypography>
              </MUIAccordionSummary>
              <MUIAccordionDetails>
                <MUIList style={{ display: 'flex' }}>
                  {sent_bud_requests.map(function (request) {
                    return (
                      <MUIListItem key={request._id}>
                        <Link to={`/account/${request._id}`}>
                          <Avatar alt={request.name} size='small' src={request.avatar} />
                        </Link>
                      </MUIListItem>
                    );
                  })}
                </MUIList>
              </MUIAccordionDetails>
            </MUIAccordion>
          </React.Fragment>
        }

      </React.Fragment>
  );
};