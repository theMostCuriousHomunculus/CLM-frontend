import React from 'react';
import MUITextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import MoveDeleteMenu from './MoveDeleteMenu';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { ReactComponent as TCGPlayerLogo } from '../../svgs/tcgplayer-logo-full-color.svg';


const useStyles = makeStyles({
  tableCell: {
    alignItems: "center",
    display: "flex",
    padding: "0 8px"
  }
});

export default function AuthorizedCardRow ({
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
  columnWidths
}) {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();

  async function moveDeleteCard (destination) {

  }

  return (
    <React.Fragment>

      <div
        back_image={back_image}
        className={classes.tableCell}
        image={image}
        style={{ cursor: "default", width: columnWidths[0] }}
      >
        {name}
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[1] }}>
        <ColorCheckboxes
          color_identity={color_identity}
          handleColorIdentityChange={(details) => {

          }}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[2] }}>
        <MUITextField
          defaultValue={cmc}
          inputProps={{
            max: 16,
            min: 0,
            onBlur: (event) => {

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

            }
          }}
          margin="dense"
          type="text"
          variant="outlined"
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[4] }}>
        <MoveDeleteMenu
          handleMoveDelete={(destination) => moveDeleteCard(destination)}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[5] }}>
        <ChangePrintMenu
          handlePrintingChange={(details) => {

          }}
          oracle_id={oracle_id}
          printing={printing}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[6] }}>
        <a href={purchase_link}>
          <TCGPlayerLogo style={{ width: "75%" }} />
        </a>
      </div>
    </React.Fragment>
  );
};