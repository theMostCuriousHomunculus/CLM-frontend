import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIBadge from '@mui/material/Badge';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListSubheader from '@mui/material/ListSubheader';
import MUINotInterestedIcon from '@mui/icons-material/NotInterested';
import MUIPersonAddIcon from '@mui/icons-material/PersonAdd';
import MUIPersonRemoveIcon from '@mui/icons-material/PersonRemove';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import customSort from '../../functions/custom-sort';
import initiateBudRequest from '../../graphql/mutations/account/initiate-bud-request';
import respondToBudRequest from '../../graphql/mutations/account/respond-to-bud-request';
import revokeBudship from '../../graphql/mutations/account/revoke-budship';
import Avatar from '../miscellaneous/Avatar';
import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

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
  budList: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > .MuiListItem-root': {
      width: 'fit-content'
    }
  }
});

export default function BudAccordion() {
  const { accountID } = useParams();
  const classes = useStyles();
  const {
    accountState: { buds, nearby_users, received_bud_requests, sent_bud_requests }
  } = useContext(AccountContext);
  const { geolocationEnabled, userID } = useContext(AuthenticationContext);
  const [budToDelete, setBudToDelete] = useState();
  const [recommendedBuds, setRecommendedBuds] = useState([]);

  useEffect(() => {
    const rbObject = {};

    for (const bud of buds) {
      for (const budsBud of bud.buds) {
        if (rbObject[budsBud._id]) {
          rbObject[budsBud._id].priority++;
        } else {
          rbObject[budsBud._id] = {
            avatar: budsBud.avatar,
            name: budsBud.name,
            priority: 1
          };
        }
      }
    }

    setRecommendedBuds(
      Object.entries(rbObject)
        .sort((a, b) => b[1].priority - a[1].priority)
        .map((rb) => ({ _id: rb[0], avatar: rb[1].avatar, name: rb[1].name }))
        .filter(
          (rb) =>
            !buds
              .map((bud) => bud._id)
              .concat([accountID])
              .concat(received_bud_requests.map((req) => req._id))
              .concat(sent_bud_requests.map((req) => req._id))
              .includes(rb._id)
        )
    );
  }, [accountID, buds, received_bud_requests, sent_bud_requests]);

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          revokeBudship({
            variables: { other_user_id: budToDelete?._id }
          });
          setBudToDelete(null);
        }}
        open={!!budToDelete}
        title={`Are you sure you want to un-bud ${budToDelete?.name}?`}
        toggleOpen={() => setBudToDelete(null)}
      >
        <div style={{ display: 'flex' }}>
          <Avatar profile={budToDelete} size="medium" style={{ marginRight: 16 }} />
          <MUITypography variant="body1">
            Think of all the good times you've had. And how lonely they'll be without you.
          </MUITypography>
        </div>
      </ConfirmationDialog>

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="bud-content"
          id="bud-header"
        >
          <MUITypography variant="h3">Buds</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails style={{ display: 'block' }}>
          {accountID === userID && (
            <React.Fragment>
              {geolocationEnabled && (
                <React.Fragment>
                  <MUIListSubheader component="div" id="nearby-users">
                    Nearby Users
                  </MUIListSubheader>
                  {nearby_users ? (
                    <MUIList className={classes.budList}>
                      {customSort(nearby_users, ['name']).map((nearby_user) => (
                        <MUIListItem key={nearby_user._id}>
                          <MUIBadge
                            anchorOrigin={{
                              horizontal: 'right',
                              vertical: 'top'
                            }}
                            badgeContent={<MUIPersonAddIcon className={classes.badgeIcon} />}
                            className={classes.badge}
                            color="primary"
                            onClick={(event) => {
                              if (
                                event.target
                                  .closest('span')
                                  .classList.contains('MuiBadge-colorPrimary')
                              ) {
                                initiateBudRequest({
                                  variables: { other_user_id: nearby_user._id }
                                });
                              }
                            }}
                            overlap="circular"
                          >
                            <Link to={`/account/${nearby_user._id}`}>
                              <Avatar profile={nearby_user} size="medium" />
                            </Link>
                          </MUIBadge>
                        </MUIListItem>
                      ))}
                    </MUIList>
                  ) : (
                    <MUITypography variant="body1">Determining Location...</MUITypography>
                  )}
                </React.Fragment>
              )}

              <MUIListSubheader component="div" id="aspiring-buds">
                Aspiring
              </MUIListSubheader>
              <MUIList className={classes.budList}>
                {received_bud_requests.map(function (request) {
                  return (
                    <MUIListItem key={request._id}>
                      <MUIBadge
                        anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom'
                        }}
                        badgeContent={<MUINotInterestedIcon className={classes.badgeIcon} />}
                        className={classes.badge}
                        color="secondary"
                        onClick={(event) => {
                          if (
                            event.target
                              .closest('span')
                              .classList.contains('MuiBadge-colorSecondary')
                          ) {
                            respondToBudRequest({
                              variables: { other_user_id: request._id, response: 'reject' }
                            });
                          }
                        }}
                        overlap="circular"
                      >
                        <MUIBadge
                          anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'top'
                          }}
                          badgeContent={<MUIPersonAddIcon className={classes.badgeIcon} />}
                          className={classes.badge}
                          color="primary"
                          onClick={(event) => {
                            if (
                              event.target
                                .closest('span')
                                .classList.contains('MuiBadge-colorPrimary')
                            ) {
                              respondToBudRequest({
                                variables: { other_user_id: request._id, response: 'accept' }
                              });
                            }
                          }}
                          overlap="circular"
                        >
                          <Link to={`/account/${request._id}`}>
                            <Avatar profile={request} size="medium" />
                          </Link>
                        </MUIBadge>
                      </MUIBadge>
                    </MUIListItem>
                  );
                })}
              </MUIList>

              <MUIListSubheader component="div" id="pending-buds">
                Pending
              </MUIListSubheader>
              <MUIList className={classes.budList}>
                {sent_bud_requests.map(function (request) {
                  return (
                    <MUIListItem key={request._id}>
                      <Link to={`/account/${request._id}`}>
                        <Avatar profile={request} size="medium" />
                      </Link>
                    </MUIListItem>
                  );
                })}
              </MUIList>

              <MUIListSubheader component="div" id="potential-buds">
                Recommended
              </MUIListSubheader>
              <MUIList className={classes.budList}>
                {recommendedBuds.map(function (pb) {
                  return (
                    <MUIListItem key={pb._id}>
                      <MUIBadge
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        badgeContent={<MUIPersonAddIcon className={classes.badgeIcon} />}
                        className={classes.badge}
                        color="primary"
                        onClick={(event) => {
                          if (
                            event.target.closest('span').classList.contains('MuiBadge-colorPrimary')
                          ) {
                            initiateBudRequest({
                              variables: { other_user_id: pb._id }
                            });
                          }
                        }}
                        overlap="circular"
                      >
                        <Link to={`/account/${pb._id}`}>
                          <Avatar profile={pb} size="medium" />
                        </Link>
                      </MUIBadge>
                    </MUIListItem>
                  );
                })}
              </MUIList>
            </React.Fragment>
          )}

          <MUIListSubheader component="div" id="accepted-buds">
            Accepted
          </MUIListSubheader>
          <MUIList className={classes.budList}>
            {customSort(buds, ['name']).map((bud) => (
              <MUIListItem key={bud._id}>
                {accountID === userID ? (
                  <MUIBadge
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    badgeContent={<MUIPersonRemoveIcon className={classes.badgeIcon} />}
                    className={classes.badge}
                    color="secondary"
                    onClick={(event) => {
                      if (
                        event.target.closest('span').classList.contains('MuiBadge-colorSecondary')
                      ) {
                        setBudToDelete(bud);
                      }
                    }}
                    overlap="circular"
                  >
                    <Link to={`/account/${bud._id}`}>
                      <Avatar profile={bud} size="medium" />
                    </Link>
                  </MUIBadge>
                ) : (
                  <Link to={`/account/${bud._id}`}>
                    <Avatar profile={bud} size="medium" />
                  </Link>
                )}
              </MUIListItem>
            ))}
          </MUIList>
        </MUIAccordionDetails>
      </MUIAccordion>
    </React.Fragment>
  );
}
