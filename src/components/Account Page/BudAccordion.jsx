import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIBadge from '@mui/material/Badge';
import MUIDeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListSubheader from '@mui/material/ListSubheader';
import MUINotInterestedIcon from '@mui/icons-material/NotInterested';
import MUIPersonAddIcon from '@mui/icons-material/PersonAdd';
import MUITypography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import customSort from '../../functions/custom-sort';
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
    accountState: { buds, received_bud_requests, sent_bud_requests },
    editAccount
  } = React.useContext(AccountContext);
  const { userID } = React.useContext(AuthenticationContext);
  const [budToDelete, setBudToDelete] = React.useState({
    _id: null,
    avatar: null,
    name: null
  });
  const [potentialBuds, setPotentialBuds] = React.useState([]);

  React.useEffect(() => {
    const pbObject = {};

    for (const bud of buds) {
      for (const budsBud of bud.buds) {
        if (pbObject[budsBud._id]) {
          pbObject[budsBud._id].priority++;
        } else {
          pbObject[budsBud._id] = {
            avatar: budsBud.avatar,
            name: budsBud.name,
            priority: 1
          };
        }
      }
    }

    setPotentialBuds(
      Object.entries(pbObject)
        .sort((a, b) => b[1].priority - a[1].priority)
        .map((pb) => ({ _id: pb[0], avatar: pb[1].avatar, name: pb[1].name }))
        .filter(
          (pb) =>
            !buds
              .map((bud) => bud._id)
              .concat([accountID])
              .concat(received_bud_requests.map((req) => req._id))
              .concat(sent_bud_requests.map((req) => req._id))
              .includes(pb._id)
        )
    );
  }, [accountID, buds, received_bud_requests, sent_bud_requests]);

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          editAccount(`action: "remove",\nother_user_id: "${budToDelete._id}"`);
          setBudToDelete({ _id: null, avatar: null, name: null });
        }}
        open={!!budToDelete._id}
        title={`Are you sure you want to un-bud ${budToDelete.name}?`}
        toggleOpen={() =>
          setBudToDelete({ _id: null, avatar: null, name: null })
        }
      >
        <div style={{ display: 'flex' }}>
          <Avatar
            alt={budToDelete.name}
            size="large"
            src={budToDelete.avatar}
            style={{ marginRight: 16 }}
          />
          <MUITypography variant="body1">
            Think of all the good times you've had. And how lonely they'll be
            without you.
          </MUITypography>
        </div>
      </ConfirmationDialog>

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="bud-content"
          id="bud-header"
        >
          <MUITypography>Buds ({buds.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails style={{ display: 'block' }}>
          {accountID === userID && (
            <React.Fragment>
              <MUIListSubheader component="div" id="nearby-users">
                Nearby Users
              </MUIListSubheader>
              <MUIList className={classes.budList}>
                {customSort(buds, ['name']).map((bud) => (
                  <MUIListItem key={bud._id}>
                    {accountID === userID ? (
                      <MUIBadge
                        anchorOrigin={{
                          horizontal: 'right',
                          vertical: 'bottom'
                        }}
                        badgeContent={
                          <MUIDeleteForeverIcon className={classes.badgeIcon} />
                        }
                        className={classes.badge}
                        color="secondary"
                        onClick={(event) => {
                          if (
                            event.target
                              .closest('span')
                              .classList.contains('MuiBadge-colorSecondary')
                          ) {
                            setBudToDelete(bud);
                          }
                        }}
                        overlap="circular"
                      >
                        <Link to={`/account/${bud._id}`}>
                          <Avatar
                            alt={bud.name}
                            size="large"
                            src={bud.avatar}
                          />
                        </Link>
                      </MUIBadge>
                    ) : (
                      <Link to={`/account/${bud._id}`}>
                        <Avatar alt={bud.name} size="large" src={bud.avatar} />
                      </Link>
                    )}
                  </MUIListItem>
                ))}
              </MUIList>

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
                        badgeContent={
                          <MUINotInterestedIcon className={classes.badgeIcon} />
                        }
                        className={classes.badge}
                        color="secondary"
                        onClick={(event) => {
                          if (
                            event.target
                              .closest('span')
                              .classList.contains('MuiBadge-colorSecondary')
                          ) {
                            editAccount(
                              `action: "reject",\nother_user_id: "${request._id}"`
                            );
                          }
                        }}
                        overlap="circular"
                      >
                        <MUIBadge
                          anchorOrigin={{
                            horizontal: 'right',
                            vertical: 'top'
                          }}
                          badgeContent={
                            <MUIPersonAddIcon className={classes.badgeIcon} />
                          }
                          className={classes.badge}
                          color="primary"
                          onClick={(event) => {
                            if (
                              event.target
                                .closest('span')
                                .classList.contains('MuiBadge-colorPrimary')
                            ) {
                              editAccount(
                                `action: "accept",\nother_user_id: "${request._id}"`
                              );
                            }
                          }}
                          overlap="circular"
                        >
                          <Link to={`/account/${request._id}`}>
                            <Avatar
                              alt={request.name}
                              size="large"
                              src={request.avatar}
                            />
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
                        <Avatar
                          alt={request.name}
                          size="large"
                          src={request.avatar}
                        />
                      </Link>
                    </MUIListItem>
                  );
                })}
              </MUIList>

              <MUIListSubheader component="div" id="potential-buds">
                Potential
              </MUIListSubheader>
              <MUIList className={classes.budList}>
                {potentialBuds.map(function (pb) {
                  return (
                    <MUIListItem key={pb._id}>
                      <MUIBadge
                        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                        badgeContent={
                          <MUIPersonAddIcon className={classes.badgeIcon} />
                        }
                        className={classes.badge}
                        color="primary"
                        onClick={(event) => {
                          if (
                            event.target
                              .closest('span')
                              .classList.contains('MuiBadge-colorPrimary')
                          ) {
                            editAccount(
                              `action: "send",\nother_user_id: "${pb._id}"`
                            );
                          }
                        }}
                        overlap="circular"
                      >
                        <Link to={`/account/${pb._id}`}>
                          <Avatar alt={pb.name} size="large" src={pb.avatar} />
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
                    badgeContent={
                      <MUIDeleteForeverIcon className={classes.badgeIcon} />
                    }
                    className={classes.badge}
                    color="secondary"
                    onClick={(event) => {
                      if (
                        event.target
                          .closest('span')
                          .classList.contains('MuiBadge-colorSecondary')
                      ) {
                        setBudToDelete(bud);
                      }
                    }}
                    overlap="circular"
                  >
                    <Link to={`/account/${bud._id}`}>
                      <Avatar alt={bud.name} size="large" src={bud.avatar} />
                    </Link>
                  </MUIBadge>
                ) : (
                  <Link to={`/account/${bud._id}`}>
                    <Avatar alt={bud.name} size="large" src={bud.avatar} />
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
