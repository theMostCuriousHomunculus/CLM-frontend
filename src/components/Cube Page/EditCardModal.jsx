import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIDialog from '@material-ui/core/Dialog';
import MUIDialogActions from '@material-ui/core/DialogActions';
import MUIDialogContent from '@material-ui/core/DialogContent';
import MUIDialogContentText from '@material-ui/core/DialogContentText';
import MUIDialogTitle from '@material-ui/core/DialogTitle';
import MUIGrid from '@material-ui/core/Grid';
import MUITextField from '@material-ui/core/TextField';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import WarningButton from '../miscellaneous/WarningButton';
import MoveDeleteMenu from './MoveDeleteMenu';

export default function EditCardModal ({
  activeComponentID,
  activeComponentName,
  card,
  clear,
  deleteCard,
  editable,
  editCard,
  modules,
  rotations
}) {

  const cmcInput = React.useRef();
  const typeInput = React.useRef();
  const [colorIdentity, setColorIdentity] = React.useState([...card.color_identity]);
  const [destination, setDestination] = React.useState({ _id: activeComponentID, name: activeComponentName });
  const [printingDetails, setPrintingDetails] = React.useState({
    back_image: card.back_image,
    image: card.image,
    mtgo_id: card.mtgo_id,
    printing: card.printing,
    purchase_link: card.purchase_link
  });

  const submitForm = React.useCallback(async event => {
    event.preventDefault();

    if (
      card.cmc !== parseInt(cmcInput.current.value) ||
      card.color_identity.toString() !== colorIdentity.toString() ||
      card.type_line !== typeInput.current.value ||
      JSON.stringify(printingDetails) !== JSON.stringify({
        back_image: card.back_image,
        image: card.image,
        mtgo_id: card.mtgo_id,
        printing: card.printing,
        purchase_link: card.purchase_link
      })
    ) {
      await editCard(`cardID: "${card._id}",\n${printingDetails.back_image ? 'back_image: "' + printingDetails.back_image + '",\n' : ''}cmc: ${parseInt(cmcInput.current.value)},\ncolor_identity: [${colorIdentity.map(ci => '"' + ci + '"')}],\nimage: "${printingDetails.image}",\n${Number.isInteger(printingDetails.mtgo_id) ? 'mtgo_id: ' + printingDetails.mtgo_id + ',\n' : ''}printing: "${printingDetails.printing}",\npurchase_link: "${printingDetails.purchase_link}"\ntype_line: "${typeInput.current.value}"`);
    }
    
    if (activeComponentID !== destination._id) {
      deleteCard(card._id, destination._id);
    }

    clear();

  }, [activeComponentID, card, clear, colorIdentity, deleteCard, destination._id, editCard, printingDetails]);

  return (
    <MUIDialog
      onClose={clear}
      open={Object.keys(card).length > 0}
    >
      {Object.keys(card).length > 0 &&
        <form onSubmit={submitForm}>
          <MUIDialogTitle>{editable ? "Edit Card" : card.name}</MUIDialogTitle>
          <MUIDialogContent>
            <MUIGrid container={true} spacing={1}>
              <MUIGrid item={true} xs={12} md={6} style={{ alignSelf: 'center', display: 'flex', justifyContent: 'center' }}>
                <img alt={card.name} src={card.image} height={264} style={{ borderRadius: 4 }} />
                {card.back_image &&
                  <img alt={card.name} src={card.back_image} height={264} style={{ borderRadius: 4 }} />
                }
              </MUIGrid>
              <MUIGrid item={true} xs={12} md={6}>
                <MUIDialogContentText>Color Identity:</MUIDialogContentText>
                <ColorCheckboxes
                  colorIdentity={colorIdentity}
                  handleColorIdentityChange={ci => setColorIdentity([...ci])}
                />
                <MUITextField
                  defaultValue={card.cmc}
                  inputProps={{
                    max: 16,
                    min: 0,
                    step: 1
                  }}
                  inputRef={cmcInput}
                  label="CMC"
                  margin="dense"
                  type="number"
                  variant="outlined"
                />
                <MUITextField
                  autoComplete="off"
                  defaultValue={card.type_line}
                  fullWidth
                  inputRef={typeInput}
                  label="Card Type"
                  margin="dense"
                  type="text"
                  variant="outlined"
                />
                <MoveDeleteMenu
                  destination={destination}
                  listItemPrimaryText="Cube Component"
                  modules={modules}
                  rotations={rotations}
                  setDestination={setDestination}
                />
                <ChangePrintMenu
                  card={card}
                  handlePrintingChange={pd => setPrintingDetails({ ...pd })}
                />
              </MUIGrid>
            </MUIGrid>
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton
              color="primary"
              size="small"
              type="submit"
              variant="contained"
            >
              Submit Changes
            </MUIButton>
            <WarningButton onClick={clear} type="button">Discard Changes</WarningButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};