import React, { useEffect, useRef, useState } from 'react';
import MUIAutocomplete from '@mui/material/Autocomplete';
import MUIButton from '@mui/material/Button';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUITextField from '@mui/material/TextField';

import searchCard from '../../graphql/queries/card/search-card';
import searchPrintings from '../../graphql/queries/card/search-printings';
import HoverPreview from './HoverPreview';

export default function ScryfallRequest({ buttonText, labelText, onSubmit }) {
  const abortControllerRef = useRef(new AbortController());
  const cardSearchInput = useRef();
  const timer = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [availablePrintings, setAvailablePrintings] = useState([]);
  const [cardSearchResults, setCardSearchResults] = useState([]);
  const [chosenCardOracleID, setChosenCardOracleID] = useState(null);
  const [chosenPrinting, setChosenPrinting] = useState(null);
  const [loading, setLoading] = useState(false);

  const scryfallCardSearch = (event) => {
    event.persist();
    if ('current' in timer) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(async function () {
      try {
        if (event.target.value.length < 2) {
          setCardSearchResults([]);
          setChosenCardOracleID(null);
          setChosenPrinting(null);
        } else {
          setLoading(true);
          const cards = await searchCard({
            queryString: `{
              name
              oracle_id
            }`,
            signal: abortControllerRef.current.signal,
            variables: { search: event.target.value }
          });
          if (cards && cards.data && cards.data.searchCard) {
            setCardSearchResults(cards.data.searchCard);
          } else {
            setCardSearchResults([]);
          }
        }
      } catch (error) {
        setCardSearchResults([]);
        setChosenCardOracleID(null);
        setChosenPrinting(null);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  useEffect(() => {
    (async function () {
      try {
        if (chosenCardOracleID) {
          const printings = await searchPrintings({
            queryString: `{
              _id
              card_faces {
                image_uris {
                  art_crop
                  large
                }
              }
              collector_number
              image_uris {
                art_crop
                large
              }
              name
              oracle_id
              set_name
            }`,
            signal: abortControllerRef.current.signal,
            variables: { oracle_id: chosenCardOracleID }
          });
          if (printings && printings.data && printings.data.searchPrintings) {
            setAvailablePrintings(printings.data.searchPrintings);
            if (printings.data.searchPrintings.length > 0) {
              setChosenPrinting(printings[0]);
            }
          }
        }
      } catch (error) {
        setChosenPrinting(null);
      } finally {
      }
    })();
  }, [chosenCardOracleID]);

  useEffect(() => {
    return () => abortControllerRef.current.abort();
  }, []);

  function submitForm() {
    setAnchorEl(null);
    setAvailablePrintings([]);
    setCardSearchResults([]);
    onSubmit(chosenPrinting);
    setChosenCardOracleID(null);
    setChosenPrinting(null);
    cardSearchInput.current.parentElement
      .getElementsByClassName('MuiAutocomplete-clearIndicator')[0]
      .click();
    cardSearchInput.current.focus();
  }

  return (
    <div
      style={{
        display: 'flex',
        flexGrow: 1
      }}
    >
      <div
        style={{
          flexGrow: 1,
          marginRight: 4
        }}
      >
        <MUIAutocomplete
          clearOnBlur={false}
          clearOnEscape={true}
          fullWidth
          getOptionLabel={(option) => option.name}
          // id="card-search-input"
          loading={loading}
          onChange={function (event, value, reason) {
            if (reason === 'selectOption') {
              setChosenCardOracleID(value.oracle_id);
            }
          }}
          options={cardSearchResults}
          renderInput={(params) => (
            <MUITextField
              {...params}
              inputRef={cardSearchInput}
              label={labelText}
              onChange={scryfallCardSearch}
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
          renderOption={(props, option) => (
            <li key={option.oracle_id} {...props}>
              {option.name}
            </li>
          )}
          style={{
            marginBottom: 8
          }}
        />

        <MUIList
          component="nav"
          dense={true}
          style={{
            marginTop: 8,
            padding: 0
          }}
        >
          <MUIListItem
            aria-haspopup="true"
            aria-controls="lock-menu"
            button
            id="scryfall-print-selector"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <MUIListItemText
              primary="Selected Printing"
              secondary={
                chosenPrinting && `${chosenPrinting.set_name} - ${chosenPrinting.collector_number}`
              }
            />
          </MUIListItem>
        </MUIList>
        <MUIMenu
          id="printing"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          MenuListProps={{
            'aria-labelledby': 'scryfall-print-selector',
            role: 'listbox'
          }}
        >
          {availablePrintings.map((option) => (
            <HoverPreview
              back_image={option.image_uris ? undefined : option.card_faces[1].image_uris.large}
              image={option.image_uris?.large ?? option.card_faces[0].image_uris.large}
              key={option._id}
            >
              <MUIMenuItem
                onClick={() => {
                  setChosenPrinting(option);
                  setAnchorEl(null);
                }}
                selected={option._id === chosenPrinting?._id}
              >
                {`${option.set_name} - ${option.collector_number}`}
              </MUIMenuItem>
            </HoverPreview>
          ))}
        </MUIMenu>
      </div>

      <MUIButton onClick={submitForm} style={{ marginLeft: 4 }}>
        {buttonText}
      </MUIButton>
    </div>
  );
}
