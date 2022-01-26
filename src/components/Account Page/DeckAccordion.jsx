import React from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@mui/material/Accordion';
import MUIAccordionActions from '@mui/material/AccordionActions';
import MUIAccordionDetails from '@mui/material/AccordionDetails';
import MUIAccordionSummary from '@mui/material/AccordionSummary';
import MUIAddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import MUIButton from '@mui/material/Button';
import MUIDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
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
import { AuthenticationContext } from '../../contexts/Authentication';

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
          <MUITypography variant="h3">Decks</MUITypography>
        </MUIAccordionSummary>
        <MUIAccordionDetails>
          <MUITableContainer>
            <MUITable stickyHeader className={pageClasses.table}>
              <MUITableHead>
                <MUITableRow>
                  <MUITableCell>Deck</MUITableCell>
                  <MUITableCell>Format</MUITableCell>
                  {_id === userID && <MUITableCell />}
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {decks.map((deck) => (
                  <MUITableRow key={deck._id}>
                    <MUITableCell>
                      <span
                        style={{
                          alignItems: 'center',
                          columnGap: 8,
                          display: 'flex'
                        }}
                      >
                        {deck.image && (
                          <img
                            alt={deck.image.alt}
                            height={50}
                            src={deck.image.src}
                            style={{ borderRadius: 4 }}
                          />
                        )}
                        <Link to={`/deck/${deck._id}`}>{deck.name}</Link>
                      </span>
                    </MUITableCell>
                    <MUITableCell>{deck.format}</MUITableCell>
                    {_id === userID && (
                      <MUITableCell style={{ textAlign: 'right' }}>
                        <MUIIconButton
                          color="secondary"
                          onClick={() =>
                            setDeckToDelete({ _id: deck._id, name: deck.name })
                          }
                          size="small"
                        >
                          <MUIDeleteForeverOutlinedIcon fontSize="large" />
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
            <MUIButton
              onClick={() => setShowDeckForm(true)}
              startIcon={<MUIAddCircleOutlineOutlinedIcon />}
            >
              Brew
            </MUIButton>
          </MUIAccordionActions>
        )}
      </MUIAccordion>
    </React.Fragment>
  );
}
