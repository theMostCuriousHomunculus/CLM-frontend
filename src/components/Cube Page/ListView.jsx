import React from 'react';
import { useParams } from 'react-router-dom';
import MUICard from '@material-ui/core/Card';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../../functions/alphabetical-sort';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { useCube } from '../../hooks/cube-hook';
import { useRequest } from '../../hooks/request-hook';
import AuthorizedCardRow from './AuthorizedCardRow';
import UnauthorizedCardRow from './UnauthorizedCardRow';

const useStyles = makeStyles({
  container: {
    maxHeight: '80vh'
  },
  table: {
    minWidth: 1200
  }
});

const ListView = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [cubeState, dispatch] = useCube(true);
  const { sendRequest } = useRequest();

  async function moveDeleteCard (cardId, destinationComponentId) {
    const action = 'move_or_delete_card';
    const destination = destinationComponentId;
    const moveInfo = JSON.stringify({
      action,
      card_id: cardId,
      component: cubeState.active_component_id,
      destination
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
      'PATCH',
      moveInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    dispatch('UPDATE_CUBE', updatedCube);
  }

  async function submitCardChange (cardId, propertyName, propertyValue) {
    const action = 'edit_card';
    let cardChanges = {
      action,
      card_id: cardId,
      component: cubeState.active_component_id
    };
    cardChanges[propertyName] = propertyValue;
    cardChanges = JSON.stringify(cardChanges);
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
      'PATCH',
      cardChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    dispatch('UPDATE_CUBE', updatedCube);
  }

  return (
    <MUICard style={{ marginTop: 16 }}>
      <MUITableContainer className={classes.container}>
        <MUITable stickyHeader className={classes.table}>
          <MUITableHead>
            <MUITableRow>
              <MUITableCell>Card Name</MUITableCell>
              <MUITableCell>Color Identity</MUITableCell>
              <MUITableCell>CMC</MUITableCell>
              <MUITableCell>Card Type</MUITableCell>
              {cubeState.cube.creatorId === authentication.userId &&
                <MUITableCell>Move / Delete</MUITableCell>
              }
              <MUITableCell>Printing</MUITableCell>
              <MUITableCell>Purchase</MUITableCell>
            </MUITableRow>
          </MUITableHead>
          <MUITableBody>
            {cubeState.cube.creatorId === authentication.userId ?
              alphabeticalSort(cubeState.displayed_cards).map(function (card) {
                return (
                  <AuthorizedCardRow
                    card={card}
                    hidePreview={props.hidePreview}
                    key={card._id}
                    moveDeleteCard={moveDeleteCard}
                    showPreview={props.showPreview}
                    submitCardChange={submitCardChange}
                  />
                );
              }) :
              alphabeticalSort(cubeState.displayed_cards).map(function (card) {
                return (
                  <UnauthorizedCardRow
                    card={card}
                    hidePreview={props.hidePreview}
                    key={card._id}
                    showPreview={props.showPreview}
                  />
                );
              })
            }
          </MUITableBody>
        </MUITable>
      </MUITableContainer>
    </MUICard>
  );
}

export default React.memo(ListView);