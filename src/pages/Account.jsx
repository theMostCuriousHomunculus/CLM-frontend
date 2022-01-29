import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardHeader from '@mui/material/CardHeader';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIIconButton from '@mui/material/IconButton';
import MUIInputLabel from '@mui/material/InputLabel';
import MUILocationOnIcon from '@mui/icons-material/LocationOn';
import MUINotificationsIcon from '@mui/icons-material/Notifications';
import MUIPersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import MUISelect from '@mui/material/Select';
import MUISwitch from '@mui/material/Switch';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import theme, { backgroundColor } from '../theme';
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
import { PermissionsContext } from '../contexts/Permissions';

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
  const {
    isLoggedIn,
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
  const {
    clearAndDeleteLocation,
    geolocationEnabled,
    geolocationSupported,
    notificationsEnabled,
    notificationsSupported,
    turnOnNotificationsAndSubscribeToPushMessaging,
    unsubscribeFromPushSubscription,
    watchAndPostLocation
  } = useContext(PermissionsContext);
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
            <React.Fragment>
              {accountID === userID && (
                <React.Fragment>
                  {notificationsSupported && (
                    <MUIFormControlLabel
                      control={
                        <MUISwitch
                          checked={notificationsEnabled}
                          inputProps={{ 'aria-label': 'controlled' }}
                          onChange={(event) => {
                            if (event.target.checked) {
                              turnOnNotificationsAndSubscribeToPushMessaging();
                            } else {
                              unsubscribeFromPushSubscription();
                            }
                          }}
                        />
                      }
                      label={
                        <MUITooltip title="Notifications">
                          <MUINotificationsIcon
                            color={
                              notificationsEnabled ? 'primary' : 'secondary'
                            }
                          />
                        </MUITooltip>
                      }
                      labelPlacement="start"
                    />
                  )}
                  {geolocationSupported && (
                    <React.Fragment>
                      <MUIFormControlLabel
                        control={
                          <MUISwitch
                            checked={geolocationEnabled}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onChange={(event) => {
                              if (event.target.checked) {
                                watchAndPostLocation();
                              } else {
                                clearAndDeleteLocation();
                              }
                            }}
                          />
                        }
                        label={
                          <MUITooltip title="Location Services">
                            <MUILocationOnIcon
                              color={
                                geolocationEnabled ? 'primary' : 'secondary'
                              }
                            />
                          </MUITooltip>
                        }
                        labelPlacement="start"
                      />
                      {geolocationEnabled && (
                        <div
                          style={{ display: 'flex', flexDirection: 'column' }}
                        >
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
                          <MUIFormControl
                            style={{ marginTop: 8 }}
                            variant="outlined"
                          >
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
                  )}
                </React.Fragment>
              )}
              {isLoggedIn &&
                accountID !== userID &&
                !buds.find((bud) => bud._id === userID) &&
                !received_bud_requests.find(
                  (request) => request._id === userID
                ) &&
                !sent_bud_requests.find(
                  (request) => request._id === userID
                ) && (
                  // only showing the add bud button if the user is logged in, they are viewing someone else's profile, and they are not already buds with nor have they already sent or received a bud request to or from the user whose profile they are viewing
                  <MUIIconButton
                    color="primary"
                    onClick={() =>
                      editAccount(
                        `action: "send",\nother_user_id: "${accountID}",\nreturn_other: true`
                      )
                    }
                  >
                    <MUIPersonAddOutlinedIcon fontSize="large" />
                  </MUIIconButton>
                )}
            </React.Fragment>
          }
          avatar={<Avatar alt={name} size="medium" src={avatar} />}
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
      </MUICard>

      <BudAccordion />

      <CubeAccordion pageClasses={classes} />

      <DeckAccordion pageClasses={classes} />

      <EventAccordion />

      {/* <MatchAccordion pageClasses={classes} /> */}
    </React.Fragment>
  );
}
