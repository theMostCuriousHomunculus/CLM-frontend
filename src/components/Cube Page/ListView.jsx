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

  const [activeMenu, setActiveMenu] = React.useState({ card_id: null, menu: null });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [cubeState, dispatch] = useCube(true);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);
  const { loading, sendRequest } = useRequest();

  async function enablePrintChange (cardId, event, oracleId, printing) {
    setActiveMenu({ card_id: cardId, menu: 'print' });
    setAnchorEl(event.currentTarget);

    try {
      let printings = await sendRequest(`https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracleId}&unique=prints`);
      printings = printings.data.map(function(print) {
        let back_image, image;
        if (print.layout === "transform") {
          back_image = print.card_faces[1].image_uris.large;
          image = print.card_faces[0].image_uris.large;
        } else {
          image = print.image_uris.large;
        }
        return (
          {
            back_image,
            image,
            mtgo_id: print.mtgo_id,
            printing: print.set_name + " - " + print.collector_number,
            purchase_link: print.purchase_uris.tcgplayer.split("&")[0]
          }
        );
      });
      setAvailablePrintings(printings);
      setSelectedPrintIndex(printings.findIndex(function (print) {
        return print.printing === printing;
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async function moveDeleteCard (cardId, destinationComponentId) {
    setActiveMenu({ card_id: null, menu: null });
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

  async function submitCardChange (cardId, changes) {
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
      'PATCH',
      JSON.stringify({
        action: 'edit_card',
        card_id: cardId,
        component: cubeState.active_component_id,
        ...changes
      }),
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
              {/*<MUITableCell>Color Identity</MUITableCell>*/}
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
                    activeMenu={activeMenu}
                    anchorEl={anchorEl}
                    availablePrintings={availablePrintings}
                    card={card}
                    enablePrintChange={enablePrintChange}
                    hidePreview={props.hidePreview}
                    key={card._id}
                    loading={loading}
                    moveDeleteCard={moveDeleteCard}
                    selectedPrintIndex={selectedPrintIndex}
                    setActiveMenu={setActiveMenu}
                    setAnchorEl={setAnchorEl}
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