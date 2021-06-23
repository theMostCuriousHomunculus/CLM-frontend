import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

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
    image: card.image,
    mtgo_id: card.mtgo_id,
    printing: card.printing,
    purchase_link: card.purchase_link
  }]);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

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
            image,
            mtgo_id: print.mtgo_id,
            printing: print.set_name + " - " + print.collector_number,
            purchase_link: print.purchase_uris.tcgplayer.split("&")[0]
          });
        }));

        setAvailablePrintings(printings);
        setSelectedPrintIndex(printings.findIndex(print => print.printing === card.printing));
      },
      load: true,
      method: 'GET',
      url: `https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${card.oracle_id}&unique=prints`
    });
  }

  function handleMenuItemClick (index) {
    setAnchorEl(null);
    setSelectedPrintIndex(index);
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
            secondary={availablePrintings[selectedPrintIndex].printing}
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
            <span key={option.printing}>
              <HoverPreview>
                <MUIMenuItem
                  back_image={option.back_image}
                  image={option.image}
                  selected={index === selectedPrintIndex}
                  onClick={() => handleMenuItemClick(index)}
                >
                  {option.printing}
                </MUIMenuItem>
              </HoverPreview>
            </span>
          ))
        }
      </MUIMenu>
    </React.Fragment>
  );
};