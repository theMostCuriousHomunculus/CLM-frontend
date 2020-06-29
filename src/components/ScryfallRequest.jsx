import React, { useRef, useState } from 'react';
import {
  Button as MUIButton,
  Card as MUICard,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  spaceBetween: {
    display: 'flex',
    justifyContent: 'space-between'
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

  function submitForm (event) {
    event.preventDefault();
    setCardSearchResults(null);
    setPrintSearchResults(null);
    setSearchText('');
    props.onSubmit();
  }

  return (
    <MUICard className="basic-card">
      <form
        action={props.action}
        className={classes.spaceBetween}
        method={props.method}
        onSubmit={submitForm}
      >
        <span>
        <label htmlFor="card-search">Add a card to {props.componentState.active_component_name}: </label>
          <input
            autoComplete="off"
            id="card-search"
            list="card-search-results"
            onChange={scryfallPrintSearch}
            onKeyUp={scryfallCardSearch}
            placeholder={props.searchPlaceholderText}
            required
            type="text"
            value={searchText}
          />
        </span>
        <datalist id="card-search-results" ref={scryfallCardSuggestions}>
          {cardSearchResults && cardSearchResults.map(function (result) {
            return result;
          })}
        </datalist>
        <span>
          <label htmlFor="printing">Printing: </label>
          <select id="printing" name="printing" required>
            {printSearchResults && printSearchResults.map(function (result) {
              return result;
            })}
          </select>
        </span>
        <MUIButton color="primary" type="submit" variant="contained">{props.buttonText}</MUIButton>
      </form>
    </MUICard>
  );
}

export default ScryfallRequest;