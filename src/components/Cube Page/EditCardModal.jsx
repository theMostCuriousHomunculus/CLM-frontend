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
  card,
  clear,
  editable,
  editCard
}) {

  return (
    <MUIDialog
      onClose={clear}
      open={Object.keys(card).length > 0}
    >
      {Object.keys(card).length > 0 &&
        <React.Fragment>
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
                  color_identity={card.color_identity}
                  handleColorIdentityChange={/*(details) => setColorIdentity(details.color_identity)*/() => null}
                />
                <MUITextField
                  defaultValue={card.cmc}
                  inputProps={{
                    max: 16,
                    min: 0,
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
                  fullWidth
                  label="Card Type"
                  margin="dense"
                  type="text"
                  variant="outlined"
                />
                <MoveDeleteMenu
                  handleMoveDelete={(details) => /*setCubeComponent(details)*/() => null}
                  listItemPrimaryText="Cube Component"
                />
                <ChangePrintMenu
                  handlePrintingChange={(details) => /*setPrintingDetails(details)*/() => null}
                  listItemPrimaryText="Printing"
                  oracle_id={card.oracle_id}
                  printing={card.printing}
                />
              </MUIGrid>
            </MUIGrid>
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton
              color="primary"
              onClick={() => null}
              size="small"
              variant="contained"
            >
              Submit Changes
            </MUIButton>
            <WarningButton onClick={clear}>Discard Changes</WarningButton>
          </MUIDialogActions>
        </React.Fragment>
      }
    </MUIDialog>
  );
};