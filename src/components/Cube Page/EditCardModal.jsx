import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIGrid from '@mui/material/Grid';
import MUIPublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import MUITextField from '@mui/material/TextField';

import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import MoveDeleteMenu from './MoveDeleteMenu';
import { CubeContext } from '../../contexts/cube-context';

export default function EditCardModal({ card, clear, editable }) {
  const {
    activeComponentState: { _id: activeComponentID },
    deleteCard,
    editCard
  } = React.useContext(CubeContext);
  const [destination, setDestination] = React.useState(activeComponentID);
  const [mutableCardDetails, setMutableCardDetails] = React.useState({
    cmc: card.cmc,
    color_identity: card.color_identity,
    notes: card.notes,
    scryfall_id: card.scryfall_id,
    type_line: card.type_line
  });

  const submitForm = React.useCallback(
    async (event) => {
      event.preventDefault();

      if (
        JSON.stringify(mutableCardDetails) !==
        JSON.stringify({
          cmc: card.cmc,
          color_identity: card.color_identity,
          notes: card.notes,
          scryfall_id: card.scryfall_id,
          type_line: card.type_line
        })
      ) {
        await editCard(
          `cardID: "${card._id}",\ncmc: ${
            mutableCardDetails.cmc
          },\ncolor_identity: [${mutableCardDetails.color_identity.map(
            (ci) => '"' + ci + '"'
          )}],\nnotes: "${mutableCardDetails.notes}",\nscryfall_id: "${
            mutableCardDetails.scryfall_id
          }",\ntype_line: "${mutableCardDetails.type_line}"`
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
                <img alt={card.name} src={card.image} height={264} />
                {card.back_image && (
                  <img alt={card.name} src={card.back_image} height={264} />
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
                      cmc: prevState.cmc,
                      color_identity: colors,
                      notes: prevState.notes,
                      scryfall_id: prevState.scryfall_id,
                      type_line: prevState.type_line
                    }))
                  }
                />

                <ChangePrintMenu
                  card={card}
                  handlePrintingChange={(pd) =>
                    setMutableCardDetails((prevState) => ({
                      ...prevState,
                      scryfall_id: pd.scryfall_id
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
              value={mutableCardDetails.notes}
            />
          </MUIDialogContent>
          {editable && (
            <MUIDialogActions>
              <MUIButton
                type="submit"
                startIcon={<MUIPublishedWithChangesOutlinedIcon />}
              >
                Submit Changes
              </MUIButton>
              <MUIButton
                color="warning"
                onClick={clear}
                startIcon={<MUICancelOutlinedIcon />}
              >
                Discard Changes
              </MUIButton>
            </MUIDialogActions>
          )}
        </form>
      )}
    </MUIDialog>
  );
}
