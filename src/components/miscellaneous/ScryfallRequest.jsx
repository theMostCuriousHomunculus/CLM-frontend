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
import { makeStyles } from '@material-ui/core/styles';

import { useRequest } from '../../hooks/request-hook';

const useStyles = makeStyles({
  list: {
    padding: 0
  }
});

const ScryfallRequest = (props) => {

  const classes = useStyles();
  const { loading, sendRequest } = useRequest();

  const cardSearchInput = React.useRef(null);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [cardSearchInputValue, setCardSearchInputValue] = React.useState('');
  const [cardSearchResults, setCardSearchResults] = React.useState([]);
  const [chosenCard, setChosenCard] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

  React.useEffect(function () {
    const timer = setTimeout(async function () {
      if (cardSearchInputValue === cardSearchInput.current.value) {
        try {
          if (cardSearchInput.current.value.length === 0) throw new Error();
          let matches = await sendRequest(`https://api.scryfall.com/cards/search?q=${cardSearchInputValue}` , 'GET', null, {});
          if (matches.data) {
            setCardSearchResults(matches.data.map(function (match) {
              let chapters, loyalty, mana_cost, power, toughness, type_line;
              switch(match.layout) {
                case 'split':
                  // split cards are always instants and/or sorceries
                  mana_cost = `${match.card_faces[0].mana_cost}${match.card_faces[1].mana_cost}`;
                  type_line = `${match.card_faces[0].type_line} / ${match.card_faces[1].type_line}`;
                  break;
                case 'flip':
                  // flip was only in Kamigawa block (plus an "Un" card and a couple of reprints), which was before planeswalkers existed.  unlikely they ever bring this layout back, and if they do, no idea how they would fit a planeswalker onto one side.  all flip cards are creatures on one end and either a creature or an enchantment on the other
                  mana_cost = match.card_faces[0].mana_cost;
                  if (match.card_faces[0].power) {
                    power = match.card_faces[0].power;
                  } else if (match.card_faces[1].power) {
                    power = match.card_faces[1].power;
                  }
                  if (match.card_faces[0].toughness) {
                    toughness = match.card_faces[0].toughness;
                  } else if (match.card_faces[1].toughness) {
                    toughness = match.card_faces[1].toughness;
                  }
                  type_line = `${match.card_faces[0].type_line} / ${match.card_faces[1].type_line}`;
                  break;
                case 'transform':
                  if (match.card_faces[0].loyalty) {
                    loyalty = match.card_faces[0].loyalty;
                  } else if (match.card_faces[1].loyalty) {
                    // think baby jace
                    loyalty = match.card_faces[1].loyalty;
                  }
                  mana_cost = match.card_faces[0].mana_cost;
                  if (match.card_faces[0].power) {
                    power = match.card_faces[0].power;
                  } else if (match.card_faces[1].power) {
                    // think elbrus, the binding blade
                    power = match.card_faces[1].power;
                  }
                  if (match.card_faces[0].toughness) {
                    toughness = match.card_faces[0].toughness;
                  } else if (match.card_faces[1].toughness) {
                    toughness = match.card_faces[1].toughness;
                  }
                  type_line = `${match.card_faces[0].type_line} / ${match.card_faces[1].type_line}`;
                  break;
                case 'modal_dfc':
                  if (match.card_faces[0].loyalty) {
                    loyalty = match.card_faces[0].loyalty;
                  } else if (match.card_faces[1].loyalty) {
                    // think valki, god of lies
                    loyalty = match.card_faces[1].loyalty;
                  }
                  mana_cost = `${match.card_faces[0].mana_cost}${match.card_faces[1].mana_cost}`;
                  if (match.card_faces[0].power) {
                    power = match.card_faces[0].power;
                  } else if (match.card_faces[1].power) {
                    power = match.card_faces[1].power;
                  }
                  if (match.card_faces[0].toughness) {
                    toughness = match.card_faces[0].toughness;
                  } else if (match.card_faces[1].toughness) {
                    toughness = match.card_faces[1].toughness;
                  }
                  type_line = `${match.card_faces[0].type_line} / ${match.card_faces[1].type_line}`;
                  break;
                case 'meld':
                  // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
                  mana_cost = match.mana_cost;
                  power = match.power;
                  toughness = match.toughness;
                  type_line = match.type_line;
                  break;
                case 'leveler':
                  // all level up cards have been creatures.  this is a mechanic that has so far only appeared in Rise of the Eldrazi and a single card in Modern Horizons.  i don't expect the mechanic to return, but the printing of Hexdrinker in MH1 suggests it may
                  mana_cost = match.mana_cost;
                  power = match.power;
                  toughness = match.toughness;
                  type_line = match.type_line;
                  break;
                case 'saga':
                  // saga's have no other faces; they simply have their own layout type becuase of the fact that the art is on the right side of the card rather than the top of the card.  all sagas printed so far (through Kaldheim) have only 3 or 4 chapters
                  if (match.oracle_text.includes('Sacrifice after III')) {
                    chapters = 3;
                  }
                  if (match.oracle_text.includes('Sacrifice after IV')) {
                    chapters = 4;
                  }
                  mana_cost = match.mana_cost;
                  type_line = match.type_line;
                  break;
                case 'adventure':
                  // this mechanic debuted in Throne of Eldrain.  all adventure cards are either (instants or sorceries) and creatures.  it seems to have been popular, so it may appear again
                  mana_cost = `${match.card_faces[0].mana_cost}${match.card_faces[1].mana_cost}`;
                  power = match.card_faces[0].power;
                  toughness = match.card_faces[0].toughness;
                  type_line = `${match.card_faces[0].type_line} / ${match.card_faces[1].type_line}`;
                  break;
                default:
                  // 'normal' layout
                  loyalty = match.loyalty;
                  mana_cost = match.mana_cost;
                  power = match.power;
                  toughness = match.toughness;
                  type_line = match.type_line;
              }

              return (
                {
                  chapters,
                  cmc: match.cmc,
                  color_identity: match.color_identity,
                  keywords: match.keywords,
                  loyalty,
                  mana_cost,
                  oracle_id: match.oracle_id,
                  power,
                  prints_search_uri: match.prints_search_uri,
                  toughness,
                  type_line,
                  name: match.name,
                  value: match.name
                }
              );
            }));
          } else {
            setCardSearchResults([]);
          }
        } catch (error) {
          setCardSearchResults([]);
        }
      }
    }, 250);
    return () => {
      clearTimeout(timer);
    };
  }, [cardSearchInput, cardSearchInputValue, sendRequest])

  const handleMenuItemClick = (index) => {
    setSelectedPrintIndex(index);
    setChosenCard({ ...chosenCard, ...availablePrintings[index] });
    setAnchorEl(null);
  };

  async function scryfallPrintSearch (prints_search_uri, cardDetails) {
    try {
      let printings = await sendRequest(prints_search_uri);
      printings = await Promise.all(printings.data.map(async function(print) {
        let art_crop, back_image, image;
        switch (print.layout) {
          // just using the front image for the art crop (used for blog images and profile avatars)
          case 'transform':
            art_crop = print.card_faces[0].image_uris.art_crop;
            back_image = print.card_faces[1].image_uris.large;
            image = print.card_faces[0].image_uris.large;
            break;
          case 'modal_dfc':
            art_crop = print.card_faces[0].image_uris.art_crop;
            back_image = print.card_faces[1].image_uris.large;
            image = print.card_faces[0].image_uris.large;
            break;
          case 'meld':
            art_crop = print.image_uris.art_crop;
            const meldResultPart = print.all_parts.find(function (part) {
              return part.component === 'meld_result';
            });
            const meldResult = await sendRequest(meldResultPart.uri, 'GET', null, {});
            back_image = meldResult.image_uris.large;
            image = print.image_uris.large;
            break;
          default:
            // split, flip, leveler, saga, adventure and normal layout cards
            art_crop = print.image_uris.art_crop;
            image = print.image_uris.large;
        }
        return (
          {
            art_crop,
            back_image,
            image,
            mtgo_id: print.mtgo_id,
            printing: print.set_name + " - " + print.collector_number,
            purchase_link: print.purchase_uris.tcgplayer.split("&")[0]
          }
        );
      }));
      setAvailablePrintings(printings);
      setChosenCard({ ...chosenCard, ...cardDetails, ...printings[0] });
    } catch (error) {
      console.log({ 'Error': error.message });
      setAvailablePrintings([]);
    }
    setSelectedPrintIndex(0);
  }

  function submitForm () {
    setAnchorEl(null);
    setAvailablePrintings([]);
    setCardSearchResults([]);
    setSelectedPrintIndex(0);
    document.getElementsByClassName('MuiAutocomplete-clearIndicator')[1].click();
    cardSearchInput.current.focus();
    props.onSubmit(chosenCard);
    setChosenCard(null);
  }

  return (
    <MUIGrid alignItems="center" container justify="flex-end">

      <MUIGrid item xs={12} md={6} lg={5}>
        <MUIAutocomplete
          clearOnBlur={false}
          clearOnEscape={true}
          getOptionLabel={(option) => option.name}
          getOptionSelected={function (option, value) {
            return option.name === value.name;
          }}
          id="chosen-card"
          loading={loading}
          onChange={function (event, value, reason) {
            if (reason === 'select-option') {
              let cardDetails = { ...value };
              delete cardDetails.value;
              scryfallPrintSearch(value.prints_search_uri, { ...cardDetails });
            }
          }}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          options={cardSearchResults}
          renderInput={(params) => (
            <MUITextField
              {...params}
              inputRef={cardSearchInput}
              label={props.labelText}
              margin="dense"
              onChange={(event) => setCardSearchInputValue(event.target.value)}
              value={cardSearchInputValue}
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
        <MUIList className={classes.list} component="nav">
          <MUIListItem
            button
            aria-haspopup="true"
            aria-controls="lock-menu"
            onClick={(event) => setAnchorEl(event.currentTarget)}
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
}

export default ScryfallRequest;