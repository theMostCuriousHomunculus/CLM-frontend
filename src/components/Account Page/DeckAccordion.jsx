import React from 'react';
import { Link } from 'react-router-dom';
import MUIAccordion from '@material-ui/core/Accordion';
import MUIAccordionActions from '@material-ui/core/AccordionActions';
import MUIAccordionDetails from '@material-ui/core/AccordionDetails';
import MUIAccordionSummary from '@material-ui/core/AccordionSummary';
import MUIButton from '@material-ui/core/Button';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';

import ConfirmationDialog from '../miscellaneous/ConfirmationDialog';
import CreateDeckForm from './CreateDeckForm';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

export default function DeckAccordion ({
  pageClasses
}) {

  const { accountState: { _id, decks }, deleteDeck } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const [deckToDelete, setDeckToDelete] = React.useState({ _id: null, name: null })
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
          This action cannot be undone.  You may want to export your list first.
        </MUITypography>
      </ConfirmationDialog>

      <CreateDeckForm
        open={showDeckForm}
        toggleOpen={() => setShowDeckForm(prevState => !prevState)}
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
                  {_id === userId &&
                    <MUITableCell>Delete</MUITableCell>
                  }
                </MUITableRow>
              </MUITableHead>
              <MUITableBody>
                {decks.map(deck => (
                  <MUITableRow key={deck._id}>
                    <MUITableCell>
                      <Link to={`/deck/${deck._id}`}>{deck.name}</Link>
                    </MUITableCell>
                    <MUITableCell>
                      {deck.format}
                    </MUITableCell>
                    {_id === userId &&
                      <MUITableCell>
                        <MUIIconButton
                          className={pageClasses.iconButton}
                          onClick={() => setDeckToDelete({ _id: deck._id, name: deck.name })}
                          size="small"
                        >
                          <MUIDeleteForeverIcon />
                        </MUIIconButton>
                      </MUITableCell>
                    }
                  </MUITableRow>
                ))}
              </MUITableBody>
            </MUITable>
          </MUITableContainer>
        </MUIAccordionDetails>

        {_id === userId &&
          <MUIAccordionActions>
            <MUIButton
              color="primary"
              onClick={() => setShowDeckForm(true)}
              size="small"
              variant="contained"
            >
              Create a Deck
            </MUIButton>
          </MUIAccordionActions>
        }
        
      </MUIAccordion>

    </React.Fragment>
  );
};