import React from 'react';
import MUIFormControl from '@material-ui/core/FormControl';
import MUIInputLabel from '@material-ui/core/InputLabel';
import MUISelect from '@material-ui/core/Select';
import MUITextField from '@material-ui/core/TextField';
import MUITypography from '@material-ui/core/Typography';

import useRequest from '../../hooks/request-hook';
import HoverPreview from './HoverPreview';

export default function BasicLandAdder () {

  const { loading, sendRequest } = useRequest();
  const [availablePrints, setAvailablePrints] = React.useState([]);
  const [availableSets, setAvailableSets] = React.useState([]);
  const [chosenPrint, setChosenPrint] = React.useState('placeholder');
  const [chosenSetName, setChosenSetName] = React.useState('placeholder');
  const [basicLandName, setBasicLandName] = React.useState('plains');
  const [numberOfCopies, setNumberOfCopies] = React.useState(1);

  React.useEffect(() => {

    async function requestPrints () {
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
        load: true,
        method: 'GET',
        url: `https://api.scryfall.com/cards/search?q=${basicLandName}+type=basic+set=${chosenSetName}&unique=prints`
      });
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
        load: true,
        method: 'GET',
        url: 'https://api.scryfall.com/sets'
      })
    }

    findSets();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <MUITypography variant="h3">Add Basic Lands to Your Deck</MUITypography>
      <div style={{ alignItems: 'baseline', display: 'flex', margin: '8px 0' }}>
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
            {loading ?
              <option value="placeholder">...</option> :
              availableSets.map(set => (
                <option key={set.code} value={set.code}>{set.name}</option>
              ))
            }
          </MUISelect>
        </MUIFormControl>

        <MUIFormControl variant="outlined" style={{ flexGrow: 1 }}>
          <MUIInputLabel htmlFor="print-number">Print Number</MUIInputLabel>
          <MUISelect
            label="Print Number"
            margin="dense"
            native
            onChange={event => setChosenPrint(event.target.value)}
            value={chosenPrint}
            variant="outlined"
            inputProps={{
              id: 'print-selector',
              name: 'print-number'
            }}
          >
            {loading ?
              <option value="placeholder">...</option> :
              availablePrints.map(print => (
                <HoverPreview image={print.image} key={print.id}>
                  <option value={print.id}>{print.collector_number}</option>
                </HoverPreview>
              ))
            }
          </MUISelect>
        </MUIFormControl>

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
      </div>
    </React.Fragment>
  );
};