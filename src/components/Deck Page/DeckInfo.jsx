import React, { useContext, useEffect, useState } from 'react';
import MUIButton from '@mui/material/Button';
import MUICard from '@mui/material/Card';
import MUICardActions from '@mui/material/CardActions';
import MUICardContent from '@mui/material/CardContent';
import MUICardHeader from '@mui/material/CardHeader';
import MUICheckbox from '@mui/material/Checkbox';
import MUIDeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIFileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import MUIFormControl from '@mui/material/FormControl';
import MUIFormControlLabel from '@mui/material/FormControlLabel';
import MUIHelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MUIImageList from '@mui/material/ImageList';
import MUIImageListItem from '@mui/material/ImageListItem';
import MUIInputLabel from '@mui/material/InputLabel';
import MUISelect from '@mui/material/Select';
import MUIShuffleOutlinedIcon from '@mui/icons-material/ShuffleOutlined';
import MUITextField from '@mui/material/TextField';
import MUITooltip from '@mui/material/Tooltip';
import MUITypography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';

import DeleteDeckForm from '../../forms/DeleteDeckForm';
import ScryfallRequest from '../miscellaneous/ScryfallRequest';
import formats from '../../constants/formats';
import generateCSVList from '../../functions/generate-csv-list';
import randomSampleWOReplacement from '../../functions/random-sample-wo-replacement';
import theme from '../../theme';
import { AuthenticationContext } from '../../contexts/Authentication';
import { DeckContext } from '../../contexts/deck-context';

