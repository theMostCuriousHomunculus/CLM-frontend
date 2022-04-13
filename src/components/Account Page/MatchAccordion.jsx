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

import Avatar from '../miscellaneous/Avatar';
import CreateMatchForm from './CreateMatchForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

export default function MatchAccordion({ pageClasses }) {
  const { accountID } = useParams();
  const {
    accountState: { matches }
  } = React.useContext(AccountContext);
  const { userID } = React.useContext(AuthenticationContext);
  const [showMatchForm, setShowMatchForm] = React.useState(false);

  return (
    <React.Fragment>
      {accountID === userID && (
        <CreateMatchForm
          open={showMatchForm}
          toggleOpen={() => setShowMatchForm((prevState) => !prevState)}
        />
      )}

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="match-content"
          id="match-header"
        >
          <MUITypography>Matches ({matches.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Opponent</MUITableCell>
                  <MUITableCell>Decks</MUITableCell>
                  <MUITableCell>Event</MUITableCell>
                  <MUITableCell>Date</MUITableCell>
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {matches.map(function (match) {
                  const opponent = match.players.find((player) => player.account._id !== accountID);

                  return (
                    <MUITableRow key={match._id}>
                      <MUITableCell>
                        <Link to={`/match/${match._id}`}>
                          <Avatar
                            profile={opponent.account}
                            size="small"
                            style={{ marginRight: 16 }}
                          />
                        </Link>
                      </MUITableCell>
                      <MUITableCell>
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          {match.decks &&
                            match.decks.map((deck) => (
                              <Link key={deck._id} to={`/deck/${deck._id}`}>
                                {deck.name} / {deck.format}
                              </Link>
                            ))}
                        </span>
                      </MUITableCell>
                      <MUITableCell>
                        {match.event && (
                          <Link to={`/event/${match.event._id}`}>{match.event.name}</Link>
                        )}
                      </MUITableCell>
                      <MUITableCell>
                        {new Date(parseInt(match.createdAt)).toLocaleString()}
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
            <MUIButton onClick={() => setShowMatchForm(true)}>Create a Match</MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
