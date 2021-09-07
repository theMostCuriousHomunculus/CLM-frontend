import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIBadge from '@material-ui/core/Badge';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListSubheader from '@material-ui/core/ListSubheader';
import MUINotInterestedIcon from '@material-ui/icons/NotInterested';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import customSort from '../../functions/custom-sort';
import Avatar from '../miscellaneous/Avatar';
import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

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
    '& > .MuiListItem-root': {
      width: 'fit-content'
    }
  }
});

export default function BudAccordion () {

  const accountId = useParams().accountId;
  const classes = useStyles();
  const { accountState: { buds, received_bud_requests, sent_bud_requests }, editAccount } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const [budToDelete, setBudToDelete] = React.useState({ _id: null, avatar: null, name: null })

  return (
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

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="bud-content"
          id="bud-header"
        >
          <MUITypography>Buds ({buds.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails style={{ display: 'block' }}>
          {accountId === userId &&
            <React.Fragment>
              <MUIListSubheader component="div" id="aspiring-buds">Aspiring</MUIListSubheader>
              <MUIList className={classes.budList}>
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
                            <Avatar alt={request.name} size='large' src={request.avatar} />
                          </Link>
                        </MUIBadge>
                      </MUIBadge>
                    </MUIListItem>
                  );
                })}
              </MUIList>

              <MUIListSubheader component="div" id="pending-buds">Pending</MUIListSubheader>
              <MUIList className={classes.budList}>
                {sent_bud_requests.map(function (request) {
                  return (
                    <MUIListItem key={request._id}>
                      <Link to={`/account/${request._id}`}>
                        <Avatar alt={request.name} size='large' src={request.avatar} />
                      </Link>
                    </MUIListItem>
                  );
                })}
              </MUIList>
            </React.Fragment>
          }

          <MUIListSubheader component="div" id="accepted-buds">Accepted</MUIListSubheader>
          <MUIList className={classes.budList}>
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
                  >
                    <Link to={`/account/${bud._id}`}>
                      <Avatar alt={bud.name} size='large' src={bud.avatar} />
                    </Link>
                  </MUIBadge> :
                  <Link to={`/account/${bud._id}`}>
                    <Avatar alt={bud.name} size='large' src={bud.avatar} />
                  </Link>
                }
              </MUIListItem>
            ))}
          </MUIList>
        </MUIAccordionDetails>
      </MUIAccordion>
    </React.Fragment>
  );
};