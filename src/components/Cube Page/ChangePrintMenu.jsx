import React from 'react';
import MUICircularProgress from '@mui/material/CircularProgress';
import MUIList from '@mui/material/List';
import MUIListItem from '@mui/material/ListItem';
import MUIListItemText from '@mui/material/ListItemText';
import MUIMenu from '@mui/material/Menu';
import MUIMenuItem from '@mui/material/MenuItem';

import useRequest from '../../hooks/request-hook';
import HoverPreview from '../miscellaneous/HoverPreview';

export default function ChangePrintMenu ({
  card,
  handlePrintingChange
}) {

  const { loading, sendRequest } = useRequest();
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrintings, setAvailablePrintings] = React.useState([{
    back_image: card.back_image,
    collector_number: card.collector_number,
    image: card.image,
    mtgo_id: card.mtgo_id,
    scryfall_id: card.scryfall_id,
    set: card.set,
    set_name: card.set_name,
    tcgplayer_id: card.tcgplayer_id
  }]);
  const [selectedPrint, setSelectedPrint] = React.useState({
    back_image: card.back_image,
    collector_number: card.collector_number,
    image: card.image,
    mtgo_id: card.mtgo_id,
    scryfall_id: card.scryfall_id,
    set: card.set,
    set_name: card.set_name,
    tcgplayer_id: card.tcgplayer_id
  });

  async function enablePrintChange (event) {
    setAnchorEl(event.currentTarget);
    await sendRequest({
      callback: async (data) => {
        const printings = await Promise.all(data.data.map(async function(print) {
          let back_image, image;
          switch (print.layout) {
            case 'meld':
              // meld only appeared in Eldritch Moon and probably won't ever come back.  no planeswalkers; only creatures and a single land
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
              back_image = print.card_faces[1].image_uris.large;
              image = print.card_faces[0].image_uris.large;
              break;
            case 'transform':
              back_image = print.card_faces[1].image_uris.large;
              image = print.card_faces[0].image_uris.large;
              break;
            default:
              // adventure, flip, leveler, saga, split and normal layout cards
              image = print.image_uris.large;
          }
          return ({
            back_image,
            collector_number: print.collector_number,
            image,
            mtgo_id: print.mtgo_id,
            scryfall_id: print.scryfall_id,
            set: print.set,
            set_name: print.set_name,
            tcgplayer_id: print.tcgplayer_id
          });
        }));

        setAvailablePrintings(printings);
      },
      load: true,
      method: 'GET',
      url: `https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${card.oracle_id}&unique=prints`
    });
  }

  function handleMenuItemClick (index) {
    setAnchorEl(null);
    setSelectedPrint(availablePrintings[index]);
    handlePrintingChange(availablePrintings[index]);
  };

  return (
    <React.Fragment>

      <MUIList component="nav">
        <MUIListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={enablePrintChange}
        >
          <MUIListItemText
            primary={"Printing"}
            secondary={`${selectedPrint.set_name} - ${selectedPrint.collector_number}`}
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
        {loading ?
          <MUICircularProgress color="primary" size={20} /> :
          availablePrintings.map((option, index) => (
            <span key={option.scryfall_id}>
              <HoverPreview back_image={option.back_image} image={option.image}>
                <MUIMenuItem
                  selected={option.scryfall_id === selectedPrint.scryfall_id}
                  onClick={() => handleMenuItemClick(index)}
                >
                  {`${option.set_name} - ${option.collector_number}`}
                </MUIMenuItem>
              </HoverPreview>
            </span>
          ))
        }
      </MUIMenu>
    </React.Fragment>
  );
};