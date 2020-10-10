import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { monoColors, multiColors } from '../../constants/color-objects';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';

const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    height: 96,
    padding: "0 8px"
  }
});

const UnauthorizedCardRow = (props) => {

  const {
    card: {
      back_image,
      cmc,
      color_identity,
      image,
      name,
      printing,
      purchase_link,
      type_line
    },
    columnWidths,
    hidePreview,
    showPreview
  } = props;
  const classes = useStyles();

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
        {[...monoColors, ...multiColors].find(function(color) {
          return color.color_identity === color_identity.toString();
        }).name}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[2] }}>
        {cmc}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[3] }}>
        {type_line}
      </div>
      {/*not displaying column at index 4 since user is not the cube creator*/}
      <div className={classes.tableCell} style={{ width: columnWidths[5] }}>
        {printing}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[6] }}>
        <a href={purchase_link}>
          <TCGPlayerLogo style={{ width: "100%" }} />
        </a>
      </div>
    </React.Fragment>
  );
}

export default UnauthorizedCardRow;