import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../../functions/alphabetical-sort';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useCube } from '../../hooks/cube-hook';
import AuthorizedCardRow from './AuthorizedCardRow';
import UnauthorizedCardRow from './UnauthorizedCardRow';

const useStyles = makeStyles({
  container: {
    maxHeight: '80vh'
  },
  table: {
    minWidth: 650
  },
  tableBody: {
    '& *': {
      fontSize: '1.6rem'
    }
  },
  tableHead: {
    '& *': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      fontSize: '2.4rem'
    }
  }
});

const ListView = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeState = useCube(true)[0];

  return (
    <MUICard>
      <MUITableContainer className={classes.container}>
        <MUITable stickyHeader className={classes.table}>
          <MUITableHead className={classes.tableHead}>
            <MUITableRow>
              <MUITableCell>Card Name</MUITableCell>
              <MUITableCell>Color Identity</MUITableCell>
              <MUITableCell>CMC</MUITableCell>
              <MUITableCell>Card Type</MUITableCell>
              {cubeState.cube.creator === authentication.userId &&
                <MUITableCell>Move / Delete</MUITableCell>
              }
              <MUITableCell>Printing</MUITableCell>
              <MUITableCell>Purchase</MUITableCell>
            </MUITableRow>
          </MUITableHead>
          <MUITableBody className={classes.tableBody}>
            {cubeState.cube.creator === authentication.userId ?
              alphabeticalSort(cubeState.displayed_cards).map(function (card) {
                return (
                  <AuthorizedCardRow card={card} hidePreview={props.hidePreview} showPreview={props.showPreview} />
                );
              }) :
              alphabeticalSort(cubeState.displayed_cards).map(function (card) {
                return (
                  <UnauthorizedCardRow card={card} hidePreview={props.hidePreview} showPreview={props.showPreview} />
                );
              })
            }
          </MUITableBody>
        </MUITable>
      </MUITableContainer>
    </MUICard>
  );
}

export default ListView;