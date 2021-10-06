import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIDialog from '@mui/material/Dialog';
import MUIDialogActions from '@mui/material/DialogActions';
import MUIDialogContent from '@mui/material/DialogContent';
import MUIDialogTitle from '@mui/material/DialogTitle';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';
import { Autocomplete as MUIAutocomplete } from '@mui/lab';

import useRequest from '../../hooks/request-hook';
import HoverPreview from '../miscellaneous/HoverPreview';
import { MatchContext } from '../../contexts/match-context';

export default function ScryfallTokenSearch ({ closeDialog, openDialog }) {

  const cardSearchInput = React.useRef();
  const { loading, sendRequest } = useRequest();
  const { createTokens } = React.useContext(MatchContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [cardSearchResults, setCardSearchResults] = React.useState([]);
  const [chosenCard, setChosenCard] = React.useState(null);
  const [numberOfTokens, setNumberOfTokens] = React.useState(1);
  const [open, setOpen] = React.useState(false);
  const [timer, setTimer] = React.useState();

  const scryfallCardSearch = React.useCallback(event => {
    event.persist();
    setTimer(setTimeout(async function () {
      if (event.target.value.length < 2) {
        setCardSearchResults([]);
        setChosenCard(null);
      } else {
        await sendRequest({
          callback: (data) => {
            if (data.data) {
              setCardSearchResults(data.data.map(match => {
                let powerToughness = '';

                if (match.type_line.includes('Creature') && match.layout === 'double_faced_token') {
                  if (match.card_faces[0].type_line.includes('Creature')) {
                    powerToughness = powerToughness.concat(`${match.card_faces[0].power} / ${match.card_faces[0].toughness}`);
                  }

                  if (match.card_faces[0].type_line.includes('Creature') && match.card_faces[1].type_line.includes('Creature')) {
                    powerToughness = powerToughness.concat(' // ');
                  }

                  if (match.card_faces[1].type_line.includes('Creature')) {
                    powerToughness = powerToughness.concat(`${match.card_faces[1].power} / ${match.card_faces[1].toughness}`);
                  }
                } else if (match.type_line.includes('Creature')) {
                  powerToughness = `${match.power} / ${match.toughness}`;
                } else {
                  powerToughness = null;
                }

                return ({
                keywords: match.keywords,
                name: match.name,
                oracle_id: match.oracle_id,
                powerToughness,
                type_line: match.type_line
                });
              }));
            } else {
              setCardSearchResults([]);
            }
          },
          method: 'GET',
          url: `https://api.scryfall.com/cards/search?q=${event.target.value}+type%3Atoken`
        });
      }
    }, 250));
  }, [sendRequest]);

  const scryfallPrintSearch = React.useCallback(async function (oracleID) {
    await sendRequest({
      callback: async (data) => {
        const printings = data.data.map(print => {
          let back_image, image;

          if (print.layout === 'double_faced_token') {
            back_image = print.card_faces[1].image_uris.large;
            image = print.card_faces[0].image_uris.large;
          } else {
            image = print.image_uris.large;
          }

          return ({
            back_image,
            collector_number: print.collector_number,
            image,
            name: print.name,
            scryfall_id: print.id,
            set_name: print.set_name
          });
        });

        setChosenCard(printings[0]);
        setAvailablePrintings(printings);
      },
      method: 'GET',
      url: `https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracleID}&unique=prints`
    });
  }, [sendRequest]);

  function submitForm () {
    setAnchorEl(null);
    setAvailablePrintings([]);
    setCardSearchResults([]);
    createTokens({
      back_image: chosenCard.back_image,
      image: chosenCard.image,
      name: chosenCard.name
    }, numberOfTokens);
    setChosenCard(null);
    setNumberOfTokens(1);
    closeDialog();
  }

  return (
    <MUIDialog
      onClose={closeDialog}
      open={openDialog}
    >
      <MUIDialogTitle>Create Tokens</MUIDialogTitle>
      <MUIDialogContent>
        <MUIAutocomplete
          clearOnBlur={false}
          clearOnEscape={true}
          fullWidth={true}
          getOptionLabel={option => option.name}
          getOptionSelected={(option, value) => option.oracle_id === value.oracle_id}
          id="card-search-input"
          loading={loading}
          onChange={function (event, value, reason) {
            if (reason === 'select-option') {
              scryfallPrintSearch(value.oracle_id);
            }
          }}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          options={cardSearchResults}
          renderInput={params => (
            <MUITextField
              {...params}
              inputRef={cardSearchInput}
              label="Search for Tokens"
              onKeyUp={(event) => {
                clearTimeout(timer);
                scryfallCardSearch(event);
              }}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading && <MUICircularProgress color="inherit" size={20} />}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                )
              }}
            />
          )}
          renderOption={(option, state) => (
            <div value={option.oracle_id}>
              <span style={{ marginRight: 8 }}>{option.name}</span>
              {option.keywords.length > 0 && <span style={{ marginRight: 8 }}> - {option.keywords.join(', ')} - </span>}
              {option.powerToughness && <span>{option.powerToughness}</span>}
            </div>
          )}
        />

        <MUIList component="nav" dense={true} fullWidth={true}>
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={event => setAnchorEl(event.currentTarget)}
          >
            <MUIListItemText
              primary="Selected Printing"
              secondary={chosenCard && `${chosenCard.set_name} - ${chosenCard.collector_number}`}
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          id="printing"
          anchorEl={anchorEl}
          fullWidth={true}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          {availablePrintings.map((option, index) => (
            <span key={option.scryfall_id}>
              <HoverPreview back_image={option.back_image} image={option.image}>
                <MUIMenuItem
                  onClick={() => {
                    setChosenCard({ ...availablePrintings[index] });
                    setAnchorEl(null);
                  }}
                  selected={option.scryfall_id === chosenCard.scryfall_id}
                >
                  {`${option.set_name} - ${option.collector_number}`}
                </MUIMenuItem>
              </HoverPreview>
            </span>
          ))}
        </MUIMenu>

        <MUITextField
          fullWidth={true}
          inputProps={{
            min: 1,
            step: 1
          }}
          label="Number of Tokens"
          onChange={event => setNumberOfTokens(parseInt(event.target.value))}
          type="number"
          value={numberOfTokens}
        />
      </MUIDialogContent>
      <MUIDialogActions>
        <MUIButton
          fullWidth={true}
          onClick={submitForm}
        >
          {`Create Token${numberOfTokens === 1 ? '' : 's'}!`}
        </MUIButton>
      </MUIDialogActions>
    </MUIDialog>
  );
};