export default function DeckInfo() {
  const { isLoggedIn, userID } = useContext(AuthenticationContext);
  const {
    deckState: {
      _id: deckID,
      cards,
      creator,
      description,
      format,
      image,
      name: deckName,
      published
    },
    cloneDeck,
    editDeck,
    warnings
  } = useContext(DeckContext);
  const [descriptionInput, setDescriptionInput] = useState(description);
  const [isPublished, setIsPublished] = useState(published);
  const [deckNameInput, setDeckNameInput] = useState(deckName);
  const [deckToDelete, setDeckToDelete] = useState({ _id: null, name: null });
  const [sampleHand, setSampleHand] = useState([]);
  const deckImageWidth = useMediaQuery(theme.breakpoints.up('md')) ? 150 : 75;

  function generateSampleHand() {
    setSampleHand(
      randomSampleWOReplacement(
        cards.reduce((previousValue, currentValue) => {
          for (let index = 0; index < currentValue.mainboard_count; index++) {
            previousValue.push({ ...currentValue.scryfall_card });
          }
        }, []),
        7
      )
    );
  }

  useEffect(() => {
    setDeckNameInput(deckName);
  }, [deckName]);

  useEffect(() => {
    setDescriptionInput(description);
  }, [description]);

  useEffect(() => {
    setIsPublished(published);
  }, [published]);

  return (
    <React.Fragment>
      <DeleteDeckForm deckToDelete={deckToDelete} setDeckToDelete={setDeckToDelete} />

      {
        <MUIDialog onClose={() => setSampleHand([])} open={sampleHand.length > 0}>
          <MUIDialogTitle>Sample Hand from {deckName}</MUIDialogTitle>
          <MUIDialogContent>
            <MUIImageList cols={2} rowHeight={264} sx={{ width: 382 }}>
              {sampleHand.map((card) => (
                <MUIImageListItem key={card._id}>
                  <img
                    alt={card.name}
                    src={
                      card.image_uris ? card.image_uris.large : card.card_faces[0].image_uris.large
                    }
                    style={{ height: 264, width: 189 }}
                  />
                </MUIImageListItem>
              ))}
            </MUIImageList>
          </MUIDialogContent>
          <MUIDialogActions>
            <MUIButton onClick={generateSampleHand}>New Sample Hand</MUIButton>
          </MUIDialogActions>
        </MUIDialog>
      }

      <MUICard>
        <MUICardHeader
          action={
            <MUIFormControl variant="outlined">
              <MUIInputLabel htmlFor="format-selector">Format</MUIInputLabel>
              <MUISelect
                disabled={creator._id !== userID}
                fullWidth
                label="Format"
                native
                onChange={(event) => {
                  editDeck({
                    description: descriptionInput,
                    format: event.target.value,
                    image: image._id,
                    name: deckNameInput,
                    published: isPublished
                  });
                }}
                value={format}
                inputProps={{
                  id: 'format-selector'
                }}
              >
                {formats.map((frmt) => (
                  <option key={frmt} value={frmt}>
                    {frmt}
                  </option>
                ))}
              </MUISelect>
            </MUIFormControl>
          }
          avatar={
            image && (
              <img
                alt={image.image_uris ? image.name : image.card_faces[0].name}
                src={image.image_uris?.art_crop ?? image.card_faces[0].image_uris.art_crop}
                style={{ borderRadius: 4 }}
                width={deckImageWidth}
              />
            )
          }
          title={
            <React.Fragment>
              <MUITextField
                disabled={creator._id !== userID}
                inputProps={{
                  onBlur: () => {
                    editDeck({
                      description: descriptionInput,
                      format,
                      image: image._id,
                      name: deckNameInput,
                      published: isPublished
                    });
                  }
                }}
                label="Deck Name"
                onChange={(event) => setDeckNameInput(event.target.value)}
                type="text"
                value={deckNameInput}
              />
              {creator._id === userID && (
                <div
                  style={{
                    alignItems: 'center',
                    display: 'flex'
                  }}
                >
                  <MUIFormControlLabel
                    control={
                      <MUICheckbox
                        checked={isPublished}
                        onChange={() => {
                          editDeck({
                            description: descriptionInput,
                            format,
                            image: image._id,
                            name: deckNameInput,
                            published: !isPublished
                          });
                          setIsPublished((prevState) => !prevState);
                        }}
                      />
                    }
                    label="Published"
                    style={{ marginRight: 8 }}
                  />
                  <MUITooltip title="A published deck is visible to other users.">
                    <MUIHelpOutlineIcon color="primary" />
                  </MUITooltip>
                </div>
              )}
            </React.Fragment>
          }
          subheader={
            <React.Fragment>
              <MUITypography color="textSecondary" variant="subtitle1">
                Designed by: <Link to={`/account/${creator._id}`}>{creator.name}</Link>
              </MUITypography>
              <MUITypography variant="subtitle1">
                <CSVLink data={generateCSVList(cards)} filename={`${deckName}.csv`} target="_blank">
                  Export to CSV
                </CSVLink>
              </MUITypography>
            </React.Fragment>
          }
        />

        <MUICardContent>
          <MUITextField
            disabled={creator._id !== userID}
            fullWidth={true}
            inputProps={{
              onBlur: () => {
                editDeck({
                  description: descriptionInput,
                  format,
                  image: image._id,
                  name: deckNameInput,
                  published: isPublished
                });
              }
            }}
            label="Deck Description"
            multiline
            onChange={(event) => setDescriptionInput(event.target.value)}
            rows={2}
            style={{ marginBottom: 8 }}
            value={descriptionInput}
          />

          {creator._id === userID && (
            <ScryfallRequest
              buttonText="Change Image"
              labelText="Deck Image"
              onSubmit={(chosenCard) => {
                editDeck({
                  description: descriptionInput,
                  format,
                  image: chosenCard._id,
                  name: deckNameInput,
                  published: isPublished
                });
              }}
            />
          )}

          {/* <div
            style={{
              backgroundColor: theme.palette.secondary.main,
              // borderRadius: 4,
              color: 'white',
              margin: '8px -8px',
              padding: '0 8px'
            }}
          >
            {warnings.map((warning) => (
              <MUITypography key={warning} variant="body1">
                {warning}
              </MUITypography>
            ))}
            </div> */}
        </MUICardContent>

        <MUICardActions
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end'
          }}
        >
          {creator._id === userID && (
            <span style={{ flexGrow: 1 }}>
              <MUIButton
                color="warning"
                onClick={() => {
                  setDeckToDelete({ _id: deckID, name: deckName });
                }}
                startIcon={<MUIDeleteForeverOutlinedIcon />}
              >
                Delete Deck
              </MUIButton>
            </span>
          )}
          {isLoggedIn && (
            <MUIButton onClick={cloneDeck} startIcon={<MUIFileCopyOutlinedIcon />}>
              Clone Deck
            </MUIButton>
          )}

          <MUIButton onClick={generateSampleHand} startIcon={<MUIShuffleOutlinedIcon />}>
            Sample Hand
          </MUIButton>
        </MUICardActions>
      </MUICard>
    </React.Fragment>
  );
}
