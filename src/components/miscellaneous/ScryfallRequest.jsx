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

import { useRequest } from '../../hooks/request-hook';

const ScryfallRequest = (props) => {

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
              let loyalty, mana_cost, power, toughness, type_line;
              if (match.layout === "transform") {
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
                type_line = match.card_faces[0].type_line + " / " + match.card_faces[1].type_line;
              } else {
                loyalty = match.loyalty;
                mana_cost = match.mana_cost;
                power = match.power;
                toughness = match.toughness;
                type_line = match.type_line;
              }

              return (
                {
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
      printings = printings.data.map(function(print) {
        let art_crop, back_image, image;
        if (print.layout === "transform") {
          art_crop = print.card_faces[0].image_uris.art_crop;
          back_image = print.card_faces[1].image_uris.large;
          image = print.card_faces[0].image_uris.large;
        } else {
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
      })
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
    <MUIGrid alignItems="center" container justify="flex-end" spacing={2}>

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
              onChange={(event) => setCardSearchInputValue(event.target.value)}
              value={cardSearchInputValue}
              variant="outlined"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? <MUICircularProgress color="inherit" size={20} /> : null}
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
              key={`printing-${index}`}
              selected={index === selectedPrintIndex}
              onClick={() => handleMenuItemClick(index)}
            >
              {option.printing}
            </MUIMenuItem>
          ))}
        </MUIMenu>
      </MUIGrid>

      <MUIGrid item xs={12} lg={2} style={{ textAlign: "right" }}>
        <MUIButton color="primary" onClick={submitForm} variant="contained">{props.buttonText}</MUIButton>
      </MUIGrid>

    </MUIGrid>
  );
}

export default ScryfallRequest;