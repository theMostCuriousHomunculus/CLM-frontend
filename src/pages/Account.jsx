import React from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardHeader from '@mui/material/CardHeader';
import MUIPersonAddIcon from '@mui/icons-material/PersonAdd';
import MUITextField from '@mui/material/TextField';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

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

export default function Account() {
  const { accountID } = useParams();
  const { isLoggedIn, userID } = React.useContext(AuthenticationContext);
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
    async function initialize() {
      await fetchAccountByID();
    }

    initialize();
  }, [fetchAccountByID]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <MUICard>
        <MUICardHeader
          avatar={<Avatar alt={name} size="large" src={avatar} />}
          className={classes.cardHeader}
          title={
            <MUITextField
              autoComplete="off"
              disabled={accountID !== userID}
              inputProps={{
                onBlur: (event) => editAccount(`name: "${event.target.value}"`)
              }}
              label="Account Name"
              onChange={(event) => {
                event.persist();
                setAccountState((prevState) => ({
                  ...prevState,
                  name: event.target.value
                }));
              }}
              type="text"
              value={name}
            />
          }
          subheader={
            accountID === userID && (
              <MUITypography color="textSecondary" variant="subtitle1">
                {email}
              </MUITypography>
            )
          }
        />
        {accountID === userID && (
          <MUICardActions>
            <ScryfallRequest
              buttonText="Change Avatar"
              labelText="Change your avatar"
              onSubmit={(chosenCard) =>
                editAccount(`avatar: "${chosenCard.art_crop}"`)
              }
            />
          </MUICardActions>
        )}
        {isLoggedIn &&
          accountID !== userID &&
          buds.filter((bud) => bud._id === userID).length === 0 &&
          received_bud_requests.filter((request) => request._id === userID)
            .length === 0 &&
          sent_bud_requests.filter((request) => request._id === userID)
            .length === 0 && (
            // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
            <MUICardActions>
              <MUIButton
                onClick={() =>
                  editAccount(
                    `action: "send",\nother_user_id: "${accountID}",\nreturn_other: true`
                  )
                }
              >
                <MUIPersonAddIcon />
              </MUIButton>
            </MUICardActions>
          )}
      </MUICard>

      <BudAccordion />

      <CubeAccordion pageClasses={classes} />

      <DeckAccordion pageClasses={classes} />

      <EventAccordion pageClasses={classes} />

      <MatchAccordion pageClasses={classes} />
    </React.Fragment>
  );
}
