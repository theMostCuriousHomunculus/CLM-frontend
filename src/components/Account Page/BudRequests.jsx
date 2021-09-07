import React from 'react';
import { Link } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIPersonAddIcon from '@material-ui/icons/PersonAdd';
import MUINotInterestedIcon from '@material-ui/icons/NotInterested';

import Avatar from '../miscellaneous/Avatar';
import WarningButton from '../miscellaneous/WarningButton';
import { AccountContext } from '../../contexts/account-context';

export default function BudRequests () {

  const { accountState: { received_bud_requests, sent_bud_requests }, editAccount } = React.useContext(AccountContext);

  return (
    <React.Fragment>


          

        


          <MUIList>
            {sent_bud_requests.map(function (request) {
              return (
                <MUIListItem key={request._id}>
                  <Link to={`/account/${request._id}`}><Avatar alt={request.name} size='small' src={request.avatar} /></Link>
                </MUIListItem>
              );
            })}
          </MUIList>

    </React.Fragment>
  );
};