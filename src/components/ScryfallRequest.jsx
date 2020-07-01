import React, { useRef, useState } from 'react';
import {
  Button as MUIButton,
  Card as MUICard,
  Grid as MUIGrid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  basicCard: {
    margin: '1rem',
    padding: '8px'
  },
  formInput: {
    width: '100%'
  }
});

const ScryfallRequest = (props) => {

  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const scryfallCardSuggestions = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [cardSearchResults, setCardSearchResults] = useState(null);
  const [printSearchResults, setPrintSearchResults] = useState(null);

  async function scryfallCardSearch (event) {
  
    if (event.target.value.length > 2) {
      try {
        let matches = await sendRequest('https://api.scryfall.com/cards/search?q=' + event.target.value.replace(" ", "_"));
        if (matches.data) {
          setCardSearchResults(matches.data.map(function (match, index) {
            // some card properties are handled differently on cards that transform
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
              <option
                data-cmc={match.cmc}
                data-color_identity={JSON.stringify(match.color_identity)}
                data-keywords={JSON.stringify(match.keywords)}
                data-loyalty={loyalty}
                data-mana_cost={mana_cost}
                data-oracle_id={match.oracle_id}
                data-power={power}
                data-prints_search_uri={match.prints_search_uri}
                data-toughness={toughness}
                data-type_line={type_line}
                key={`card-${index}`}
                name={match.name}
                value={match.name}
              >
                {match.name}
              </option>
            );
          }));
        } else {
            return <option disabled selected value="No matches..." />;
        }
      } catch (error) {
        console.log({ 'Error': error.message });
      }
    } else {
      setCardSearchResults(null);
    }
  }

  async function scryfallPrintSearch (event) {

    setSearchText(event.target.value);
    const chosenOption = scryfallCardSuggestions.current.options.namedItem(event.target.value);

    if (chosenOption) {
      const prints_search_uri = chosenOption.getAttribute("data-prints_search_uri");
      try {
        let printings = await sendRequest(prints_search_uri);
            
        setPrintSearchResults(printings.data.map(function(print, index) {
          let back_image, image;
          if (print.layout === "transform") {
            back_image = print.card_faces[1].image_uris.large;
            image = print.card_faces[0].image_uris.large;
          } else {
            image = print.image_uris.large;
          }
          return (
            <option
              data-back_image={back_image}
              data-image={image}
              data-purchase_link={print.purchase_uris.tcgplayer.split("&")[0]}
              key={`print-${index}`}
              value={print.set_name + " - " + print.collector_number}
            >
              {print.set_name + " - " + print.collector_number}
            </option>
          );
        }));
      } catch (error) {
        console.log({ 'Error': error.message });
      }
    } else {
      return <option disabled selected value="No matches..." />;
    }
  }

  function submitForm () {
    setCardSearchResults(null);
    setPrintSearchResults(null);
    setSearchText('');
    document.getElementById('card-search').focus();
    props.onSubmit();
  }

  return (
    <MUICard className={classes.basicCard}>
      <MUIGrid alignItems="baseline" container justify="flex-end" spacing={2}>

          <MUIGrid item xs={12} sm={3} lg={2}>
            <label htmlFor="card-search">Add a card to {props.componentState.active_component_name}: </label>
          </MUIGrid>

          <MUIGrid item xs={12} sm={9} md={4}>
            <input
              autoComplete="off"
              className={classes.formInput}
              id="card-search"
              list="card-search-results"
              onChange={scryfallPrintSearch}
              onKeyUp={scryfallCardSearch}
              placeholder={props.searchPlaceholderText}
              required
              type="text"
              value={searchText}
            />
          </MUIGrid>

          <datalist id="card-search-results" ref={scryfallCardSuggestions}>
            {cardSearchResults}
          </datalist>

          <MUIGrid item xs={12} sm={3} md={1}>
            <label htmlFor="printing">Printing: </label>
          </MUIGrid>

          <MUIGrid item xs={12} sm={9} md={4}>
            <select className={classes.formInput} id="printing" name="printing" required>
              {printSearchResults && printSearchResults.map(function (result) {
                return result;
              })}
            </select>
          </MUIGrid>

          <MUIGrid item xs={12} lg={1} style={{ textAlign: "right" }}>
            <MUIButton color="primary" onClick={submitForm} variant="contained">{props.buttonText}</MUIButton>
          </MUIGrid>

      </MUIGrid>
    </MUICard>
  );
}

export default ScryfallRequest;