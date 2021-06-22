import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIGrid from '@material-ui/core/Grid';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';

import useRequest from '../../hooks/request-hook';

export default function ScryfallRequest (props) {

  const cardSearchInput = React.useRef();
  const { loading, sendRequest } = useRequest();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [timer, setTimer] = React.useState();
  const [cardSearchResults, setCardSearchResults] = React.useState([]);
  const [chosenCard, setChosenCard] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

  const scryfallCardSearch = React.useCallback(event => {
    event.persist();
    setTimer(setTimeout(async function () {
      if (event.target.value.length < 2) {
        setCardSearchResults([]);
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
          let art_crop, back_image, chapters, image, loyalty, mana_cost, power, toughness, type_line;
          switch (print.layout) {
            case 'adventure':
              // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = `${print.card_faces[0].mana_cost}${print.card_faces[1].mana_cost}`;
              power = print.card_faces[0].power;
              toughness = print.card_faces[0].toughness;
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'flip':
              // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.card_faces[0].mana_cost;
              if (print.card_faces[0].power) {
                power = print.card_faces[0].power;
              } else if (print.card_faces[1].power) {
                power = print.card_faces[1].power;
              }
              if (print.card_faces[0].toughness) {
                toughness = print.card_faces[0].toughness;
              } else if (print.card_faces[1].toughness) {
                toughness = print.card_faces[1].toughness;
              }
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'leveler':
              // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              mana_cost = print.mana_cost;
              power = print.power;
              toughness = print.toughness;
              type_line = print.type_line;
              break;
            case 'meld':
              // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
              art_crop = print.image_uris.art_crop;
              mana_cost = print.mana_cost;
              power = print.power;
              toughness = print.toughness;
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
              if (print.card_faces[0].loyalty) {
                loyalty = print.card_faces[0].loyalty;
              } else if (print.card_faces[1].loyalty) {
                // think valki, god of lies
                loyalty = print.card_faces[1].loyalty;
              }
              mana_cost = `${print.card_faces[0].mana_cost}${print.card_faces[1].mana_cost}`;
              if (print.card_faces[0].power) {
                power = print.card_faces[0].power;
              } else if (print.card_faces[1].power) {
                power = print.card_faces[1].power;
              }
              if (print.card_faces[0].toughness) {
                toughness = print.card_faces[0].toughness;
              } else if (print.card_faces[1].toughness) {
                toughness = print.card_faces[1].toughness;
              }
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            case 'saga':
              // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              if (print.oracle_text.includes('Sacrifice after III')) {
                chapters = 3;
              }
              if (print.oracle_text.includes('Sacrifice after IV')) {
                chapters = 4;
              }
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
              if (print.card_faces[0].loyalty) {
                loyalty = print.card_faces[0].loyalty;
              } else if (print.card_faces[1].loyalty) {
                // think baby jace
                loyalty = print.card_faces[1].loyalty;
              }
              mana_cost = print.card_faces[0].mana_cost;
              if (print.card_faces[0].power) {
                power = print.card_faces[0].power;
              } else if (print.card_faces[1].power) {
                // think elbrus, the binding blade
                power = print.card_faces[1].power;
              }
              if (print.card_faces[0].toughness) {
                toughness = print.card_faces[0].toughness;
              } else if (print.card_faces[1].toughness) {
                toughness = print.card_faces[1].toughness;
              }
              type_line = `${print.card_faces[0].type_line} / ${print.card_faces[1].type_line}`;
              break;
            default:
              // adventure, flip, leveler, saga, split and normal layout cards
              art_crop = print.image_uris.art_crop;
              image = print.image_uris.large;
              loyalty = print.loyalty;
              mana_cost = print.mana_cost;
              power = print.power;
              toughness = print.toughness;
              type_line = print.type_line;
          }
          return ({
            art_crop,
            back_image,
            chapters,
            cmc: print.cmc,
            color_identity: print.color_identity,
            image,
            keywords: print.keywords,
            loyalty,
            mana_cost,
            mtgo_id: print.mtgo_id,
            name: print.name,
            oracle_id: print.oracle_id,
            power,
            printing: print.set_name + " - " + print.collector_number,
            prints_search_uri: print.prints_search_uri,
            purchase_link: print.purchase_uris.tcgplayer.split("&")[0],
            toughness,
            type_line
          });
        }));

        setAvailablePrintings(printings);
        setChosenCard(printings[0]);
        setSelectedPrintIndex(0);
      },
      method: 'GET',
      url: `https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracleID}&unique=prints`
    });
  }, [sendRequest]);

  const handleMenuItemClick = (index) => {
    setSelectedPrintIndex(index);
    setChosenCard(prevState => ({
      ...prevState,
      ...availablePrintings[index]
    }));
    setAnchorEl(null);
  };

  function submitForm () {
    setAnchorEl(null);
    setAvailablePrintings([]);
    setCardSearchResults([]);
    setSelectedPrintIndex(0);
    props.onSubmit(chosenCard);
    setChosenCard(null);
    cardSearchInput.current.parentElement.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
    cardSearchInput.current.focus();
  }

  return (
    <MUIGrid alignItems="center" container justify="flex-end">

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
              label={props.labelText}
              margin="dense"
              onKeyUp={(event) => {
                clearTimeout(timer);
                scryfallCardSearch(event);
              }}
              variant="outlined"
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
        <MUIList component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={event => setAnchorEl(event.currentTarget)}
          >
            <MUIListItemText
              primary="Selected Printing"
              secondary={availablePrintings[selectedPrintIndex] && availablePrintings[selectedPrintIndex].printing}
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
            <MUIMenuItem
              back_image={option.back_image}
              image={option.image}
              key={`printing-${index}`}
              onClick={() => handleMenuItemClick(index)}
              onMouseOut={props.hidePreview}
              onMouseOver={props.showPreview}
              selected={index === selectedPrintIndex}
            >
              {option.printing}
            </MUIMenuItem>
          ))}
        </MUIMenu>
      </MUIGrid>

      <MUIGrid item xs={12} lg={2} style={{ textAlign: "right" }}>
        <MUIButton color="primary" onClick={submitForm} size="small" variant="contained">
          {props.buttonText}
        </MUIButton>
      </MUIGrid>

    </MUIGrid>
  );
};