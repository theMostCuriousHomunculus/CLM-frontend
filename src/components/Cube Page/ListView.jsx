import React from 'react';
import { useParams } from 'react-router-dom';
import MUICard from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import {
  AutoSizer as RVAutoSizer,
  CellMeasurer as RVCellMeasurer,
  CellMeasurerCache as RVCellMeasurerCache,
  Table as RVTable
} from 'react-virtualized';

import alphabeticalSort from '../../functions/alphabetical-sort';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { monoColors } from '../../constants/color-objects';
import { useCube } from '../../hooks/cube-hook';
import { useRequest } from '../../hooks/request-hook';
import AuthorizedCardRow from './AuthorizedCardRow';
import UnauthorizedCardRow from './UnauthorizedCardRow';
import theme from '../../theme';

const useStyles = makeStyles({
  headerCell: {
    background: "inherit",
    padding: "8px 0"
  },
  headerRow: {
    background: theme.palette.primary.main,
    color: theme.palette.secondary.main,
    display: "flex",
    flexGrow: 1,
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
    fontSize: "2rem",
    minWidth: 1200,
    padding: "0 8px"
  },
  tableContainer: {
    height: "80vh",
    padding: 0
  },
  tableRow: {
    display: "flex",
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
    minWidth: 1200,
    '&:hover': {
      backgroundColor: monoColors[5].hex
    }
  }
});

const ListView = (props) => {

  const [activeMenu, setActiveMenu] = React.useState({ card_id: null, menu: null });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const authentication = React.useContext(AuthenticationContext);
  const cache = React.useRef(new RVCellMeasurerCache({
    fixedWidth: true,
    defaultHeight: 96
  }));
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [cubeState, dispatch] = useCube(true);
  const columnWidths = cubeState.cube.creatorId === authentication.userId ?
    ["20%", "17.5%", "7.5%", "15%", "17.5%", "12.5%", "10%"] :
    ["25%", "20%", "10%", "17.5%", "0%", "15%", "12.5%"];
  const headerColumns = [
    <div className={classes.headerCell} key="header0" style={{ width: columnWidths[0] }}>Card Name</div>,
    <div className={classes.headerCell} key="header1" style={{ width: columnWidths[1] }}>Color Identity</div>,
    <div className={classes.headerCell} key="header2" style={{ width: columnWidths[2] }}>CMC</div>,
    <div className={classes.headerCell} key="header3" style={{ width: columnWidths[3] }}>Card Type</div>,
    cubeState.cube.creatorId === authentication.userId && <div className={classes.headerCell} key="header4" style={{ width: columnWidths[4] }}>Move / Delete</div>,
    <div className={classes.headerCell} key="header5" style={{ width: columnWidths[5] }}>Printing</div>,
    <div className={classes.headerCell} key="header6" style={{ width: columnWidths[6] }}>Purchase</div>
  ];
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);
  const sortedCards = alphabeticalSort(cubeState.displayed_cards);
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
    <MUICard className={classes.tableContainer}>
      <RVAutoSizer>
        {function ({width, height}) {
          return (
            <RVTable
              deferredMeasurementCache={cache.current}
              headerHeight={52.8}
              headerRowRenderer={function ({style}) {
                return (
                  <div className={classes.headerRow} style={style}>
                    {headerColumns}
                  </div>
                );
              }}
              height={height}
              rowCount={sortedCards.length}
              rowGetter={function ({index}) {
                return sortedCards[index];
              }}
              rowHeight={cache.current.rowHeight}
              rowRenderer={function ({index, key, parent, style}) {
                const card = sortedCards[index];
                return (
                  <RVCellMeasurer
                    cache={cache.current}
                    columnIndex={0}
                    key={key}
                    parent={parent}
                    rowIndex={index}
                  >
                    <div className={classes.tableRow} style={style}>
                      {cubeState.cube.creatorId === authentication.userId ?
                        <AuthorizedCardRow
                          activeMenu={activeMenu}
                          anchorEl={anchorEl}
                          availablePrintings={availablePrintings}
                          card={card}
                          columnWidths={columnWidths}
                          enablePrintChange={enablePrintChange}
                          hidePreview={props.hidePreview}
                          loading={loading}
                          moveDeleteCard={moveDeleteCard}
                          selectedPrintIndex={selectedPrintIndex}
                          setActiveMenu={setActiveMenu}
                          setAnchorEl={setAnchorEl}
                          showPreview={props.showPreview}
                          submitCardChange={submitCardChange}
                        /> :
                        <UnauthorizedCardRow
                          card={card}
                          columnWidths={columnWidths}
                          hidePreview={props.hidePreview}
                          showPreview={props.showPreview}
                        />
                      }
                    </div>
                  </RVCellMeasurer>
                );
              }}
              width={width}
            >
            </RVTable>
          );
        }}
      </RVAutoSizer>
    </MUICard>
  );
}

export default React.memo(ListView);