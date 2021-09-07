import React from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import theme, { backgroundColor } from '../theme';
import Avatar from '../components/miscellaneous/Avatar';
import BudAccordion from '../components/Account Page/BudAccordion';
import CubeAccordion from '../components/Account Page/CubeAccordion';
import DeckAccordion from '../components/Account Page/DeckAccordion';
import EventAccordion from '../components/Account Page/EventAccordion';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import MatchAccordion from '../components/Account Page/MatchAccordion';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AccountContext } from '../contexts/account-context';
import { AuthenticationContext } from '../contexts/authentication-context';

const useStyles = makeStyles({
  cardHeader: {
    alignItems: 'stretch',
    display: 'flex'
  },
  iconButton: {
    background: theme.palette.secondary.main,
    color: backgroundColor,
    '&:hover': {
      background: theme.palette.secondary.dark
    }
  },
  table: {
    minWidth: 350
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
      email,
      name,
      received_bud_requests,
      sent_bud_requests
    },
    setAccountState,
    editAccount,
    fetchAccountByID
  } = React.useContext(AccountContext);
  const classes = useStyles();

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

        <BudAccordion />

        <CubeAccordion pageClasses={classes} />

        <DeckAccordion pageClasses={classes} />

        <EventAccordion pageClasses={classes} />

        <MatchAccordion pageClasses={classes} />
      </React.Fragment>
  );
};