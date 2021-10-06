import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIGrid from '@mui/material/Grid';

import ChangePrintMenu from './ChangePrintMenu';
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

  const [destination, setDestination] = React.useState({ _id: activeComponentID, name: activeComponentName });
  const [printingDetails, setPrintingDetails] = React.useState({
    back_image: card.back_image,
    collector_number: card.collector_number,
    image: card.image,
    mtgo_id: card.mtgo_id,
    scryfall_id: card.scryfall_id,
    set: card.set,
    set_name: card.set_name,
    tcgplayer_id: card.tcgplayer_id
  });

  const submitForm = React.useCallback(async event => {
    event.preventDefault();

    if (
      JSON.stringify(printingDetails) !== JSON.stringify({
        back_image: card.back_image,
        collector_number: card.collector_number,
        image: card.image,
        mtgo_id: card.mtgo_id,
        scryfall_id: card.scryfall_id,
        set: card.set,
        set_name: card.set_name,
        tcgplayer_id: card.tcgplayer_id
      })
    ) {
      await editCard(`cardID: "${card._id}",\n${printingDetails.back_image ? 'back_image: "' + printingDetails.back_image + '",\n' : ''}collector_number: ${printingDetails.collector_number},\nimage: "${printingDetails.image}",\n${Number.isInteger(printingDetails.mtgo_id) ? 'mtgo_id: ' + printingDetails.mtgo_id + ',\n' : ''}scryfall_id: "${printingDetails.scryfall_id}",\nset: "${printingDetails.set}",\nset_name: "${printingDetails.set_name}"\n${printingDetails.tcgplayer_id ? 'tcgplayer_id: ' + printingDetails.tcgplayer_id : ''}`);
    }
    
    if (activeComponentID !== destination._id) {
      deleteCard(card._id, destination._id);
    }

    clear();

  }, [activeComponentID, card, clear, deleteCard, destination._id, editCard, printingDetails]);

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
            <MUIButton type="submit">
              Submit Changes
            </MUIButton>
            <WarningButton onClick={clear} type="button">Discard Changes</WarningButton>
          </MUIDialogActions>
        </form>
      }
    </MUIDialog>
  );
};