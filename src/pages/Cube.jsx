import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import CubeView from '../components/CubeView';
import HoverPreview from '../components/HoverPreview';
import Modal from '../components/Modal';
import ScryfallRequest from '../components/ScryfallRequest';
import { AuthenticationContext } from '../contexts/authentication-context';
import { useCardSort } from '../hooks/card-sort-hook';
import { useRequest } from '../hooks/request-hook';

const Cube = () => {

  const cubeId = useParams().cubeId;
  const authentication = useContext(AuthenticationContext);
  const { appendPropertiesAndSort } = useCardSort();
  const { loading, errorMessage, sendRequest, clearError } = useRequest();

  const [activeComponent, setActiveComponent] = useState(null);
  const [creator, setCreator] = useState(null);
  const [cube, setCube] = useState(null);
  const [displayedCards, setDisplayedCards] = useState(null);
  const [filter, setFilter] = useState('');
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
        setActiveComponent({
          cards: cubeData.mainboard,
          _id: 'mainboard',
          name: 'Mainboard'
        });
        setCube(cubeData);
        changeDisplayedCards(cubeData.mainboard, filter);
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
        component: activeComponent._id,
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
      setCube(updatedCube);

      if (activeComponent._id === 'mainboard') {
        setActiveComponent({
          cards: updatedCube.mainboard,
          _id: 'mainboard',
          name: 'Mainboard'
        });
        changeDisplayedCards(updatedCube.mainboard, filter);
      } else if (activeComponent._id === 'sideboard') {
        setActiveComponent({
          cards: updatedCube.sideboard,
          _id: 'sideboard',
          name: 'Sideboard'
        });
        changeDisplayedCards(updatedCube.sideboard, filter);
      } else {
        let modulesAndRotations = [...updatedCube.modules, ...updatedCube.rotations];
        const component = modulesAndRotations.find(function (cmpnt) {
          return cmpnt._id === activeComponent._id;
        });
        setActiveComponent({
          cards: component.cards,
          _id: component._id,
          name: component.name
        });
        changeDisplayedCards(component.cards, filter);
      }

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
      setCube(updatedCube);

      let component;
      if (action === 'add_module') {
        component = updatedCube.modules[updatedCube.modules.length - 1];
      } else {
        component = updatedCube.rotations[updatedCube.rotations.length - 1];
      }

      setActiveComponent({
        cards: component.cards,
        _id: component._id,
        name: component.name
      });
      changeDisplayedCards(component.cards, filter);
      closeComponentForm();

    } catch (error) {
      console.log({ 'Error': error.message });
    }
  }

  function changeComponent (event) {
    if (event.target.value === 'mainboard') {
      setActiveComponent({
        cards: cube.mainboard,
        _id: 'mainboard',
        name: 'Mainboard'
      });
      changeDisplayedCards(cube.mainboard, filter);
    } else if (event.target.value === 'sideboard') {
      setActiveComponent({
        cards: cube.sideboard,
        _id: 'sideboard',
        name: 'Sideboard'
      });
      changeDisplayedCards(cube.sideboard, filter);
    } else {
      let modulesAndRotations = [...cube.modules, ...cube.rotations];
      const component = modulesAndRotations.find(function (cmpnt) {
        return cmpnt._id === event.target.value;
      });
      setActiveComponent({
        cards: component.cards,
        _id: component._id,
        name: component.name
      });
      changeDisplayedCards(component.cards, filter);
    }
  }

  function changeDisplayedCards (unfilteredCards, filterText) {
    setDisplayedCards(appendPropertiesAndSort(unfilteredCards.filter(function (card) {
      return (
        card.name.toLowerCase().includes(filterText.toLowerCase()) ||
        card.type_line.toLowerCase().includes(filterText.toLowerCase()) ||
        card.color.toLowerCase().includes(filterText.toLowerCase())
      );
    })));
  }

  function changeFilter (event) {
    setFilter(event.target.value);
    changeDisplayedCards(activeComponent.cards, event.target.value);
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

  function closeComponentForm () {
    setShowComponentForm(false);
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
      {creator && creator.avatar &&
        <div className="circle-avatar-container">
          <img alt="avatar" className="avatar" src={creator.avatar} />
        </div>
      }
      {creator &&
        <h2>Creator: <Link to={`/account/${creator._id}`}>{creator.name}</Link></h2>
      }
      {cube &&
        <React.Fragment>
          <h2>{cube.name}</h2>
          <p>{cube.description}</p>
        </React.Fragment>
      }
      {cube && activeComponent && displayedCards &&
        <React.Fragment>
          <h3>{activeComponent.name}</h3>
          <select onChange={changeComponent} value={activeComponent._id}>
            <option value="mainboard">Mainboard</option>
            <option value="sideboard">Sideboard</option>
            {
              cube.modules.map(function (module) {
                return <option key={module._id} value={module._id}>{module.name}</option>
              })
            }
            {
              cube.rotations.map(function (rotation) {
                return <option key={rotation._id} value={rotation._id}>{rotation.name}</option>
              })
            }
          </select>
          <h3>View Mode</h3>
          <select onChange={changeViewMode} value={viewMode}>
            <option value="Curve View">Curve View</option>
            <option value="List View">List View</option>
            <option value="Table View">Table View</option>
          </select>
          {authentication.userId === cube.creator &&
            <React.Fragment>
              <ScryfallRequest
                action="http://localhost:5000/api/cube/"
                buttonText="Add it!"
                method="PATCH"
                onSubmit={addCard}
                searchPlaceholderText={`Search for a card to add to ${activeComponent.name}`}
              />
              <button onClick={openComponentForm}>Create a Module or Rotation</button>
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
          <input
            autoComplete="off"
            onChange={changeFilter}
            placeholder="Filter cards by keywords, name or type"
            type="text"
            value={filter}
          />
          <CubeView
            activeComponent={activeComponent}
            displayedCards={displayedCards}
            hidePreview={hidePreview}
            showPreview={showPreview}
            viewMode={viewMode}
          />
        </React.Fragment>
      }
    </div>
  );
}

export default Cube;