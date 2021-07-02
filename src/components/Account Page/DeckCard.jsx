import React from 'react';
import { Link } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUICard from '@material-ui/core/Card';
import MUICardActions from '@material-ui/core/CardActions';
import MUICardContent from '@material-ui/core/CardContent';
import MUICardHeader from '@material-ui/core/CardHeader';
import MUIDeleteForeverIcon from '@material-ui/icons/DeleteForever';
import MUIIconButton from '@material-ui/core/IconButton';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import MUITypography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import ConfirmationDialogue from '../miscellaneous/ConfirmationDialog';
import CreateDeckForm from './CreateDeckForm';
import theme, { backgroundColor } from '../../theme';
import { AccountContext } from '../../contexts/account-context';
import { AuthenticationContext } from '../../contexts/authentication-context';

const useStyles = makeStyles({
  iconButton: {
    background: theme.palette.secondary.main,
    color: backgroundColor,
    '&:hover': {
      background: theme.palette.secondary.dark
    }
  }
});

export default function DeckCard ({
  pageClasses
}) {

  const { accountState: { _id, decks }, deleteDeck } = React.useContext(AccountContext);
  const { userId } = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const [deckToDelete, setDeckToDelete] = React.useState({ _id: null, name: null })
  const [showDeckForm, setShowDeckForm] = React.useState(false);

  return (
    <React.Fragment>

      <ConfirmationDialogue
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
      </ConfirmationDialogue>

      <CreateDeckForm
        open={showDeckForm}
        toggleOpen={() => setShowDeckForm(prevState => !prevState)}
      />

      <MUICard>
        <MUICardHeader title="Decks" />
        <MUICardContent>
          <MUITableContainer className={pageClasses.tableContainer}>
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
                          className={classes.iconButton}
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
        </MUICardContent>
        {_id === userId &&
          <MUICardActions>
            <MUIButton
              color="primary"
              onClick={() => setShowDeckForm(true)}
              size="small"
              variant="contained"
            >
              Create a Deck
            </MUIButton>
          </MUICardActions>
        }
      </MUICard>
    </React.Fragment>
  );
};