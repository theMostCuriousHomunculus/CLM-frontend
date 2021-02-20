import React from 'react';
import { useParams } from 'react-router-dom';
// import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUITextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';

import ColorCheckboxes from './ColorCheckboxes';
import ErrorDialog from '../miscellaneous/ErrorDialog';
import WarningButton from '../miscellaneous/WarningButton';
import { actionCreators } from '../../store/actions/cube-actions';
import { AuthenticationContext } from '../../contexts/authentication-context';
import { editCard } from '../../requests/cube-requests';
import MoveDeleteMenu from './MoveDeleteMenu';

function EditCardModal (props) {

  const {
    activeComponentId,
    card,
    clear,
    creator,
    dispatchEditCard
  } = props;
  const authentication = React.useContext(AuthenticationContext);
  const cubeId = useParams().cubeId;
  const [errorMessage, setErrorMessage] = React.useState();

  async function submitCardChange (changes) {
    try {
      await editCard(changes, card._id, activeComponentId, cubeId, authentication.token);
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
              <img alt={card.name} src={card.image} height={300} />
              {card.back_image &&
                <img alt={card.name} src={card.back_image} height={300} />
              }
              <MUIDialogContentText>Color Identity:</MUIDialogContentText>
              <ColorCheckboxes
                color_identity={card.color_identity}
                card_id={card._id}
                submitCardChange={submitCardChange}
              />
              <MUITextField
                defaultValue={card.cmc}
                inputProps={{
                  max: 16,
                  min: 0,
                  onBlur: (event) => {
                    submitCardChange({ cmc: parseInt(event.target.value) });
                    dispatchEditCard({ cardId: card._id, cmc: parseInt(event.target.value) })
                  },
                  step: 1
                }}
                label="CMC"
                margin="dense"
                type="number"
                variant="outlined"
              />
              <MUITextField
                autoComplete="off"
                defaultValue={card.type_line}
                inputProps={{
                  onBlur: (event) => {
                    submitCardChange({ type_line: event.target.value });
                    dispatchEditCard({ cardId: card._id, type_line: event.target.value });
                  }
                }}
                label="Card Type"
                margin="dense"
                type="text"
                variant="outlined"
              />
              <MoveDeleteMenu
                cardId={card._id}
                listItemPrimaryText="Cube Component"
              />
              {/*<MUIDialogContentText>Bitches!</MUIDialogContentText>*/}
            </MUIDialogContent>
            <MUIDialogActions>
              <WarningButton onClick={clear}>Close</WarningButton>
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
    dispatchEditCard: (payload) => dispatch(actionCreators.edit_card(payload))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCardModal);