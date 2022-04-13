import React, { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
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
import CreateEventForm from '../../forms/CreateEventForm';
import TablePaginationActions from '../miscellaneous/TablePaginationActions';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';
import { ErrorContext } from '../../contexts/Error';

export default function EventAccordion() {
  const {
    accountState: { buds, cubes, events, total_events }
  } = useContext(AccountContext);
  const { userID } = useContext(AuthenticationContext);
  const { setErrorMessages } = useContext(ErrorContext);
  const { accountID } = useParams();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [showEventForm, setShowEventForm] = useState(false);
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - total_events) : 0;

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
        <MUIAccordionDetails style={{ display: 'flex', overflowX: 'auto' }}>
          <MUITableContainer
            style={{
              flexShrink: 0,
              minWidth: `${400 + Math.max(...events.map((event) => event.players.length)) * 50}px`
            }}
          >
            <MUITable stickyHeader>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Event</MUITableCell>
                  <MUITableCell>Cube</MUITableCell>
                  <MUITableCell>Host</MUITableCell>
                  <MUITableCell>Others</MUITableCell>
                  <MUITableCell>Date</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {(rowsPerPage > 0 && total_events > 5
                  ? events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  : events
                ).map(function (event) {
                  return (
                    <MUITableRow key={event._id}>
                      <MUITableCell>
                        <Link to={`/event/${event._id}`}>{event.name}</Link>
                      </MUITableCell>
                      <MUITableCell>
                        <span
                          style={{
                            alignItems: 'center',
                            columnGap: 8,
                            display: 'flex'
                          }}
                        >
                          {event.cube.image && (
                            <img
                              alt={
                                event.cube.image.image_uris
                                  ? event.cube.image.name
                                  : event.cube.image.card_faces[0].name
                              }
                              height={50}
                              src={
                                event.cube.image.image_uris
                                  ? event.cube.image.image_uris.art_crop
                                  : event.cube.image.card_faces[0].image_uris.art_crop
                              }
                              style={{ borderRadius: 4 }}
                            />
                          )}
                          {event.cube.name}
                        </span>
                      </MUITableCell>
                      <MUITableCell>
                        <Avatar profile={event.host} size="small" />
                      </MUITableCell>
                      <MUITableCell>
                        <span style={{ display: 'flex', columnGap: 4 }}>
                          {event.players
                            .filter(
                              (player) =>
                                player.account._id !== event.host._id &&
                                player.account._id !== accountID
                            )
                            .map((player) => (
                              <Avatar
                                key={player.account._id}
                                profile={player.account}
                                size="small"
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
                    <MUITableCell colSpan={5} />
                  </MUITableRow>
                )}
              </MUITableBody>
              {total_events > 5 && (
                <MUITableFooter>
                  <MUITablePagination
                    rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                    colSpan={5}
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
              onClick={() => {
                if (cubes.length === 0) {
                  setErrorMessages((prevState) => [
                    ...prevState,
                    "You don't have any cubes yet, you silly goose!"
                  ]);
                } else {
                  setShowEventForm(true);
                }
              }}
              startIcon={<MUIAddCircleOutlineOutlinedIcon />}
            >
              Host
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
