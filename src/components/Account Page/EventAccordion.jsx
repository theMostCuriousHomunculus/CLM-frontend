import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIButton from '@mui/material/Button';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import MUITableCell from '@mui/material/TableCell';
import MUITableContainer from '@mui/material/TableContainer';
import MUITableHead from '@mui/material/TableHead';
import MUITableRow from '@mui/material/TableRow';
import MUITypography from '@mui/material/Typography';

import CreateEventForm from './CreateEventForm';
import Avatar from '../miscellaneous/Avatar';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

export default function EventAccordion({ pageClasses }) {
  const { accountID } = useParams();
  const {
    accountState: { buds, cubes, events }
  } = React.useContext(AccountContext);
  const { userID } = React.useContext(AuthenticationContext);
  const [showEventForm, setShowEventForm] = React.useState(false);

  return (
    <React.Fragment>
      {accountID === userID && cubes.length > 0 && (
        <CreateEventForm
          buds={buds}
          cubes={cubes}
          open={showEventForm}
          toggleOpen={() => setShowEventForm((prevState) => !prevState)}
        />
      )}

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="event-content"
          id="event-header"
        >
          <MUITypography>Events ({events.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Name</MUITableCell>
                  <MUITableCell>Host</MUITableCell>
                  <MUITableCell>Other Players</MUITableCell>
                  <MUITableCell>Date</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {events.map(function (event) {
                  return (
                    <MUITableRow key={event._id}>
                      <MUITableCell>
                        <Link to={`/event/${event._id}`}>{event.name}</Link>
                      </MUITableCell>
                      <MUITableCell>
                        <Link to={`/account/${event.host._id}`}>
                          <Avatar
                            alt={event.host.name}
                            size="small"
                            src={event.host.avatar}
                          />
                        </Link>
                      </MUITableCell>
                      <MUITableCell style={{ display: 'flex' }}>
                        {event.players
                          .filter(
                            (player) => player.account._id !== event.host._id
                          )
                          .map((player) => (
                            <Link
                              key={player.account._id}
                              to={`/account/${player.account._id}`}
                            >
                              <Avatar
                                alt={player.account.name}
                                size="small"
                                src={player.account.avatar}
                              />
                            </Link>
                          ))}
                      </MUITableCell>
                      <MUITableCell>
                        {new Date(parseInt(event.createdAt)).toLocaleString()}
                      </MUITableCell>
                    </MUITableRow>
                  );
                })}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {accountID === userID && (
          <MUIAccordionActions>
            <MUIButton
              disabled={cubes.length === 0}
              onClick={() => setShowEventForm(true)}
            >
              {cubes.length === 0
                ? 'You must create a cube before hosting an event!'
                : 'Host an Event'}
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
