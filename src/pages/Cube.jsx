import React from 'react';
import { useParams } from 'react-router-dom';
import MUICard from '@material-ui/core/Card';

import ComponentInfo from '../components/Cube Page/ComponentInfo';
import CubeInfo from '../components/Cube Page/CubeInfo';
import cubeReducer from '../functions/cube-reducer';
import CurveView from '../components/Cube Page/CurveView';
import HoverPreview from '../components/Cube Page/HoverPreview';
import ListView from '../components/Cube Page/ListView';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import ScryfallRequest from '../components/miscellaneous/ScryfallRequest';
import TableView from '../components/Cube Page/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useRequest } from '../hooks/request-hook';

const Cube = () => {

  const cubeId = useParams().cubeId;
  const authentication = React.useContext(AuthenticationContext);
  const [loading, setLoading] = React.useState(true);
  const { sendRequest } = useRequest();

  const [componentState, dispatch] = React.useReducer(cubeReducer, {
    active_component_cards: [],
    active_component_id: 'mainboard',
    active_component_name: 'Mainboard',
    active_rotation_size: undefined,
    active_component_type: 'mainboard',
    cube: null,
    displayed_cards: [],
    filter: ''
  });

  const [creator, setCreator] = React.useState(null);
  const [preview, setPreview] = React.useState({
    back_image: null,
    container_display: "none",
    image: null,
    image_display: "none",
    left: 0,
    right: undefined,
    top: 0
  });
  const [viewMode, setViewMode] = React.useState('Table View');

  const filterCardsHandler = React.useCallback(function (event) {
    dispatch({ type: 'FILTER_CARDS', value: event.target.value });
  }, []);

  const updateCubeHandler = React.useCallback(function (cube) {
    dispatch({ type: 'UPDATE_CUBE', value: cube });
  }, []);

  const switchComponentHandler = React.useCallback(function (component_id) {
    dispatch({ type: 'SWITCH_COMPONENT', value: component_id });
  }, []);

  React.useEffect(() => {
    const fetchCube = async function () {
      try {
        const cubeData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/cube/${cubeId}`, 'GET', null, {});
        updateCubeHandler(cubeData);
        const creatorData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/account/${cubeData.creator}`, 'GET', null, {});
        setCreator(creatorData);
      } catch (error) {
        console.log('Error: ' + error.message);
      }
      setLoading(false);
    };
    fetchCube();
  }, [cubeId, sendRequest, updateCubeHandler]);

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
        `${process.env.REACT_APP_BACKEND_URL}/cube/`,
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

    const hpcWidth = document.getElementById('hover-preview-container').offsetWidth;
    const windowWidth = window.screen.width;
    let left, right;
    if (event.pageX < windowWidth / 2) {
      left = event.pageX - (hpcWidth * event.pageX / windowWidth) + 'px';
      right = undefined;
    } else {
      left = undefined;
      right = windowWidth - event.pageX - hpcWidth + (hpcWidth * event.pageX / windowWidth) + 'px';
    }

    setPreview({
      ...preview,
      left,
      right,
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
    <React.Fragment>
      {loading ?
        <LoadingSpinner /> :
        <div onMouseMove={movePreview}>

          <HoverPreview
            {...preview}
          />

          {componentState.cube &&
            creator &&
            <CubeInfo creator={creator} cube={componentState.cube} />
          }

          {componentState.cube &&
            <React.Fragment>
              <ComponentInfo
                componentId={componentState.active_component_id}
                componentName={componentState.active_component_name}
                componentType={componentState.active_component_type}
                rotationSize={componentState.active_rotation_size}
                switchComponentHandler={switchComponentHandler}
                setViewMode={setViewMode}
                filterCardsHandler={filterCardsHandler}
                updateCubeHandler={updateCubeHandler}
                viewMode={viewMode}
              />
              {authentication.userId === componentState.cube.creator &&
                <MUICard>
                  <ScryfallRequest
                    buttonText="Add it!"
                    labelText={`Add a card to ${componentState.active_component_name}`}
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
      }
    </React.Fragment>
  );
}

export default Cube;