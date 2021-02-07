import React from 'react';
import MUIPaper from '@material-ui/core/Paper';
import RVAutoSizer from 'react-virtualized-auto-sizer';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import AuthorizedCardRow from './AuthorizedCardRow';
import cumulativePercent from '../../functions/cumulative-percent';
import ReactWindowStickyHeaderList from '../miscellaneous/ReactWindowStickyHeaderList';
import theme from '../../theme';
import UnauthorizedCardRow from './UnauthorizedCardRow';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { monoColors } from '../../constants/color-objects';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  headerCell: {
    background: "inherit",
    padding: "0 8px",
    position: "absolute",
    top: "50%",
    transform: "translate(0%, -50%)"
  },
  headerRow: {
    background: theme.palette.primary.main,
    borderRadius: "4px 0 0 0",
    color: theme.palette.secondary.main,
    // display: "flex",
    // flexGrow: 1,
    fontFamily: "Ubuntu, Roboto, Arial, sans-serif",
    fontSize: "2rem",
    height: 80,
    minWidth: 1200,
    position: "relative"
  },
  tableContainer: {
    height: "80vh",
    margin: 8,
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

  const {
    activeComponentId,
    creator,
    dispatchMoveOrDeleteCard,
    displayedCardsLength,
    hidePreview,
    showPreview
  } = props;
  const [activeMenu, setActiveMenu] = React.useState({ card_id: null, menu: null });
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const columnWidths = React.useRef(creator._id === authentication.userId ?
    ["20%", "17.5%", "7.5%", "15%", "17.5%", "12.5%", "10%"] :
    ["25%", "20%", "10%", "17.5%", "0%", "15%", "12.5%"]);
  const columnNames = React.useRef(creator._id === authentication.userId ?
    ["Card Name", "Color Identity", "CMC", "Card Type", "Move / Delete", "Printing", "Purchase"] :
    ["Card Name", "Color Identity", "CMC", "Card Type", "Printing", "Purchase"]);
  const headerColumns = columnNames.current.map(function (column, index) {
    return (
      <div
        className={classes.headerCell}
        key={`header${index}`}
        style={{
          left: cumulativePercent(columnWidths.current, index),
          width: columnWidths.current[index]
        }}
      >
        {column}
      </div>
    );
  });
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);
  const { loading, sendRequest } = useRequest();

  const enablePrintChange = React.useCallback(async function (cardId, event, oracleId, printing) {
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
  }, [sendRequest]);

  const moveDeleteCard = React.useCallback(async function (cardId, destination) {
    setActiveMenu({ card_id: null, menu: null });
    const action = 'move_or_delete_card';
    try {
      const moveInfo = JSON.stringify({
        action,
        cardId,
        component: activeComponentId,
        destination: destination
      });

      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        moveInfo,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );

      dispatchMoveOrDeleteCard({ cardId, destination });
    } catch (error) {
      console.log(error);
    }
  }, [activeComponentId, authentication.token, cubeId, dispatchMoveOrDeleteCard, sendRequest])

  const submitCardChange = React.useCallback(async function (cardId, changes) {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`,
        'PATCH',
        JSON.stringify({
          action: 'edit_card',
          cardId,
          component: activeComponentId,
          ...changes
        }),
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
    } catch (error) {
      console.log(error);
    }
  }, [activeComponentId, authentication.token, cubeId, sendRequest]);

  return (
    <MUIPaper className={classes.tableContainer}>
      <RVAutoSizer>
        {({ height, width }) =>(
          <ReactWindowStickyHeaderList
            headerRow={
              <div className={classes.headerRow}>
                {headerColumns}
              </div>
            }
            height={height}
            itemCount={displayedCardsLength}
            itemSize={80}
            width={width}
          >
            {({ index, style }) => (
              // having some performance issues here; i don't want all rows to get re-rendered when one card is edited.  i will come back to this later.  maybe related to passing moveDeleteCard down from this component to children?
              <div className={classes.tableRow} style={style}>
                {creator._id === authentication.userId ?
                  <AuthorizedCardRow
                    activeMenu={activeMenu}
                    anchorEl={anchorEl}
                    availablePrintings={availablePrintings}
                    columnWidths={columnWidths.current}
                    enablePrintChange={enablePrintChange}
                    hidePreview={hidePreview}
                    index={index - 1}
                    loading={loading}
                    moveDeleteCard={moveDeleteCard}
                    selectedPrintIndex={selectedPrintIndex}
                    setActiveMenu={setActiveMenu}
                    setAnchorEl={setAnchorEl}
                    showPreview={showPreview}
                    submitCardChange={submitCardChange}
                  />
                  :
                  <UnauthorizedCardRow
                    columnWidths={columnWidths.current}
                    hidePreview={hidePreview}
                    index={index}
                    showPreview={showPreview}
                  />
                }
              </div>
            )}
          </ReactWindowStickyHeaderList>
        )}
      </RVAutoSizer>
    </MUIPaper>
  );
}

function mapStateToProps (state) {
  return {
    activeComponentId: state.active_component_id,
    creator: state.cube.creator,
    displayedCardsLength: state.displayed_cards.length
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchMoveOrDeleteCard: (payload) => dispatch(actionCreators.move_or_delete_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListView);