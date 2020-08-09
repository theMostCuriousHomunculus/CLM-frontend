import React from 'react';
import MUICard from '@material-ui/core/Card';
import MUITable from '@material-ui/core/Table';
import MUITableBody from '@material-ui/core/TableBody';
import MUITableCell from '@material-ui/core/TableCell';
import MUITableContainer from '@material-ui/core/TableContainer';
import MUITableHead from '@material-ui/core/TableHead';
import MUITableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import alphabeticalSort from '../functions/alphabetical-sort';
import ColorCheckboxes from './ColorCheckboxes';
import PrintSelector from './PrintSelector';
import theme from '../theme';
import { AuthenticationContext } from '../contexts/authentication-context';
import { monoColors, multiColors } from '../constants/color-objects';
import { ReactComponent as TCGPlayerLogo } from '../images/tcgplayer-logo-full-color.svg';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  body: {
    '& *': {
      fontSize: '1.6rem'
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
  table: {
    minWidth: 650
  },
  tableCell: {
    height: '100%',
    paddingBottom: 4,
    paddingTop: 4
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
            {alphabeticalSort(props.componentState.displayed_cards).map(function (card) {
              return (
                <MUITableRow key={card._id}>
                  <MUITableCell
                    back_image={card.back_image}
                    className={classes.tableCell}
                    image={card.image}
                    onMouseOut={props.hidePreview}
                    onMouseOver={props.showPreview}
                    style={{ cursor: 'default' }}
                  >
                    {card.name}
                  </MUITableCell>
                  <MUITableCell className={classes.tableCell}>
                    {props.componentState.cube.creator === authentication.userId ?
                      <ColorCheckboxes
                        active_component_id={props.componentState.active_component_id}
                        color_identity={card.color_identity}
                        card_id={card._id}
                        cube_id={props.componentState.cube._id}
                        updateCubeHandler={props.updateCubeHandler}
                      />
                      :
                      <React.Fragment>
                        {[...monoColors, ...multiColors].find(function(color) {
                          return color.color_identity === card.color_identity.toString();
                        }).name}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell className={classes.tableCell}>
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
                  <MUITableCell className={classes.tableCell}>
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
                  <MUITableCell className={classes.tableCell}>
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
                  <MUITableCell className={classes.tableCell}>
                    {props.componentState.cube.creator === authentication.userId ?
                      <PrintSelector
                        card={card}
                        cube_id={props.componentState.cube._id}
                        updateCubeHandler={props.updateCubeHandler}
                      /> :
                      <React.Fragment>
                        {card.printing}
                      </React.Fragment>
                    }
                  </MUITableCell>
                  <MUITableCell className={classes.tableCell}>
                    <a href={card.purchase_link}>
                      <TCGPlayerLogo />
                    </a>
                  </MUITableCell>
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