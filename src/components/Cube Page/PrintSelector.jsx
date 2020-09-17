import React from 'react';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import { useRequest } from '../../hooks/request-hook';

const PrintSelector = (props) => {

  const { loading, sendRequest } = useRequest();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [availablePrintings, setAvailablePrintings] = React.useState([{
    back_image: props.card.back_image,
    image: props.card.image,
    mtgo_id: props.card.mtgo_id,
    printing: props.card.printing,
    purchase_link: props.card.purchase_link
  }]);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

  async function enablePrintChange (event) {
    setAnchorEl(event.currentTarget);

    try {
      let printings = await sendRequest(`https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${props.card.oracle_id}&unique=prints`);
      printings = printings.data.map(function(print) {
        let back_image, image;
        if (print.layout === "transform") {
          back_image = print.card_faces[1].image_uris.large;
          image = print.card_faces[0].image_uris.large;
        } else {
          image = print.image_uris.large;
        }
        return (
          {
            back_image,
            image,
            mtgo_id: print.mtgo_id,
            printing: print.set_name + " - " + print.collector_number,
            purchase_link: print.purchase_uris.tcgplayer.split("&")[0]
          }
        );
      });
      setAvailablePrintings(printings);
      setSelectedPrintIndex(printings.findIndex(function (print) {
        return print.printing === props.card.printing;
      }));
    } catch (error) {
      console.log(error);
    }
  }

  return(
    <React.Fragment>
      <MUIList component="nav">
        <MUIListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={enablePrintChange}
        >
          <MUIListItemText
            // primary="Selected Printing"
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
          <MUIMenuItem
            key={`${props.card._id}-printing-${index}`}
            selected={index === selectedPrintIndex}
            onClick={function () {
              setSelectedPrintIndex(index);
              setAnchorEl(null);
              props.submitCardChange(props.card._id, {
                back_image: availablePrintings[index].back_image,
                image: availablePrintings[index].image,
                mtgo_id: availablePrintings[index].mtgo_id,
                printing: availablePrintings[index].printing,
                purchase_link: availablePrintings[index].purchase_link
              });
            }}
          >
            {option.printing}
          </MUIMenuItem>
        ))}
      </MUIMenu>
    </React.Fragment>
  );
}

export default React.memo(PrintSelector);