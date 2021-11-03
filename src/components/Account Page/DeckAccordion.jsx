import React from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIButton from '@mui/material/Button';
import MUIDeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MUIExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MUIIconButton from '@mui/material/IconButton';
import MUITable from '@mui/material/Table';
import MUITableBody from '@mui/material/TableBody';
import MUITableCell from '@mui/material/TableCell';
import MUITableContainer from '@mui/material/TableContainer';
import MUITableHead from '@mui/material/TableHead';
import MUITableRow from '@mui/material/TableRow';
import MUITypography from '@mui/material/Typography';

import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import CreateDeckForm from './CreateDeckForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function DeckAccordion({ pageClasses }) {
  const {
    accountState: { _id, decks },
    deleteDeck
  } = React.useContext(AccountContext);
  const { userID } = React.useContext(AuthenticationContext);
  const [deckToDelete, setDeckToDelete] = React.useState({
    _id: null,
    name: null
  });
  const [showDeckForm, setShowDeckForm] = React.useState(false);

  return (
    <React.Fragment>
      <ConfirmationDialog
        confirmHandler={() => {
          deleteDeck(deckToDelete._id);
          setDeckToDelete({ _id: null, name: null });
        }}
        open={!!deckToDelete._id}
        title={`Are you sure you want to delete "${deckToDelete.name}?`}
        toggleOpen={() => setDeckToDelete({ _id: null, name: null })}
      >
        <MUITypography variant="body1">
          This action cannot be undone. You may want to export your list first.
        </MUITypography>
      </ConfirmationDialog>

      <CreateDeckForm
        open={showDeckForm}
        toggleOpen={() => setShowDeckForm((prevState) => !prevState)}
      />

      <MUIAccordion>
        <MUIAccordionSummary
          expandIcon={<MUIExpandMoreIcon />}
          aria-controls="deck-content"
          id="deck-header"
        >
          <MUITypography>Decks ({decks.length})</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Name</MUITableCell>
                  <MUITableCell>Format</MUITableCell>
                  {_id === userID && <MUITableCell>Delete</MUITableCell>}
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {decks.map((deck) => (
                  <MUITableRow key={deck._id}>
                    <MUITableCell>
                      <Link to={`/deck/${deck._id}`}>{deck.name}</Link>
                    </MUITableCell>
                    <MUITableCell>{deck.format}</MUITableCell>
                    {_id === userID && (
                      <MUITableCell>
                        <MUIIconButton
                          className={pageClasses.iconButton}
                          onClick={() =>
                            setDeckToDelete({ _id: deck._id, name: deck.name })
                          }
                          size="small"
                        >
                          <MUIDeleteForeverIcon />
                        </MUIIconButton>
                      </MUITableCell>
                    )}
                  </MUITableRow>
                ))}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {_id === userID && (
          <MUIAccordionActions>
            <MUIButton onClick={() => setShowDeckForm(true)}>
              Create a Deck
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
