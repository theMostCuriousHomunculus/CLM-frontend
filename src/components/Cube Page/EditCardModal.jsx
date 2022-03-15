import React, { useContext, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIGrid from '@mui/material/Grid';
import MUIPublishedWithChangesOutlinedIcon from '@mui/icons-material/PublishedWithChangesOutlined';
import MUITextField from '@mui/material/TextField';
import { useParams } from 'react-router-dom';

import editCard from '../../graphql/mutations/cube/edit-card';
// import ChangePrintMenu from './ChangePrintMenu';
import ColorCheckboxes from './ColorCheckboxes';
import MoveDeleteMenu from './MoveDeleteMenu';
import { CubeContext } from '../../contexts/cube-context';

export default function EditCardModal({ card, clear, editable }) {
  const {
    activeComponentState: { _id: activeComponentID },
    deleteCard
  } = useContext(CubeContext);
  const { cubeID } = useParams();
  const [destination, setDestination] = useState(activeComponentID);
  const [mutableCardDetails, setMutableCardDetails] = useState({
    cmc: Number.isInteger(card.cmc) ? card.cmc : card.scryfall_card.cmc,
    color_identity: card.color_identity ? card.color_identity : card.scryfall_card.color_identity,
    notes: card.notes,
    scryfall_id: card.scryfall_card._id,
    type_line: card.type_line ? card.type_line : card.scryfall_card.type_line
  });

  async function submitForm(event) {
    event.preventDefault();

    if (
      JSON.stringify(mutableCardDetails) !==
      JSON.stringify({
        cmc: Number.isInteger(card.cmc) ? card.cmc : card.scryfall_card.cmc,
        color_identity: card.color_identity
          ? card.color_identity
          : card.scryfall_card.color_identity,
        notes: card.notes,
        scryfall_id: card.scryfall_card._id,
        type_line: card.type_line ? card.type_line : card.scryfall_card.type_line
      })
    ) {
      editCard({
        headers: { CubeID: cubeID },
        variables: {
          cardID: card._id,
          componentID: activeComponentID,
          ...mutableCardDetails
        }
      });
    }

    if (activeComponentID !== destination) {
      deleteCard(card._id, destination);
    }

    clear();
  }

  return (
    <MUIDialog onClose={clear} open={Object.keys(card).length > 0}>
      {Object.keys(card).length > 0 && (
        <form onSubmit={submitForm}>
          <MUIDialogTitle>
            {editable ? 'Edit Card' : card.name ? card.name : card.scryfall_card.name}
          </MUIDialogTitle>
          <MUIDialogContent>
            <MUIGrid container={true} spacing={1}>
              <MUIGrid
                container={!card.scryfall_card.image_uris}
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
                  alt={
                    card.scryfall_card.image_uris
                      ? card.scryfall_card.name
                      : card.scryfall_card.card_faces[0].name
                  }
                  src={
                    card.scryfall_card.image_uris
                      ? card.scryfall_card.image_uris.large
                      : card.scryfall_card.card_faces[0].image_uris.large
                  }
                  height={264}
                />
                {!card.scryfall_card.image_uris && (
                  <img
                    alt={card.scryfall_card.card_faces[1].name}
                    src={card.scryfall_card.card_faces[1].image_uris.large}
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
                      cmc: prevState.cmc,
                      color_identity: colors,
                      notes: prevState.notes,
                      scryfall_id: prevState.scryfall_id,
                      type_line: prevState.type_line
                    }))
                  }
                />

                {/* <ChangePrintMenu
                  card={card}
                  handlePrintingChange={(pd) =>
                    setMutableCardDetails((prevState) => ({
                      ...prevState,
                      scryfall_id: pd.scryfall_id
                    }))
                  }
                /> */}
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
              <MUIButton type="submit" startIcon={<MUIPublishedWithChangesOutlinedIcon />}>
                Submit Changes
              </MUIButton>
              <MUIButton color="warning" onClick={clear} startIcon={<MUICancelOutlinedIcon />}>
                Discard Changes
              </MUIButton>
            </MUIDialogActions>
          )}
        </form>
      )}
    </MUIDialog>
  );
}
