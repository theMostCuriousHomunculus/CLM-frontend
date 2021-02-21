import React from 'react';
import { useParams } from 'react-router-dom';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIGrid from '@material-ui/core/Grid';
import MUITextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import ErrorDialog from '../miscellaneous/ErrorDialog';
import WarningButton from '../miscellaneous/WarningButton';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { deleteCard, editCard } from '../../requests/cube-requests';
import MoveDeleteMenu from './MoveDeleteMenu';

function EditCardModal (props) {

  const {
    activeComponentId,
    card,
    clear,
    creator,
    dispatchEditCard,
    dispatchMoveOrDeleteCard,
    hidePreview,
    showPreview
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const [cardType, setCardType] = React.useState();
  const [cmc, setCmc] = React.useState();
  const [colorIdentity, setColorIdentity] = React.useState([]);
  const [cubeComponent, setCubeComponent] = React.useState();
  const cubeId = useParams().cubeId;
  const [errorMessage, setErrorMessage] = React.useState();
  const [printingDetails, setPrintingDetails] = React.useState({
    back_image: null,
    image: null,
    mtgo_id: null,
    printing: null,
    purchase_link: null
  });

  React.useEffect(() => {
    setCardType(card.type_line);
    setCmc(card.cmc);
    setColorIdentity(card.color_identity);
    setCubeComponent(activeComponentId);
    setPrintingDetails({
      back_image: card.back_image,
      image: card.image,
      mtgo_id: card.mtgo_id,
      printing: card.printing,
      purchase_link: card.purchase_link
    });
  }, [activeComponentId, card]);

  async function submitChanges () {
    try {
      const changes = {
        cmc,
        color_identity: colorIdentity,
        type_line: cardType,
        ...printingDetails
      };
      await editCard(changes, card._id, activeComponentId, cubeId, authentication.token);
      dispatchEditCard({ cardId: card._id, ...changes });

      if (cubeComponent !== activeComponentId) {
        await deleteCard(card._id, activeComponentId, cubeId, authentication.token, cubeComponent);
        dispatchMoveOrDeleteCard({ cardId: card._id, destination: cubeComponent });
      }

      clear();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <React.Fragment>

      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <MUIDialog
        onClose={clear}
        open={Object.keys(card).length > 0}
      >
        {Object.keys(card).length > 0 &&
          <React.Fragment>
            <MUIDialogTitle>{creator._id === authentication.userId ? "Edit Card" : card.name}</MUIDialogTitle>
            <MUIDialogContent>
              <MUIGrid container={true} spacing={1}>
                <MUIGrid item={true} xs={12} md={6} style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center' }}>
                  <img alt={card.name} src={printingDetails.image} height={300} style={{ borderRadius: 4 }} />
                  {printingDetails.back_image &&
                    <img alt={card.name} src={printingDetails.back_image} height={300} style={{ borderRadius: 4 }} />
                  }
                </MUIGrid>
                <MUIGrid item={true} xs={12} md={6}>
                  <MUIDialogContentText>Color Identity:</MUIDialogContentText>
                  <ColorCheckboxes
                    color_identity={colorIdentity}
                    handleColorIdentityChange={(details) => setColorIdentity(details.color_identity)}
                  />
                  <MUITextField
                    inputProps={{
                      max: 16,
                      min: 0,
                      step: 1
                    }}
                    label="CMC"
                    margin="dense"
                    onChange={(event) => setCmc(event.target.value)}
                    type="number"
                    value={cmc}
                    variant="outlined"
                  />
                  <MUITextField
                    autoComplete="off"
                    fullWidth
                    label="Card Type"
                    margin="dense"
                    onChange={(event) => setCardType(event.target.value)}
                    type="text"
                    value={cardType}
                    variant="outlined"
                  />
                  <MoveDeleteMenu
                    handleMoveDelete={(details) => setCubeComponent(details)}
                    listItemPrimaryText="Cube Component"
                  />
                  <ChangePrintMenu
                    handlePrintingChange={(details) => setPrintingDetails(details)}
                    hidePreview={hidePreview}
                    listItemPrimaryText="Printing"
                    oracle_id={card.oracle_id}
                    printing={printingDetails.printing}
                    showPreview={showPreview}
                  />
                </MUIGrid>
              </MUIGrid>
            </MUIDialogContent>
            <MUIDialogActions style={{ justifyContent: 'space-between' }}>
              <WarningButton onClick={clear}>Close</WarningButton>
              <MUIButton
                color="primary"
                onClick={submitChanges}
                size="small"
                variant="contained"
              >
                Submit
              </MUIButton>
            </MUIDialogActions>
          </React.Fragment>
        }
      </MUIDialog>

    </React.Fragment>
  );
}

function mapStateToProps (state) {
  return {
    activeComponentId: state.active_component_id,
    creator: state.cube.creator
  };
}

function mapDispatchToProps (dispatch) {
  return {
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload)),
    dispatchMoveOrDeleteCard: (payload) => dispatch(actionCreators.move_or_delete_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCardModal);