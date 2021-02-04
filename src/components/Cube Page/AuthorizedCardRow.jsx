import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import ColorCheckboxes from './ColorCheckboxes';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';
import { useCube } from '../../hooks/cube-hook';

const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    padding: "0 8px"
  }
});

const AuthorizedCardRow = (props) => {

  const {
    activeMenu,
    anchorEl,
    availablePrintings,
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
    enablePrintChange,
    hidePreview,
    loading,
    moveDeleteCard,
    selectedPrintIndex,
    setActiveMenu,
    setAnchorEl,
    showPreview,
    submitCardChange
  } = props;
  const classes = useStyles();
  const cubeState = useCube(true)[0];

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
          inputProps={{ max: 16, min: 0, step: 1 }}
          margin="dense"
          onBlur={(event) => submitCardChange(_id, { cmc: event.target.value })}
          type="number"
          variant="outlined"
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[3] }}>
        <MUITextField
          autoComplete="off"
          defaultValue={type_line}
          margin="dense"
          onBlur={(event) => submitCardChange(_id, { type_line: event.target.value })}
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
              setActiveMenu({ card_id: _id, menu: 'component' });
              setAnchorEl(event.currentTarget);
            }}
          >
            <MUIListItemText
              // primary="Move to"
              secondary={cubeState.active_component_name}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          anchorEl={anchorEl}
          keepMounted
          open={activeMenu.card_id === _id && activeMenu.menu === 'component'}
          onClose={function () {
            setActiveMenu({ card_id: null, menu: null });
            setAnchorEl(null);
          }}
        >
          {[{ name: 'Mainboard', _id: 'mainboard' },
            { name: 'Sideboard', _id: 'sideboard' },
            ...cubeState.cube.modules.map(function (module) {
              return { name: module.name, _id: module._id };
            }),
            ...cubeState.cube.rotations.map(function (rotation) {
              return { name: rotation.name, _id: rotation._id };
            })].map((component) => (
              <MUIMenuItem
                key={`${_id}-${component._id}`}
                onClick={function () {
                  moveDeleteCard(_id, component._id);
                }}
                selected={component.active_component_id === component._id}
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
            onClick={function (event) {
              enablePrintChange(_id, event, oracle_id, printing);
            }}
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
          open={activeMenu.card_id === _id && activeMenu.menu === 'print'}
          onClose={function () {
            setActiveMenu({ card_id: null, menu: null });
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
                  setActiveMenu({ card_id: null, menu: null });
                  setAnchorEl(null);
                  submitCardChange(_id, {
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

export default React.memo(AuthorizedCardRow);