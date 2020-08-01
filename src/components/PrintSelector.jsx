import React from 'react';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const PrintSelector = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const { sendRequest } = useRequest();

  const [disabled, setDisabled] = React.useState(true);
  const [icon, setIcon] = React.useState(
    <i
      className="fas fa-lock"
      onClick={enablePrintChange}
    ></i>
  );
  const [printOptions, setPrintOptions] = React.useState([
    <option
      data-back_image={props.card.back_image}
      data-image={props.card.image}
      data-mtgo_id={props.card.mtgo_id}
      data-purchase_link={props.card.purchase_link}
      key={`option-${props.card._id}`}
      value={props.card.printing}
    >
      {props.card.printing}
    </option>
  ]);

  function disablePrintChange () {
    setIcon(
      <i
        className="fas fa-lock"
        onClick={enablePrintChange}
      ></i>
    );
    setDisabled(true);
  }

  async function enablePrintChange () {

    setIcon(
      <i
        className="fas fa-lock-open"
        onClick={disablePrintChange}
      ></i>
    );
    setDisabled(false);

    const prints_search_uri = document.getElementById(`print-selector-${props.card._id}`).getAttribute("data-prints_search_uri");

    try {
      let printings = await sendRequest(prints_search_uri);
      const prints = printings.data.map(function(print, index) {
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
            data-mtgo_id={print.mtgo_id}
            data-purchase_link={print.purchase_uris.tcgplayer.split("&")[0]}
            key={`print-${index}`}
            value={print.set_name + " - " + print.collector_number}
          >
            {print.set_name + " - " + print.collector_number}
          </option>
        );
      });
      setPrintOptions(prints);
      document.getElementById(`print-selector-${props.card._id}`).focus();
    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  async function submitPrintChange (event) {
    disablePrintChange();

    const action = 'edit_card';
    const card_id = event.target.getAttribute('data-card_id');
    const selectedPrinting = event.target.options[event.target.selectedIndex];

    const cardChanges = JSON.stringify({
      action,
      back_image: selectedPrinting.getAttribute('data-back_image'),
      card_id,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      image: selectedPrinting.getAttribute('data-image'),
      mtgo_id: selectedPrinting.getAttribute('data-mtgo_id'),
      printing: selectedPrinting.value,
      purchase_link: selectedPrinting.getAttribute('data-purchase_link')
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
      'PATCH',
      cardChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  return(
    <React.Fragment>
      {icon}
      <select
        data-card_id={props.card._id}
        data-prints_search_uri={`https://api.scryfall.com/cards/search?q=oracleid=${props.card.oracle_id}&unique=prints`}
        disabled={disabled}
        id={`print-selector-${props.card._id}`}
        onBlur={disablePrintChange}
        onChange={submitPrintChange}
        value={props.card.printing}
      >
        {printOptions.map(function (printOption) {
          return printOption;
        })}
      </select>
    </React.Fragment>
  );
}

export default PrintSelector;