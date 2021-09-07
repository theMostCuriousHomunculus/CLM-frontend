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

import Avatar from '../miscellaneous/Avatar';
import CreateMatchForm from './CreateMatchForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function MatchAccordion ({
  pageClasses
}) {

  const accountId = useParams().accountId;
  const { accountState: { matches } } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const [showMatchForm, setShowMatchForm] = React.useState(false);

  return (
    <React.Fragment>
      {accountId === userId &&
        <CreateMatchForm
          open={showMatchForm}
          toggleOpen={() => setShowMatchForm(prevState => !prevState)}
        />
      }
      
      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="match-content"
          id="match-header"
        >
          <MUITypography variant="h5">Matches</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer className={pageClasses.tableContainer}>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Players</MUITableCell>
                  <MUITableCell>Decks</MUITableCell>
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
                        <span style={{ display: 'flex', flexDirection: 'column' }}>
                          {match.decks &&
                            match.decks.map(deck => (
                              <Link key={deck._id} to={`/deck/${deck._id}`}>
                                {deck.name} / {deck.format}
                              </Link>
                            ))
                          }
                        </span>
                      </MUITableCell>
                      <MUITableCell>
                        {match.event &&
                          <Link to={`/event/${match.event._id}`}>
                            {match.event.name}
                          </Link>
                        }
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

        {accountId === userId &&
          <MUIAccordionActions>
            <MUIButton
              color="primary"
              onClick={() => setShowMatchForm(true)}
              size="small"
              variant="contained"
            >
              Create a Match
            </MUIButton>
          </MUIAccordionActions>
        }

      </MUIAccordion>

    </React.Fragment>
  );
};