import React from 'react';
import axios from 'axios';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import ColorCheckboxes from './ColorCheckboxes';
import ErrorDialog from '../miscellaneous/ErrorDialog';
import { actionCreators } from '../../store/actions/cube-actions';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';
import MoveDeleteMenu from './MoveDeleteMenu';

const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    padding: "0 8px"
  }
});

const AuthorizedCardRow = (props) => {

  const {
    card: {
      _id,
      back_image,
      cmc,
      color_identity,
      image,
      name,
      oracle_id,
      printing,
      purchase_link,
      type_line
    },
    columnWidths,
    dispatchEditCard,
    hidePreview,
    showPreview,
    submitCardChange
  } = props;
  const classes = useStyles();
  const [activeMenu, setActiveMenu] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

  async function enablePrintChange (event) {
    setActiveMenu('print');
    setAnchorEl(event.currentTarget);

    try {
      setLoading(true);
      let printings = await axios.get(`https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracle_id}&unique=prints`);
      printings = printings.data.data.map(function(print) {
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
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  function selectPrinting (index) {
    setActiveMenu(null);
    setAnchorEl(null);
    submitCardChange(_id, {
      back_image: availablePrintings[index].back_image,
      image: availablePrintings[index].image,
      mtgo_id: availablePrintings[index].mtgo_id,
      printing: availablePrintings[index].printing,
      purchase_link: availablePrintings[index].purchase_link
    });
    dispatchEditCard({
      cardId: _id,
      back_image: availablePrintings[index].back_image,
      image: availablePrintings[index].image,
      mtgo_id: availablePrintings[index].mtgo_id,
      printing: availablePrintings[index].printing,
      purchase_link: availablePrintings[index].purchase_link
    });
  };

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <div
        back_image={back_image}
        className={classes.tableCell}
        image={image}
        onMouseOut={hidePreview}
        onMouseOver={showPreview}
        style={{ cursor: "default", width: columnWidths[0] }}
      >
        {name}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[1] }}>
        <ColorCheckboxes
          color_identity={color_identity}
          card_id={_id}
          submitCardChange={submitCardChange}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[2] }}>
        <MUITextField
          defaultValue={cmc}
          inputProps={{
            max: 16,
            min: 0,
            onBlur: (event) => {
              submitCardChange(_id, { cmc: parseInt(event.target.value) });
              dispatchEditCard({ cardId: _id, cmc: parseInt(event.target.value) })
            },
            step: 1
          }}
          margin="dense"
          type="number"
          variant="outlined"
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[3] }}>
        <MUITextField
          autoComplete="off"
          defaultValue={type_line}
          inputProps={{
            onBlur: (event) => {
              submitCardChange(_id, { type_line: event.target.value });
              dispatchEditCard({ cardId: _id, type_line: event.target.value });
            }
          }}
          margin="dense"
          type="text"
          variant="outlined"
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[4] }}>
        <MoveDeleteMenu
          cardId={_id}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[5] }}>
        <MUIList component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={enablePrintChange}
          >
            <MUIListItemText
              // primary="Selected Printing"
              secondary={printing}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          id="printing"
          anchorEl={anchorEl}
          keepMounted
          open={activeMenu === 'print'}
          onClose={function () {
            setActiveMenu(null);
            setAnchorEl(null);
          }}
        >
          {loading ?
            <MUICircularProgress color="primary" size={20} /> :
            availablePrintings.map((option, index) => (
              <MUIMenuItem
                back_image={option.back_image}
                image={option.image}
                key={`${_id}-printing-${index}`}
                onMouseOut={hidePreview}
                onMouseOver={showPreview}
                selected={index === selectedPrintIndex}
                onClick={() => selectPrinting(index)}
              >
                {option.printing}
              </MUIMenuItem>
            ))
          }
        </MUIMenu>
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[6] }}>
        <a href={purchase_link}>
          <TCGPlayerLogo style={{ width: "75%" }} />
        </a>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps (state, ownProps) {
  return {
    card: state.displayed_cards[ownProps.index]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AuthorizedCardRow));