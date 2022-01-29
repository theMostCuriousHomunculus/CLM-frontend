import React, { useContext, useState } from 'react';
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

import CreateDeckForm from '../../forms/CreateDeckForm';
import DeleteDeckForm from '../../forms/DeleteDeckForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/Authentication';

export default function DeckAccordion({ pageClasses }) {
  const {
    accountState: { _id, decks }
  } = useContext(AccountContext);
  const { userID } = useContext(AuthenticationContext);
  const [deckToDelete, setDeckToDelete] = useState({
    _id: null,
    name: null
  });
  const [showCreateDeckForm, setShowCreateDeckForm] = useState(false);

  return (
    <React.Fragment>
      <CreateDeckForm
        open={showCreateDeckForm}
        toggleOpen={() => setShowCreateDeckForm((prevState) => !prevState)}
      />

      <DeleteDeckForm
        deckToDelete={deckToDelete}
        setDeckToDelete={setDeckToDelete}
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
              onClick={() => setShowCreateDeckForm(true)}
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
