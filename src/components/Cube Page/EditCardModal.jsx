import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIGrid from '@mui/material/Grid';
import MUITextField from '@mui/material/TextField';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import MoveDeleteMenu from './MoveDeleteMenu';
import WarningButton from '../miscellaneous/WarningButton';
import { CubeContext } from '../../contexts/cube-context';

export default function EditCardModal({ card, clear, editable }) {
  const {
    activeComponentState: { _id: activeComponentID },
    deleteCard,
    editCard
  } = React.useContext(CubeContext);
  const [destination, setDestination] = React.useState(activeComponentID);
  const [mutableCardDetails, setMutableCardDetails] = React.useState({
    back_image: card.back_image,
    cmc: card.cmc,
    collector_number: card.collector_number,
    color_identity: card.color_identity,
    image: card.image,
    mtgo_id: card.mtgo_id,
    notes: card.notes,
    scryfall_id: card.scryfall_id,
    set: card.set,
    set_name: card.set_name,
    tcgplayer_id: card.tcgplayer_id,
    type_line: card.type_line
  });

  const submitForm = React.useCallback(
    async (event) => {
      event.preventDefault();

      if (
        JSON.stringify(mutableCardDetails) !==
        JSON.stringify({
          back_image: card.back_image,
          cmc: card.cmc,
          collector_number: card.collector_number,
          color_identity: card.color_identity,
          image: card.image,
          mtgo_id: card.mtgo_id,
          notes: card.notes,
          scryfall_id: card.scryfall_id,
          set: card.set,
          set_name: card.set_name,
          tcgplayer_id: card.tcgplayer_id,
          type_line: card.type_line
        })
      ) {
        await editCard(
          `cardID: "${card._id}",\n${
            mutableCardDetails.back_image
              ? 'back_image: "' + mutableCardDetails.back_image + '",\n'
              : ''
          }cmc: ${mutableCardDetails.cmc},\ncollector_number: ${
            mutableCardDetails.collector_number
          },\ncolor_identity: [${mutableCardDetails.color_identity.map(
            (ci) => '"' + ci + '"'
          )}],\nimage: "${mutableCardDetails.image}",\n${
            Number.isInteger(mutableCardDetails.mtgo_id)
              ? 'mtgo_id: ' + mutableCardDetails.mtgo_id + ',\n'
              : ''
          }notes: "${mutableCardDetails.notes}",\nscryfall_id: "${
            mutableCardDetails.scryfall_id
          }",\nset: "${mutableCardDetails.set}",\nset_name: "${
            mutableCardDetails.set_name
          }"\n${
            mutableCardDetails.tcgplayer_id
              ? 'tcgplayer_id: ' + mutableCardDetails.tcgplayer_id + ',\n'
              : ''
          }type_line: "${mutableCardDetails.type_line}"`
        );
      }

      if (activeComponentID !== destination) {
        deleteCard(card._id, destination);
      }

      clear();
    },
    [
      activeComponentID,
      card,
      clear,
      deleteCard,
      destination,
      editCard,
      mutableCardDetails
    ]
  );

  return (
    <MUIDialog onClose={clear} open={Object.keys(card).length > 0}>
      {Object.keys(card).length > 0 && (
        <form onSubmit={submitForm}>
          <MUIDialogTitle>{editable ? 'Edit Card' : card.name}</MUIDialogTitle>
          <MUIDialogContent>
            <MUIGrid container={true} spacing={1}>
              <MUIGrid
                container={!!card.back_image}
                item={true}
                xs={12}
                md={6}
                style={{
                  alignSelf: 'center',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <img
                  alt={card.name}
                  src={mutableCardDetails.image}
                  height={264}
                />
                {card.back_image && (
                  <img
                    alt={card.name}
                    src={mutableCardDetails.back_image}
                    height={264}
                  />
                )}
              </MUIGrid>
              <MUIGrid item={true} xs={12} md={6}>
                <MoveDeleteMenu
                  destination={destination}
                  editable={editable}
                  setDestination={setDestination}
                />

                <ColorCheckboxes
                  colorIdentity={mutableCardDetails.color_identity}
                  handleColorIdentityChange={(colors) =>
                    setMutableCardDetails((prevState) => ({
                      back_image: prevState.back_image,
                      cmc: prevState.cmc,
                      collector_number: prevState.collector_number,
                      color_identity: colors,
                      image: prevState.image,
                      mtgo_id: prevState.mtgo_id,
                      notes: prevState.notes,
                      scryfall_id: prevState.scryfall_id,
                      set: prevState.set,
                      set_name: prevState.set_name,
                      tcgplayer_id: prevState.tcgplayer_id,
                      type_line: prevState.type_line
                    }))
                  }
                />

                <ChangePrintMenu
                  card={card}
                  handlePrintingChange={(pd) =>
                    setMutableCardDetails((prevState) => ({
                      back_image: pd.back_image,
                      cmc: prevState.cmc,
                      collector_number: pd.collector_number,
                      color_identity: prevState.color_identity,
                      image: pd.image,
                      mtgo_id: pd.mtgo_id,
                      notes: prevState.notes,
                      scryfall_id: pd.scryfall_id,
                      set: pd.set,
                      set_name: pd.set_name,
                      tcgplayer_id: pd.tcgplayer_id,
                      type_line: prevState.type_line
                    }))
                  }
                />
              </MUIGrid>
            </MUIGrid>

            <MUITextField
              disabled={!editable}
              fullWidth
              label="Notes..."
              minRows={4}
              multiline
              onChange={(event) =>
                setMutableCardDetails((prevState) => ({
                  ...prevState,
                  notes: event.target.value
                }))
              }
              style={{ marginTop: 16 }}
              value={mutableCardDetails.notes}
            />
          </MUIDialogContent>
          {editable && (
            <MUIDialogActions>
              <MUIButton type="submit">Submit Changes</MUIButton>
              <WarningButton onClick={clear} type="button">
                Discard Changes
              </WarningButton>
            </MUIDialogActions>
          )}
        </form>
      )}
    </MUIDialog>
  );
}
