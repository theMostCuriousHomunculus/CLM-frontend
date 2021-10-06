import React from 'react';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIGrid from '@mui/material/Grid';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';
import { Autocomplete as MUIAutocomplete } from '@mui/lab';

import useRequest from '../../hooks/request-hook';
import HoverPreview from './HoverPreview';

export default function ScryfallRequest ({
  buttonText,
  labelText,
  onSubmit
}) {

  const cardSearchInput = React.useRef();
  const { loading, sendRequest } = useRequest();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [timer, setTimer] = React.useState();
  const [cardSearchResults, setCardSearchResults] = React.useState([]);
  const [chosenCard, setChosenCard] = React.useState(null);
  const [open, setOpen] = React.useState(false);

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
              setCardSearchResults(data.data.map(match => ({ name: match.name, oracle_id: match.oracle_id })));
            } else {
              setCardSearchResults([]);
            }
          },
          method: 'GET',
          url: `https://api.scryfall.com/cards/search?q=${event.target.value}`
        });
      }
    }, 250));
  }, [sendRequest]);

  const scryfallPrintSearch = React.useCallback(async function (oracleID) {
    await sendRequest({
      callback: async (data) => {
        const printings = await Promise.all(data.data.map(async function(print) {
          let art_crop, back_image, image, mana_cost, type_line;
          switch (print.layout) {
            case 'adventure':
              // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = `${print.card_faces[0].mana_cost}${print.card_faces[1].mana_cost}`;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'flip':
              // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.card_faces[0].mana_cost;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'leveler':
              // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.mana_cost;
              type_line = print.type_line;
              break;
            case 'meld':
              // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
              art_crop = print.image_uris.art_crop;
              mana_cost = print.mana_cost;
              type_line = print.type_line;
              const meldResultPart = print.all_parts.find(part => part.component === 'meld_result');
              await sendRequest({
                callback: (data) => {
                  back_image = data.image_uris.large;
                  image = print.image_uris.large;
                },
                method: 'GET',
                url: meldResultPart.uri
              });
              break;
            case 'modal_dfc':
              art_crop = print.card_faces[0].image_uris.art_crop;
              back_image = print.card_faces[1].image_uris.large;
              image = print.card_faces[0].image_uris.large;
              mana_cost = `${print.card_faces[0].mana_cost}${print.card_faces[1].mana_cost}`;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'saga':
              // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.mana_cost;
              type_line = print.type_line;
              break;
            case 'split':
              // split cards are always instants and/or sorceries
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = `${print.card_faces[0].mana_cost}${print.card_faces[1].mana_cost}`;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'transform':
              art_crop = print.card_faces[0].image_uris.art_crop;
              back_image = print.card_faces[1].image_uris.large;
              image = print.card_faces[0].image_uris.large;
              mana_cost = print.card_faces[0].mana_cost;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            default:
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.mana_cost;
              type_line = print.type_line;
          }
          return ({
            art_crop,
            back_image,
            cmc: print.cmc,
            collector_number: print.collector_number,
            color_identity: print.color_identity,
            image,
            keywords: print.keywords,
            mana_cost,
            mtgo_id: print.mtgo_id,
            name: print.name,
            oracle_id: print.oracle_id,
            scryfall_id: print.id,
            set: print.set,
            set_name: print.set_name,
            tcgplayer_id: print.tcgplayer_id,
            type_line
          });
        }));

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
    onSubmit(chosenCard);
    setChosenCard(null);
    cardSearchInput.current.parentElement.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
    cardSearchInput.current.focus();
  }

  return (
    <MUIGrid alignItems="center" container justifyContent="flex-end" spacing={1}>

      <MUIGrid item xs={12} md={6} lg={5}>
        <MUIAutocomplete
          clearOnBlur={false}
          clearOnEscape={true}
          getOptionLabel={(option) => option.name}
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
              label={labelText}
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
        />
      </MUIGrid>

      <MUIGrid item xs={12} md={6} lg={5}>
        <MUIList component="nav" dense={true}>
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
      </MUIGrid>

      <MUIGrid item xs={12} lg={2} style={{ textAlign: "right" }}>
        <MUIButton onClick={submitForm}>
          {buttonText}
        </MUIButton>
      </MUIGrid>

    </MUIGrid>
  );
};