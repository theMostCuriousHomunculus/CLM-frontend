import React, { useContext, useState } from 'react';
import {
  Button as MUIButton,
  Card as MUICard,
  CardActions as MUICardActions,
  CardContent as MUICardContent,
  CardHeader as MUICardHeader,
  Typography as MUITypography
} from '@material-ui/core';
import { DeleteForever as DeleteForeverIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  basicCard: {
    margin: '1rem'
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  flex: {
    display: 'flex'
  },
  marginRight: {
    marginRight: '1rem'
  },
  numberWidth: {
    width: '6rem'
  },
  remainingWidth: {
    flexGrow: 1,
    width: 'auto'
  },
  warningButton: {
    backgroundColor: '#ff0000',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#df2000'
    }
  }
});

const ComponentInfo = (props) => {

  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  async function deleteComponent () {
    const action = props.componentState.active_component_type === 'module' ? 'delete_module' : 'delete_rotation';
    const deleteInfo = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id
    });
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      deleteInfo,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  async function submitComponentChanges () {
    const action = props.componentState.active_component_type === 'module' ? 'edit_module' : 'edit_rotation';
    const componentChanges = JSON.stringify({
      action: action,
      component: props.componentState.active_component_id,
      cube_id: props.componentState.cube._id,
      name: props.componentState.active_component_name,
      size: props.componentState.active_rotation_size
    });
    const updatedCube = await sendRequest(
      'http://localhost:5000/api/cube',
      'PATCH',
      componentChanges,
      {
        Authorization: 'Bearer ' + authentication.token,
        'Content-Type': 'application/json'
      }
    );
    props.updateCubeHandler(updatedCube);
  }

  return (
    <MUICard className={classes.basicCard}>
      <MUICardHeader
        title={<MUITypography variant="h3">Component:</MUITypography>}
        subheader={authentication.userId === props.componentState.cube.creator &&
          props.componentState.active_component_type !== 'mainboard' &&
          props.componentState.active_component_type !== 'sideboard' ?
          <input
            autoComplete="off"
            onBlur={submitComponentChanges}
            // onChange={props.changeComponentName}
            type="text"
            value={props.componentState.active_component_name}
          /> :
          <MUITypography variant="h4">{props.componentState.active_component_name}</MUITypography>
        }
      />
      <MUICardContent>
        <div className={classes.flex}>
          <label className={classes.marginRight} htmlFor="view-selector">View Mode:</label>
          <select className={classes.remainingWidth} id="view-selector" onChange={props.changeViewMode} value={props.viewMode}>
            <option value="Curve View">Curve View</option>
            <option value="List View">List View</option>
            <option value="Table View">Table View</option>
          </select>
        </div>
        <div className={classes.flex}>
          <label className={classes.marginRight} htmlFor="search-filter">Search Filter:</label>
          <input
            autoComplete="off"
            className={classes.remainingWidth}
            id="search-filter"
            onChange={props.filterCardsHandler}
            placeholder="Filter cards by keywords, name or type"
            type="text"
            value={props.componentState.filter}
          />
        </div>
        <div>Matches: <strong>{props.componentState.displayed_cards.length}</strong></div>
        {authentication.userId === props.componentState.cube.creator &&
          props.componentState.active_component_type === 'rotation' &&
          <React.Fragment>
            <label htmlFor="rotation-size">Rotation Size:</label>
            <input
              className={classes.numberWidth}
              min="0"
              onBlur={submitComponentChanges}
              // onChange={props.changeRotationSize}
              step="1"
              type="number"
              value={props.componentState.active_rotation_size}
            />
          </React.Fragment>
        }
        {authentication.userId !== props.componentState.cube.creator &&
          props.componentState.active_component_type === 'rotation' &&
          <React.Fragment>
            <span>Rotation Size: {props.componentState.active_rotation_size}</span>
          </React.Fragment>
        }
      </MUICardContent>
      <MUICardActions className={classes.cardActions}>
        <span>
          <label className={classes.marginRight} htmlFor="component-selector">Switch Component:</label>
          <select id="component-selector" onChange={props.changeComponent} value={props.componentState.active_component_id}>
            <option value="mainboard">Mainboard</option>
            <option value="sideboard">Sideboard</option>
            {
              props.componentState.cube.modules.map(function (module) {
                return <option key={module._id} value={module._id}>{module.name}</option>
              })
            }
            {
              props.componentState.cube.rotations.map(function (rotation) {
                return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>
              })
            }
          </select>
        </span>
        {authentication.userId === props.componentState.cube.creator &&
          <MUIButton color="primary" onClick={props.openComponentForm} variant="contained">Create a Module or Rotation</MUIButton>
        }
        {authentication.userId === props.componentState.cube.creator &&
          props.componentState.active_component_type !== 'mainboard' &&
          props.componentState.active_component_type !== 'sideboard' &&
          <MUIButton
            className={classes.warningButton}
            onClick={deleteComponent}
            startIcon={<DeleteForeverIcon />}
            variant="contained"
          >
            Delete this {props.componentState.active_component_type === 'module' ? 'Module' : 'Rotation'}
          </MUIButton>
        }
      </MUICardActions>
    </MUICard>
  );
}

export default ComponentInfo;