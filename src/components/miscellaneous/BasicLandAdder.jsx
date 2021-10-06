import React from 'react';
import MUIButton from '@mui/material/Button';
import MUIFormControl from '@mui/material/FormControl';
import MUIGrid from '@mui/material/Grid';
import MUIInputLabel from '@mui/material/InputLabel';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText'
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';
import MUIPaper from '@mui/material/Paper';
import MUISelect from '@mui/material/Select';
import MUITypography from '@mui/material/Typography';

import useRequest from '../../hooks/request-hook';
import HoverPreview from './HoverPreview';

export default function BasicLandAdder ({ submitFunction }) {

  const { sendRequest } = useRequest();
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrints, setAvailablePrints] = React.useState([]);
  const [availableSets, setAvailableSets] = React.useState([]);
  const [chosenPrint, setChosenPrint] = React.useState({ scryfall_id: null });
  const [chosenSetName, setChosenSetName] = React.useState('');
  const [basicLandName, setBasicLandName] = React.useState('plains');

  React.useEffect(() => {

    async function requestPrints () {
      if (chosenSetName) {
        await sendRequest({
          callback: data => {

            if (data.data) {
              setAvailablePrints(data.data.map(print => ({
                cmc: 0,
                collector_number: print.collector_number,
                color_identity: print.color_identity,
                image: print.image_uris.normal,
                keywords: print.keywords,
                mana_cost: print.mana_cost,
                mtgo_id: print.mtgo_id,
                name: print.name,
                oracle_id: print.oracle_id,
                scryfall_id: print.id,
                set: print.set,
                set_name: print.set_name,
                tcgplayer_id: print.tcgplayer_id,
                type_line: print.type_line
              })));
            } else {
              setAvailablePrints([]);
            }

          },
          method: 'GET',
          url: `https://api.scryfall.com/cards/search?q=${basicLandName}+type=basic+set=${chosenSetName}&unique=prints`
        });
      }
    }

    requestPrints();
    
  }, [sendRequest, basicLandName, chosenSetName])

  React.useEffect(() => {
    async function findSets () {
      await sendRequest({
        callback: data => {
          setAvailableSets(data.data.map(set => ({ code: set.code, name: set.name })));
          setChosenSetName(data.data[0].code);
        },
        method: 'GET',
        url: 'https://api.scryfall.com/sets'
      })
    }

    findSets();
  }, [sendRequest]);

  return (
    <MUIPaper style={{ padding: '0 4px' }}>
      <div style={{ padding: 4 }}>
        <MUITypography variant="subtitle1">Add Basic Lands to Deck</MUITypography>
      </div>
      <MUIGrid alignItems="center" container justifyContent="space-between" spacing={1}>
        <MUIGrid container item xs={6} md={3}>
          <MUIFormControl variant="outlined" style={{ flexGrow: 1 }}>
            <MUIInputLabel htmlFor="basic-land-name-selector">Basic Land Name</MUIInputLabel>
            <MUISelect
              label="Basic Land Name"
              margin="dense"
              native
              onChange={event => setBasicLandName(event.target.value)}
              value={basicLandName}
              variant="outlined"
              inputProps={{
                id: 'basic-land-name-selector',
                name: 'basic-land-name'
              }}
            >
              <option value="plains">Plains</option>
              <option value="island">Island</option>
              <option value="swamp">Swamp</option>
              <option value="mountain">Mountain</option>
              <option value="forest">Forest</option>
              <option value="wastes">Wastes</option>
            </MUISelect>
          </MUIFormControl>
        </MUIGrid>
        
        <MUIGrid container item xs={6} md={3}>
          <MUIFormControl variant="outlined" style={{ flexGrow: 1 }}>
            <MUIInputLabel htmlFor="set-name-selector">Set Name</MUIInputLabel>
            <MUISelect
              label="Set Name"
              margin="dense"
              native
              onChange={event => setChosenSetName(event.target.value)}
              value={chosenSetName}
              variant="outlined"
              inputProps={{
                id: 'set-name-selector',
                name: 'set-name'
              }}
            >
              {availableSets.length === 0 ?
                <option value="">Could not fetch sets from Scryfall...</option> :
                availableSets.map(set => (
                  <option key={set.code} value={set.code}>{set.name}</option>
                ))
              }
            </MUISelect>
          </MUIFormControl>
        </MUIGrid>

        <MUIGrid item xs={6} md={3}>
          <MUIList component="nav" dense={true} style={{ flexGrow: 1 }}>
            <MUIListItem
              button
              aria-haspopup="true"
              aria-controls="lock-menu"
              onClick={event => setAnchorEl(event.currentTarget)}
            >
              <MUIListItemText
                primary="Selected Printing"
                secondary={chosenPrint.collector_number}
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
            {availablePrints.length === 0 ?
              <MUIMenuItem
                onClick={() => {
                  setChosenPrint({ scryfall_id: null });
                  setAnchorEl(null);
                }}
                value=''
              >
                No printings available from this set
              </MUIMenuItem> :
              availablePrints.map(print => (
                <span key={print.id}>
                  <HoverPreview image={print.image}>
                    <MUIMenuItem
                      onClick={() => {
                        setChosenPrint(print);
                        setAnchorEl(null);
                      }}
                      selected={print.scryfall_id === chosenPrint.scryfall_id}
                      value={print.id}
                    >
                      {print.collector_number}
                    </MUIMenuItem>
                  </HoverPreview>
                </span>
              ))
            }
          </MUIMenu>
        </MUIGrid>

        <MUIGrid container item justifyContent="flex-end" xs={6} md={3}>
          <MUIButton onClick={() => submitFunction(chosenPrint)}>
            Add To Deck
          </MUIButton>
        </MUIGrid>
      </MUIGrid>
    </MUIPaper>
  );
};