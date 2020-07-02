import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Card as MUICard
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ComponentInfo from '../components/ComponentInfo';
import CubeInfo from '../components/CubeInfo';
import CurveView from '../components/CurveView';
import HoverPreview from '../components/HoverPreview';
import ListView from '../components/ListView';
import ScryfallRequest from '../components/ScryfallRequest';
import TableView from '../components/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCube } from '../hooks/cube-hook';
import { useRequest } from '../hooks/request-hook';

const useStyles = makeStyles({
  basicCard: {
    margin: '1rem',
    padding: '8px'
  }
})

const Cube = () => {

  const cubeId = useParams().cubeId;
  const authentication = useContext(AuthenticationContext);
  const classes = useStyles();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [componentState, dispatch] = useReducer(useCube, {
    active_component_cards: [],
    active_component_id: 'mainboard',
    active_component_name: 'Mainboard',
    active_rotation_size: undefined,
    active_component_type: 'mainboard',
    cube: null,
    displayed_cards: [],
    filter: ''
  });

  function filterCardsHandler (event) {
    dispatch({ type: 'FILTER_CARDS', value: event.target.value });
  }

  function updateCubeHandler (cube) {
    dispatch({ type: 'UPDATE_CUBE', value: cube });
  }

  function switchComponentHandler (component_id) {
    dispatch({ type: 'SWITCH_COMPONENT', value: component_id })
  }

  const [creator, setCreator] = useState(null);
  const [preview, setPreview] = useState({
    back_image: null,
    container_display: "none",
    image: null,
    image_display: "none",
    left: 0,
    top: 0
  });
  const [viewMode, setViewMode] = useState('Table View');

  useEffect(() => {
    const fetchCube = async function () {
      try {
        const cubeData = await sendRequest('http://localhost:5000/api/cube/' + cubeId, 'GET', null, {});
        updateCubeHandler(cubeData);
        const creatorData = await sendRequest('http://localhost:5000/api/account/' + cubeData.creator, 'GET', null, {});
        setCreator(creatorData);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
    };
    fetchCube();
  }, [cubeId]);

  async function addCard (chosenCard) {
    delete chosenCard.art_crop;
    try {
      const cardData = JSON.stringify({
        ...chosenCard,
        action: 'add_card',
        component: componentState.active_component_id,
        cube_id: cubeId
      });

      const updatedCube = await sendRequest(
        'http://localhost:5000/api/cube/',
        'PATCH',
        cardData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      updateCubeHandler(updatedCube);

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  function changeComponent (event) {
    switchComponentHandler(event.target.value);
  }

  function changeViewMode (event) {
    setViewMode(event.target.value);
  }

  function hidePreview () {
    setPreview({
      ...preview,
      back_image: null,
      container_display: "none",
      image: null,
      image_display: "none"
    });
  }

  function movePreview (event) {
    setPreview({
      ...preview,
      left: event.pageX + 10 + "px",
      top: event.pageY + 12 + "px"
    });
  }

  function showPreview (event) {
    setPreview({
      ...preview,
      back_image: event.target.getAttribute('back_image'),
      container_display: "block",
      image: event.target.getAttribute('image'),
      image_display: "inline"
    });
  }

  return (
    <div onMouseMove={movePreview}>

      <HoverPreview
        {...preview}
      />

      {componentState.cube &&
        creator &&
        <CubeInfo creator={creator} cube={componentState.cube} />
      }

      {componentState.cube &&
        componentState.active_component_id &&
        <React.Fragment>
          <ComponentInfo
            componentState={componentState}
            changeComponent={changeComponent}
            changeViewMode={changeViewMode}
            filterCardsHandler={filterCardsHandler}
            updateCubeHandler={updateCubeHandler}
            viewMode={viewMode}
          />
          {authentication.userId === componentState.cube.creator &&
            <MUICard className={classes.basicCard}>
              <ScryfallRequest
                action="http://localhost:5000/api/cube/"
                buttonText="Add it!"
                componentState={componentState}
                labelText={`Add a card to ${componentState.active_component_name}`}
                method="PATCH"
                onSubmit={addCard}
              />
            </MUICard>
          }
          {viewMode === 'Curve View' &&
            <CurveView
              componentState={componentState}
              hidePreview={hidePreview}
              showPreview={showPreview}
            />
          }
          {viewMode === 'List View' &&
            <ListView
              componentState={componentState}
              hidePreview={hidePreview}
              showPreview={showPreview}
              updateCubeHandler={updateCubeHandler}
            />
          }
          {viewMode === 'Table View' &&
            <TableView
              componentState={componentState}
              hidePreview={hidePreview}
              showPreview={showPreview}
            />
          }
        </React.Fragment>
      }
    </div>
  );
}

export default Cube;