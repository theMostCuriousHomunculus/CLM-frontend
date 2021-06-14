import React from 'react';
import { useParams } from 'react-router-dom';
import MUITextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import ErrorDialog from '../miscellaneous/ErrorDialog';
import MoveDeleteMenu from './MoveDeleteMenu';
import { actionCreators } from '../../redux-store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { deleteCard } from '../../requests/REST/cube-requests';
import { ReactComponent as TCGPlayerLogo } from '../../svgs/tcgplayer-logo-full-color.svg';


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
    showPreview,
    submitCardChange
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const cubeId = useParams().cubeId;
  const [errorMessage, setErrorMessage] = React.useState();

  async function moveDeleteCard (destination) {
    try {
      await deleteCard(_id, activeComponentId, cubeId, authentication.token, destination);
      dispatchMoveOrDeleteCard({ cardId: _id, destination });
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

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
          handleColorIdentityChange={(details) => {
            submitCardChange(_id, details);
            dispatchEditCard({ cardId: _id, ...details });
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
          handleMoveDelete={(destination) => moveDeleteCard(destination)}
        />
      </div>
      <div className={classes.tableCell} style={{ width: columnWidths[5] }}>
        <ChangePrintMenu
          handlePrintingChange={(details) => {
            submitCardChange(_id, details);
            dispatchEditCard({ cardId: _id, ...details });
          }}
          hidePreview={hidePreview}
          oracle_id={oracle_id}
          printing={printing}
          showPreview={showPreview}
        />
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
    activeComponentId: state.active_component_id,
    card: state.displayed_cards[ownProps.index]
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload)),
    dispatchMoveOrDeleteCard: (payload) => dispatch(actionCreators.move_or_delete_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(AuthorizedCardRow));