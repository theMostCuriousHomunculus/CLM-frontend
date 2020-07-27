import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUICheckbox from '@material-ui/core/Checkbox';
import MUIGrid from '@material-ui/core/Grid';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import PrintSelector from './PrintSelector';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';
import theme from '../theme';

const useStyles = makeStyles({
  body: {
    '& *': {
      fontSize: '1.6rem'
    }
  },
  colorCheckbox: {
    padding: 0,
    '& .MuiIconButton-label': {
      height: 30,
      width: 30
    },
    '& input': {
      height: 30,
      width: 30
    },
    '& svg': {
      height: 30,
      width: 30
    }
  },
  container: {
    maxHeight: '80vh'
  },
  head: {
    '& *': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.secondary.main,
      fontSize: '2.4rem'
    }
  },
  manaSymbol: {
    height: 30,
    width: 30
  },
  table: {
    minWidth: 650
  }
});

const ListView = (props) => {

  const authentication = React.useContext(AuthenticationContext);
  const classes = useStyles();
  const { sendRequest } = useRequest();

  async function moveDeleteCard (event) {
    const action = 'move_or_delete_card';
    const card_id = event.target.getAttribute('data-card_id');
    const destination = event.target.options[event.target.selectedIndex].value;
    const moveInfo = JSON.stringify({
      action,
      card_id,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      destination
    });
    const updatedCube = await sendRequest(
      `${process.env.REACT_APP_BACKEND_URL}/cube`,
      'PATCH',
      moveInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  async function submitCardChange (event) {
    const action = 'edit_card';
    const card_id = event.target.getAttribute('data-card_id');
    const property_name = event.target.getAttribute('name');
    let cardChanges = {
      action,
      card_id,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id
    };
    cardChanges[property_name] = event.target.value;
    cardChanges = JSON.stringify(cardChanges);
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

  async function submitColorIdentityChange (event) {
    let target = event.target.tagName === "path" ? event.target.parentNode.previousElementSibling : event.target.previousElementSibling;
    // this is kind of hacky but it works.  eventually i should break out checkboxes into their own components and use state rather than props to determine if a checkbox is checked
    target.checked = !target.checked;
    const action = 'edit_card';
    const card_id = target.getAttribute('data-card_id');
    const color_checkboxes = document.getElementsByClassName(target.getAttribute('class'));
    let color_identity = [];

    for (let checkbox of color_checkboxes) {
      if (checkbox.checked) {
        color_identity.push(checkbox.value);
      }
    }

    try {

      const cardChanges = JSON.stringify({
        action,
        card_id,
        color_identity: color_identity.sort(),
        component: props.componentState.active_component_id,
        cube_id: props.componentState.cube._id
      });
      const updatedCube = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/cube/`,
        'PATCH',
        cardChanges,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      props.updateCubeHandler(updatedCube);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  const colorSVGMap = new Map([
    ["W", "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/8e/W.svg?version=d74ba6b898f8815799b1506eb06fdf74"],
    ["U", "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/9/9f/U.svg?version=f798d6a151a43adc05e23e534adea262"],
    ["B", "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/2/2f/B.svg?version=ce85e9f6be68b450719ddd2f2ad08548"],
    ["R", "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/87/R.svg?version=60170f319a53b4c3410c43cdbb95699f"],
    ["G", "https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/8/88/G.svg?version=cf85f35170391f8fbeb037dc18cc3c50"]
  ]);

  return (
    <MUICard>
      <MUITableContainer className={classes.container}>
        <MUITable stickyHeader className={classes.table}>
          <MUITableHead className={classes.head}>
            <MUITableRow>
              <MUITableCell>Card Name</MUITableCell>
              <MUITableCell>Color Identity</MUITableCell>
              <MUITableCell>CMC</MUITableCell>
              <MUITableCell>Card Type</MUITableCell>
              <MUITableCell>Move / Delete</MUITableCell>
              <MUITableCell>Printing</MUITableCell>
              <MUITableCell>Purchase</MUITableCell>
            </MUITableRow>
          </MUITableHead>
          <MUITableBody className={classes.body}>
            {props.componentState.displayed_cards.map(function (card) {
              return (
                <MUITableRow key={card._id}>
                  <MUITableCell
                    back_image={card.back_image}
                    image={card.image}
                    key={card._id}
                    onMouseOut={props.hidePreview}
                    onMouseOver={props.showPreview}
                  >
                    {card.name}
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <MUIGrid container justify="space-around">
                        {["W", "U", "B", "R", "G"].map(function (color) {
                          return (
                            <MUIGrid item key={color} style={{ alignItems: "center", display: "flex", justifyContent: "center" }} xs={4}>
                              <MUICheckbox
                                checked={card.color_identity.includes(color) ? true : false}
                                className={classes.colorCheckbox}
                                color="primary"
                                inputProps={{
                                  className: `color-indicator-${card._id}`,
                                  "data-card_id": card._id,
                                  name: "color_identity[]"
                                }}
                                onClick={submitColorIdentityChange}
                                value={color}
                              />
                              <label style={{ height: 30, width: 30 }}>
                                <img alt={color} className={classes.manaSymbol} src={colorSVGMap.get(color)}></img>
                              </label>
                            </MUIGrid>
                          );
                        })}
                      </MUIGrid> :
                      <React.Fragment>
                        {card.color}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <input
                        data-card_id={card._id}
                        max="16"
                        min="0"
                        name="cmc"
                        onChange={submitCardChange}
                        step="1"
                        type="number"
                        value={card.cmc}
                      /> :
                      <React.Fragment>
                        {card.cmc}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <input
                        data-card_id={card._id}
                        name="type_line"
                        onChange={submitCardChange}
                        type="text"
                        value={card.type_line}
                      /> :
                      <React.Fragment>
                        {card.type_line}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <select
                        data-card_id={card._id}
                        onChange={moveDeleteCard}
                        value={props.componentState.active_component_id}
                      >
                        <option value='mainboard'>Mainboard</option>
                        <option value='sideboard'>Sideboard</option>
                        {props.componentState.cube.modules.map(function (module) {
                          return <option key={module._id} value={module._id}>{module.name}</option>;
                        })}
                        {props.componentState.cube.rotations.map(function (rotation) {
                          return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>;
                        })}
                        <option value='delete'>Delete From Cube</option>
                      </select> :
                      <React.Fragment>
                        {props.componentState.active_component_name}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell>
                    {props.componentState.cube.creator === authentication.userId ?
                      <PrintSelector
                        card={card}
                        componentState={props.componentState}
                        updateCubeHandler={props.updateCubeHandler}
                      /> :
                      <React.Fragment>
                        {card.printing}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell><a href={card.purchase_link}><img alt="tcgplayer-logo" src="https://tcgplayer-marketing.s3.amazonaws.com/web/svg-embeds/logos/tcgplayer-logo-full-color.svg"></img></a></MUITableCell>
                </MUITableRow>
              );
            })}
          </MUITableBody>
        </MUITable>
      </MUITableContainer>
    </MUICard>
  );
}

export default ListView;