import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';

import ComponentInfo from '../components/ComponentInfo';
import CubeInfo from '../components/CubeInfo';
import CurveView from '../components/CurveView';
import HoverPreview from '../components/HoverPreview';
import ListView from '../components/ListView';
import Modal from '../components/Modal';
import ScryfallRequest from '../components/ScryfallRequest';
import TableView from '../components/TableView';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCube } from '../hooks/cube-hook';
import { useRequest } from '../hooks/request-hook';

const Cube = () => {

  const cubeId = useParams().cubeId;
  const authentication = useContext(AuthenticationContext);
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
  const [showComponentForm, setShowComponentForm] = useState(false);
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

  async function addCard () {

    const cardSearch = document.getElementById('card-search');
    const cardSearchResults = document.getElementById('card-search-results');
    const chosenCard = cardSearchResults.options.namedItem(cardSearch.value);
    const printing = document.getElementById('printing');
    const chosenPrinting = printing.options[printing.selectedIndex];

    try {
      const cardData = JSON.stringify({
        action: 'add_card',
        back_image: chosenPrinting.getAttribute('data-back_image'),
        color_identity: JSON.parse(chosenCard.getAttribute('data-color_identity')),
        component: componentState.active_component_id,
        cmc: chosenCard.getAttribute('data-cmc'),
        cube_id: cubeId,
        image: chosenPrinting.getAttribute('data-image'),
        keywords: JSON.parse(chosenCard.getAttribute('data-keywords')),
        loyalty: chosenCard.getAttribute('data-loyalty'),
        mana_cost: chosenCard.getAttribute('data-mana_cost'),
        name: chosenCard.value,
        oracle_id: chosenCard.getAttribute('data-oracle_id'),
        power: chosenCard.getAttribute('data-power'),
        printing: printing.value,
        purchase_link: chosenPrinting.getAttribute('data-purchase_link'),
        toughness: chosenCard.getAttribute('data-toughness'),
        type_line: chosenCard.getAttribute('data-type_line')
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

  async function addComponent (event) {
    event.preventDefault();
    const action = document.getElementById('module').checked ? 'add_module' : 'add_rotation';
    const name = document.getElementById('component-name').value;

    const componentData = JSON.stringify({
      action: action,
      cube_id: cubeId,
      name: name
    });

    try {
      const updatedCube = await sendRequest(
        'http://localhost:5000/api/cube/',
        'PATCH',
        componentData,
        {
          Authorization: 'Bearer ' + authentication.token,
          'Content-Type': 'application/json'
        }
      );
      updateCubeHandler(updatedCube);

      let component_id;
      if (action === 'add_module') {
        component_id = updatedCube.modules[updatedCube.modules.length - 1]._id;
      } else {
        component_id = updatedCube.rotations[updatedCube.rotations.length - 1]._id;
      }

      switchComponentHandler(component_id);
      closeComponentForm();

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

  function closeComponentForm () {
    setShowComponentForm(false);
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

  function openComponentForm () {
    setShowComponentForm(true);
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
            openComponentForm={openComponentForm}
            updateCubeHandler={updateCubeHandler}
            viewMode={viewMode}
          />
          {authentication.userId === componentState.cube.creator &&
            <React.Fragment>
              <ScryfallRequest
                action="http://localhost:5000/api/cube/"
                buttonText="Add it!"
                componentState={componentState}
                method="PATCH"
                onSubmit={addCard}
                searchPlaceholderText={`Search for a card to add to ${componentState.active_component_name}`}
              />
              <Modal
                action="http://localhost:5000/api/cube"
                contentClass="create-cube-component__modal-content"
                footerClass="create-cube-component__modal-acitons"
                footer={<button onClick={closeComponentForm}>Cancel</button>}
                header="Create a Module or Rotation"
                method="PATCH"
                onCancel={closeComponentForm}
                onSubmit={addComponent}
                show={showComponentForm}
              >
                <input
                  autoComplete="off"
                  id="component-name"
                  name="name"
                  placeholder="Component Name"
                  required={true}
                  type="text"
                />
                <div>
                  <input
                    id="module"
                    name="action"
                    required
                    type="radio"
                    value="add_module"
                  />
                  <label htmlFor="module">Create a Module</label>
                </div>
                <div>
                  <input
                    id="rotation"
                    name="action"
                    required
                    type="radio"
                    value="add_rotation"
                  />
                  <label htmlFor="rotation">Create a Rotation</label>
                </div>
                <button>Create!</button>
              </Modal>
            </React.Fragment>
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