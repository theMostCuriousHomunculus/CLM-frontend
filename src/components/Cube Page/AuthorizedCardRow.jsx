import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useParams } from 'react-router-dom';

import ColorCheckboxes from './ColorCheckboxes';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';
import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    padding: "0 8px"
  }
});

const AuthorizedCardRow = (props) => {

  const {
    activeComponentId,
    activeComponentName,
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
    dispatchMoveOrDeleteCard,
    hidePreview,
    modules,
    rotations,
    showPreview,
    submitCardChange
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [activeMenu, setActiveMenu] = React.useState();
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);
  const { loading, sendRequest } = useRequest();

  async function enablePrintChange (event) {
    setActiveMenu('print');
    setAnchorEl(event.currentTarget);

    try {
      let printings = await sendRequest(`https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracle_id}&unique=prints`);
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

  async function moveDeleteCard (destination) {
    setActiveMenu(null);
    const action = 'move_or_delete_card';
    try {
      const moveInfo = JSON.stringify({
        action,
        cardId: _id,
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

      dispatchMoveOrDeleteCard({ cardId: _id, destination });
    } catch (error) {
      console.log(error);
    }
  }
console.log('balls');
  return (
    <React.Fragment>
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
        <MUIList component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={function (event) {
              setActiveMenu('component');
              setAnchorEl(event.currentTarget);
            }}
          >
            <MUIListItemText
              // primary="Move to"
              secondary={activeComponentName}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          anchorEl={anchorEl}
          keepMounted
          open={activeMenu === 'component'}
          onClose={function () {
            setActiveMenu(null);
            setAnchorEl(null);
          }}
        >
          {[{ name: 'Mainboard', _id: 'mainboard' },
            { name: 'Sideboard', _id: 'sideboard' },
            ...modules,
            ...rotations].map((component) => (
              <MUIMenuItem
                key={`${_id}-${component._id}`}
                onClick={function () {
                  moveDeleteCard(_id, component._id);
                }}
                selected={activeComponentId === component._id}
              >
                {component.name}
              </MUIMenuItem>
            ))
          }
          <MUIMenuItem
            onClick={function () {
              moveDeleteCard(_id);
            }}
          >
            Delete from Cube
          </MUIMenuItem>
        </MUIMenu>
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
                key={`${_id}-printing-${index}`}
                selected={index === selectedPrintIndex}
                onClick={function () {
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
                }}
              >
                {option.printing}
              </MUIMenuItem>
            ))
          }
        </MUIMenu>
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[6] }}>
        <a href={purchase_link}>
          <TCGPlayerLogo style={{ width: "100%" }} />
        </a>
      </div>
    </React.Fragment>
  );
}

function mapStateToProps (state, ownProps) {
  return {
    activeComponentId: state.active_component_id,
    activeComponentName: state.active_component_name,
    card: state.displayed_cards[ownProps.index],
    modules: state.cube.modules.map(module => ({ _id: module._id, name: module.name})),
    rotations: state.cube.rotations.map(rotation => ({ _id: rotation._id, name: rotation.name }))
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload)),
    dispatchMoveOrDeleteCard: (payload) => dispatch(actionCreators.move_or_delete_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AuthorizedCardRow));