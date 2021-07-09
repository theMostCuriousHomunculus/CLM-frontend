import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUITextField from '@material-ui/core/TextField';
import { Autocomplete as MUIAutocomplete } from '@material-ui/lab';

import useRequest from '../../hooks/request-hook';
import HoverPreview from '../miscellaneous/HoverPreview';
import { MatchContext } from '../../contexts/match-context';

export default function ScryfallTokenSearch () {

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
              setCardSearchResults(data.data.map(match => ({
                keywords: match.keywords,
                name: match.name,
                oracle_id: match.oracle_id,
                power: match.power,
                toughness: match.toughness,
                type_line: match.type_line
              })));
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
        const printings = data.data.map(print => ({
          cmc: 0,
          collector_number: print.collector_number,
          color_identity: print.color_identity,
          image: print.image_uris.large,
          keywords: print.keywords,
          mana_cost: "",
          mtgo_id: print.mtgo_id,
          name: print.name,
          oracle_id: print.oracle_id,
          power: print.power,
          scryfall_id: print.id,
          set: print.set,
          set_name: print.set_name,
          tcgplayer_id: print.tcgplayer_id,
          toughness: print.toughness,
          type_line: print.type_line
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
    createTokens(numberOfTokens, chosenCard.scryfall_id);
    setChosenCard(null);
    setNumberOfTokens(1);
    cardSearchInput.current.parentElement.getElementsByClassName('MuiAutocomplete-clearIndicator')[0].click();
    cardSearchInput.current.focus();
  }

  return (
    <React.Fragment>
      <MUIAutocomplete
        clearOnBlur={false}
        clearOnEscape={true}
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
            label="Create Tokens"
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
        renderOption={(option, state) => (
          <div
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
            value={option.oracle_id}
          >
            <span style={{ flexGrow: 1 }}>{option.name}</span>
            <span style={{ flexGrow: 1 }}>{option.keywords.join(', ')}</span>
            <span style={{ flexGrow: 1 }}>{option.type_line.includes('Creature') && option.power + ' / ' + option.toughness}</span>
          </div>
        )}
      />

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
            <HoverPreview image={option.image}>
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
        label="Number of Tokens"
        inputProps={{
          min: 1,
          step: 1
        }}
        margin="dense"
        onChange={event => setNumberOfTokens(parseInt(event.target.value))}
        type="number"
        value={numberOfTokens}
        variant="outlined"
      />

      <MUIButton color="primary" onClick={submitForm} size="small" variant="contained">
        {`Create Token${numberOfTokens === 1 ? '' : 's'}!`}
      </MUIButton>
    </React.Fragment>
  );
};