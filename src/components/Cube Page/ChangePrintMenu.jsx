import React from 'react';
import axios from 'axios';
import MUICircularProgress from '@material-ui/core/CircularProgress';
import MUIList from '@material-ui/core/List';
import MUIListItem from '@material-ui/core/ListItem';
import MUIListItemText from '@material-ui/core/ListItemText';
import MUIMenu from '@material-ui/core/Menu';
import MUIMenuItem from '@material-ui/core/MenuItem';

import ErrorDialog from '../miscellaneous/ErrorDialog';

function ChangePrintMenu (props) {

  const {
    handlePrintingChange,
    hidePreview,
    listItemPrimaryText,
    oracle_id,
    printing,
    showPreview
  } = props;
  const [anchorEl, setAnchorEl] = React.useState();
  const [availablePrintings, setAvailablePrintings] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [selectedPrintIndex, setSelectedPrintIndex] = React.useState(0);

  async function enablePrintChange (event) {
    setAnchorEl(event.currentTarget);
    try {
      setLoading(true);
      let printings = await axios.get(`https://api.scryfall.com/cards/search?order=released&q=oracleid%3A${oracle_id}&unique=prints`);
      printings = printings.data.data.map(function(print) {
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
        return print.printing === printing;
      }));
    } catch (error) {
      setErrorMessage(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  function handleMenuItemClick (index) {
    setAnchorEl(null);
    setSelectedPrintIndex(index);
    handlePrintingChange(availablePrintings[index]);
  };

  return (
    <React.Fragment>
    
      <ErrorDialog
        clear={() => setErrorMessage(null)}
        message={errorMessage}
      />

      <MUIList component="nav">
        <MUIListItem
          button
          aria-haspopup="true"
          aria-controls="lock-menu"
          onClick={enablePrintChange}
        >
          <MUIListItemText
            primary={listItemPrimaryText}
            secondary={printing}
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
              back_image={option.back_image}
              image={option.image}
              key={`printing-${index}`}
              onMouseOut={hidePreview}
              onMouseOver={showPreview}
              selected={index === selectedPrintIndex}
              onClick={() => handleMenuItemClick(index)}
            >
              {option.printing}
            </MUIMenuItem>
          ))
        }
      </MUIMenu>
    </React.Fragment>
  );
}

export default ChangePrintMenu;