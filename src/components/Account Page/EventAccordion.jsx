import React from 'react';
import { Link, useParams } from 'react-router-dom';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionActions from '@material-ui/core/AccordionActions';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIButton from '@material-ui/core/Button';
import MUIExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';

import CreateEventForm from './CreateEventForm';
import Avatar from '../miscellaneous/Avatar';
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function EventAccordion ({
  buds,
  cubes,
  events,
  pageClasses
}) {

  const accountId = useParams().accountId;
  const { userId } = React.useContext(AuthenticationContext);
  const [showEventForm, setShowEventForm] = React.useState(false);

  return (
    <React.Fragment>
      {accountId === userId && cubes.length > 0 &&
        <CreateEventForm
          buds={buds}
          cubes={cubes}
          open={showEventForm}
          toggleOpen={() => setShowEventForm(prevState => !prevState)}
        />
      }
      
      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="event-content"
          id="event-header"
        >
          <MUITypography variant="h5">Events</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer className={pageClasses.tableContainer}>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Name</MUITableCell>
                  <MUITableCell>Host</MUITableCell>
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
                        <Link to ={`/account/${event.host._id}`}>
                          <Avatar alt={event.host.name} size='small' src={event.host.avatar} />
                        </Link>
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

        {accountId === userId &&
          <MUIAccordionActions>
            <MUIButton
              color="primary"
              disabled={cubes.length === 0}
              onClick={() => setShowEventForm(true)}
              size="small"
              variant="contained"
            >
              {cubes.length === 0 ? 'You must create a cube before hosting an event!' : 'Host an Event'}
            </MUIButton>
          </MUIAccordionActions>
        }

      </MUIAccordion>
    
    </React.Fragment>
  );
};