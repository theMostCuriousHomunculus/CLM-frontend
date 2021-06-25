import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';

import Avatar from '../miscellaneous/Avatar';
import CreateMatchForm from './CreateMatchForm';
import { AuthenticationContext } from '../../contexts/authentication-context';

const UserEventCard = (props) => {

  const { events, matches, pageClasses } = props;
  const accountId = useParams().accountId;
  const authentication = React.useContext(AuthenticationContext);
  const [showMatchForm, setShowMatchForm] = React.useState(false);

  return (
    <React.Fragment>
      {accountId === authentication.userId &&
        <CreateMatchForm
          events={events}
          open={showMatchForm}
          toggleOpen={() => setShowMatchForm(prevState => !prevState)}
        />
      }
      
      <MUICard>
        <MUICardHeader
          disableTypography={true}
          title={<MUITypography variant="h5">Matches</MUITypography>}
        />
        <MUICardContent>
          <MUITableContainer className={pageClasses.tableContainer}>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Players</MUITableCell>
                  <MUITableCell>Event</MUITableCell>
                  <MUITableCell>Date</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {matches.map(function (match) {
                  return (
                    <MUITableRow key={match._id}>
                      <MUITableCell>
                        <Link to={`/match/${match._id}`} style={{ alignItems: 'center', display: 'flex' }}>
                          <Avatar alt={match.players[0].account.name} size='small' src={match.players[0].account.avatar} style={{ marginRight: 16 }} />
                          {match.players[1] &&
                            <React.Fragment>
                              <span> — VERSUS — </span>
                              <Avatar alt={match.players[1].account.name} size='small' src={match.players[1].account.avatar} style={{ marginLeft: 16 }} />
                            </React.Fragment>
                          }
                        </Link>
                      </MUITableCell>
                      <MUITableCell>
                        <Link to ={`/event/${match.event._id}`}>
                          {match.event.name}
                        </Link>
                      </MUITableCell>
                      <MUITableCell>
                        {new Date(parseInt(match.event.createdAt)).toLocaleString()}
                      </MUITableCell>
                    </MUITableRow>
                  );
                })}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUICardContent>
        {accountId === authentication.userId &&
          <MUICardActions>
            <MUIButton
              color="primary"
              disabled={events.length === 0}
              onClick={() => setShowMatchForm(true)}
              size="small"
              variant="contained"
            >
              {events.length === 0 ? 'You must finish an event before creating a match!' : 'Create a Match'}
            </MUIButton>
          </MUICardActions>
        }
      </MUICard>
    </React.Fragment>
  );
};

export default UserEventCard;