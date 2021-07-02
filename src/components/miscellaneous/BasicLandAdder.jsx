import React from 'react';
import MUIButton from '@material-ui/core/Button';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIGrid from '@material-ui/core/Grid';
import MUIInputLabel from '@material-ui/core/InputLabel';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText'
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';
import MUISelect from '@material-ui/core/Select';
import MUITextField from '@material-ui/core/TextField';

import useRequest from '../../hooks/request-hook';
import HoverPreview from './HoverPreview';

export default function BasicLandAdder ({ submitFunction }) {

  const { sendRequest } = useRequest();
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrints, setAvailablePrints] = React.useState([]);
  const [availableSets, setAvailableSets] = React.useState([]);
  const [chosenPrint, setChosenPrint] = React.useState({ id: '', collector_number: '', image: '' });
  const [chosenSetName, setChosenSetName] = React.useState('');
  const [basicLandName, setBasicLandName] = React.useState('plains');
  const [numberOfCopies, setNumberOfCopies] = React.useState(1);

  React.useEffect(() => {

    async function requestPrints () {
      if (chosenSetName) {
        await sendRequest({
          callback: data => {

            if (data.data) {
              setAvailablePrints(data.data.map(print => ({
                id: print.id,
                collector_number: print.collector_number,
                image: print.image_uris.normal
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
    <MUIGrid alignItems="center" container justify="space-between" spacing={1}>
      <MUIGrid container item xs={12} md={6} lg={3}>
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
      
      <MUIGrid container item xs={12} md={6} lg={3}>
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

      <MUIGrid item xs={4} md={2}>
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
                setChosenPrint({ id: '', collector_number: '', image: '' });
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

      <MUIGrid item xs={4} md={2}>
        <MUITextField
          label="Number of Copies"
          margin="dense"
          onChange={event => setNumberOfCopies(event.target.value)}
          type="number"
          value={numberOfCopies}
          variant="outlined"
          inputProps={{
            min: 0,
            step: 1
          }}
        />
      </MUIGrid>

      <MUIGrid container item justify="flex-end" xs={4} md={2}>
        <MUIButton
          color="primary"
          onClick={() => {
            submitFunction(numberOfCopies, chosenPrint.id);
            setChosenPrint({ id: '', collector_number: '', image: '' });
            setNumberOfCopies(1);
          }}
          variant="contained"
        >
          Add To Deck
        </MUIButton>
      </MUIGrid>
    </MUIGrid>
  );
};