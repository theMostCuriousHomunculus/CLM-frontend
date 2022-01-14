import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardHeader from '@mui/material/CardHeader';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIPersonAddIcon from '@mui/icons-material/PersonAdd';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import theme, { backgroundColor } from '../theme';
import useRequest from '../hooks/request-hook';
import Avatar from '../components/miscellaneous/Avatar';
import BudAccordion from '../components/Account Page/BudAccordion';
import CubeAccordion from '../components/Account Page/CubeAccordion';
import DeckAccordion from '../components/Account Page/DeckAccordion';
import EventAccordion from '../components/Account Page/EventAccordion';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
// import MatchAccordion from '../components/Account Page/MatchAccordion';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import { AccountContext } from '../contexts/account-context';
import { AuthenticationContext } from '../contexts/Authentication';

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
  const { sendRequest } = useRequest();
  const {
    geolocationEnabled,
    isLoggedIn,
    setGeolocationEnabled,
    settings: { measurement_system, radius },
    userID
  } = useContext(AuthenticationContext);
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
    editAccount,
    fetchAccountByID,
    setAccountState
  } = useContext(AccountContext);
  const classes = useStyles();

  useEffect(() => {
    (async function () {
      await fetchAccountByID();
    })();
  }, [fetchAccountByID]);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <React.Fragment>
      <MUICard>
        <MUICardHeader
          action={
            accountID === userID && (
              <React.Fragment>
                <div style={{ alignItems: 'center', display: 'flex' }}>
                  <MUITooltip title="Turning on location services reveals nearby users you are not already connected with who have also enabled location services.  Useful if you are looking to expand or join a playgroup.">
                    <MUIHelpOutlineIcon color="primary" />
                  </MUITooltip>
                  <MUIFormControlLabel
                    control={
                      <MUISwitch
                        checked={geolocationEnabled}
                        inputProps={{ 'aria-label': 'controlled' }}
                        onChange={(event) => {
                          setGeolocationEnabled(event.target.checked);
                          if (!event.target.checked) {
                            sendRequest({
                              operation: 'deleteLocation',
                              get body() {
                                return {
                                  query: `
                                    mutation {
                                      ${this.operation} {
                                        _id
                                      }
                                    }
                                  `
                                };
                              }
                            });
                          }
                        }}
                      />
                    }
                    label="Location Services"
                    labelPlacement="start"
                    style={{ marginLeft: 8 }}
                  />
                </div>
                {geolocationEnabled && (
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <MUIFormControl variant="outlined">
                      <MUIInputLabel htmlFor="measurement-system-selector">
                        Units
                      </MUIInputLabel>
                      <MUISelect
                        fullWidth
                        label="Units"
                        native
                        onChange={(event) =>
                          editAccount(
                            `settings: {
                              measurement_system: ${event.target.value},
                              radius: ${radius}
                            }`
                          )
                        }
                        value={measurement_system}
                        inputProps={{
                          id: 'measurement-system-selector'
                        }}
                      >
                        <option value="imperial">Miles</option>
                        <option value="metric">Kilometers</option>
                      </MUISelect>
                    </MUIFormControl>
                    <MUIFormControl style={{ marginTop: 8 }} variant="outlined">
                      <MUIInputLabel htmlFor="radius-selector">
                        Distance
                      </MUIInputLabel>
                      <MUISelect
                        fullWidth
                        label="Distance"
                        native
                        onChange={(event) =>
                          editAccount(
                            `settings: {
                              measurement_system: ${measurement_system},
                              radius: ${event.target.value}
                            }`
                          )
                        }
                        value={radius}
                        inputProps={{
                          id: 'radius-selector'
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={100}>100</option>
                        <option value={1000}>1,000</option>
                      </MUISelect>
                    </MUIFormControl>
                  </div>
                )}
              </React.Fragment>
            )
          }
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
              labelText="Avatar"
              onSubmit={(chosenCard) => {
                editAccount(`avatar: "${chosenCard.art_crop}"`);
              }}
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

      {/* <MatchAccordion pageClasses={classes} /> */}
    </React.Fragment>
  );
}
