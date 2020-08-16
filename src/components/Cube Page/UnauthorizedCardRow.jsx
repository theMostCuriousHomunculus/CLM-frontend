import React from 'react';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import { monoColors, multiColors } from '../../constants/color-objects';
import { ReactComponent as TCGPlayerLogo } from '../../images/tcgplayer-logo-full-color.svg';

const useStyles = makeStyles({
  tableCell: {
    height: '100%',
    paddingBottom: 4,
    paddingTop: 4
  }
});

const UnauthorizedCardRow = (props) => {

  const {
    card: {
      _id,
      back_image,
      cmc,
      color_identity,
      image,
      name,
      printing,
      purchase_link,
      type_line
    }
  } = props;
  const classes = useStyles();

  return (
    <MUITableRow key={_id}>
      <MUITableCell
        back_image={back_image}
        className={classes.tableCell}
        image={image}
        onMouseOut={props.hidePreview}
        onMouseOver={props.showPreview}
        style={{ cursor: 'default' }}
      >
        {name}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        {[...monoColors, ...multiColors].find(function(color) {
          return color.color_identity === color_identity.toString();
        }).name}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        {cmc}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        {type_line}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        {printing}
      </MUITableCell>
      <MUITableCell className={classes.tableCell}>
        <a href={purchase_link}>
          <TCGPlayerLogo />
        </a>
      </MUITableCell>
    </MUITableRow>
  );
}

export default UnauthorizedCardRow;