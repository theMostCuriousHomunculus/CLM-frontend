import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MUIButton from '@mui/material/Button';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import MUITableCell from '@mui/material/TableCell';
import MUITableContainer from '@mui/material/TableContainer';
import MUITableFooter from '@mui/material/TableFooter';
import MUITableHead from '@mui/material/TableHead';
import MUITablePagination from '@mui/material/TablePagination';
import MUITableRow from '@mui/material/TableRow';
import MUITypography from '@mui/material/Typography';

import Avatar from '../miscellaneous/Avatar';
import CreateEventForm from './CreateEventForm';
import TablePaginationActions from '../miscellaneous/TablePaginationActions';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

export default function EventAccordion({ pageClasses }) {
  const {
    accountState: { buds, cubes, events, total_events }
  } = useContext(AccountContext);
  const { userID } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const { accountID } = useParams();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEventForm, setShowEventForm] = useState(false);
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total_events) : 0;

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
          <MUITypography variant="h3">Events</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Cube</MUITableCell>
                  <MUITableCell>Host</MUITableCell>
                  <MUITableCell>Other Players</MUITableCell>
                  <MUITableCell>Date</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {(rowsPerPage > 0 && total_events > 5
                  ? events.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : events
                ).map(function (event) {
                  return (
                    <MUITableRow
                      key={event._id}
                      onClick={() => navigate(`/event/${event._id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      <MUITableCell>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {event.cube.image && (
                            <img
                              alt={event.cube.image.alt}
                              height={50}
                              src={event.cube.image.src}
                              style={{ borderRadius: 4, marginRight: 8 }}
                            />
                          )}
                          {event.cube.name}
                        </span>
                      </MUITableCell>
                      <MUITableCell>
                        <Avatar
                          alt={event.host.name}
                          size="small"
                          src={event.host.avatar}
                        />
                      </MUITableCell>
                      <MUITableCell>
                        <span style={{ display: 'flex' }}>
                          {event.players
                            .filter(
                              (player) => player.account._id !== event.host._id
                            )
                            .map((player) => (
                              <Avatar
                                alt={player.account.name}
                                key={player.account._id}
                                size="small"
                                src={player.account.avatar}
                              />
                            ))}
                        </span>
                      </MUITableCell>
                      <MUITableCell>
                        {new Date(parseInt(event.createdAt)).toLocaleString()}
                      </MUITableCell>
                    </MUITableRow>
                  );
                })}

                {emptyRows > 0 && (
                  <MUITableRow style={{ height: 59 * emptyRows }}>
                    <MUITableCell colSpan={4} />
                  </MUITableRow>
                )}
              </MUITableBody>
              {total_events > 5 && (
                <MUITableFooter>
                  <MUITablePagination
                    rowsPerPageOptions={[
                      5,
                      10,
                      25,
                      { label: 'All', value: -1 }
                    ]}
                    colSpan={4}
                    count={total_events}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    SelectProps={{
                      inputProps: {
                        'aria-label': 'rows per page'
                      },
                      native: true
                    }}
                    onPageChange={(event, newPage) => {
                      // TODO?: send request to backend and update cache
                      setPage(newPage);
                    }}
                    onRowsPerPageChange={(event) => {
                      // TODO?: send request to backend and update cache
                      setRowsPerPage(parseInt(event.target.value));
                      setPage(0);
                    }}
                    ActionsComponent={TablePaginationActions}
                  />
                </MUITableFooter>
              )}
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {accountID === userID && (
          <MUIAccordionActions>
            <MUIButton
              disabled={cubes.length === 0}
              onClick={() => setShowEventForm(true)}
              startIcon={<MUIAddCircleOutlineOutlinedIcon />}
            >
              {cubes.length === 0 ? 'You have no Cubes!' : 'Host an Event'}
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
