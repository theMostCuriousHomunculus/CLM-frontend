import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import populateScryfallData from '../functions/populate-scryfall-data';
import useRequest from '../hooks/request-hook';
import Cube from '../pages/Cube';

export const CubeContext = createContext({
  loading: false,
  activeComponentState: {
    _id: 'mainboard',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  },
  cubeQuery: '',
  cubeState: {
    _id: null,
    creator: {
      _id: null,
      avatar: null,
      name: null
    },
    description: null,
    mainboard: [],
    modules: [],
    name: null,
    rotations: [],
    sideboard: []
  },
  displayState: {
    activeComponentID: null,
    filter: ''
  },
  setCubeState: () => null,
  setDisplayState: () => null,
  addCardToCube: () => null,
  createModule: () => null,
  createRotation: () => null,
  deleteCard: () => null,
  deleteModule: () => null,
  deleteRotation: () => null,
  editCard: () => null,
  editCube: () => null,
  editModule: () => null,
  editRotation: () => null,
  fetchCubeByID: () => null
});

export default function ContextualizedCubePage () {

  const [activeComponentState, setActiveComponentState] = React.useState({
    _id: 'mainboard',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  });
  const [cubeState, setCubeState] = React.useState({
    _id: useParams().cubeId,
    creator: {
      _id: null,
      avatar: null,
      name: '...'
    },
    description: '',
    mainboard: [],
    modules: [],
    name: '',
    rotations: [],
    sideboard: []
  });
  const [displayState, setDisplayState] = React.useState({
    activeComponentID: 'mainboard',
    filter: ''
  });
  const cardQuery = `
    _id
    cmc
    color_identity
    name
    oracle_id
    scryfall_id
    type_line
  `;
  const cubeQuery = `
    _id
    creator {
      _id
      avatar
      name
    }
    description
    mainboard {
      ${cardQuery}
    }
    modules {
      _id
      cards {
        ${cardQuery}
      }
      name
    }
    name
    rotations {
      _id
      cards {
        ${cardQuery}
      }
      name
      size
    }
    sideboard {
      ${cardQuery}
    }
  `;
  const { loading, sendRequest } = useRequest();

  const filterCards = React.useCallback((cards, text) => cards.filter(card => {
    const wordArray = text.split(" ");
    return (
      wordArray.every(word => (
        card.keywords.map(keyword => keyword.toLowerCase()).includes(word.toLowerCase()) ||
        card.name.toLowerCase().includes(word.toLowerCase()) ||
        card.type_line.toLowerCase().includes(word.toLowerCase())
      ))
    );
  }), []);

  React.useEffect(() => {
    const state = { _id: displayState.activeComponentID };

    if (state._id === 'sideboard') {
      state.displayedCards = filterCards(cubeState.sideboard, displayState.filter);
      state.name = 'Sideboard';
    } else if (cubeState.modules.find(module => module._id === state._id)) {
      const module = cubeState.modules.find(mdl => mdl._id === state._id);
      state.displayedCards = filterCards(module.cards, displayState.filter);
      state.name = module.name;
    } else if (cubeState.rotations.find(rotation => rotation._id === state._id)) {
      const rotation = cubeState.rotations.find(rtn => rtn._id === state._id);
      state.displayedCards = filterCards(rotation.cards, displayState.filter);
      state.maxSize = rotation.cards.length;
      state.name = rotation.name;
      state.size = rotation.size;
    } else {
      state._id = 'mainboard';
      state.displayedCards = filterCards(cubeState.mainboard, displayState.filter);
      state.name = 'Mainboard';
    }

    setActiveComponentState(state);
  }, [cubeState, displayState, filterCards]);

  const addCardToCube = React.useCallback(async function ({
    // back_image,
    cmc,
    // collector_number,
    color_identity,
    // image,
    // keywords,
    // mana_cost,
    // mtgo_id,
    name,
    oracle_id,
    scryfall_id,
    // set,
    // set_name,
    // tcgplayer_id,
    type_line
  }) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'addCardToCube',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${activeComponentState._id}",
                  card: {
                    cmc: ${cmc},
                    color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    scryfall_id: "${scryfall_id}",
                    type_line: "${type_line}"
                  }
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const createModule = React.useCallback(async function (name, setNameInput, setSizeInput, toggleOpen) {
    await sendRequest({
      callback: (data) => {
        setDisplayState(prevState => ({
          ...prevState,
          activeComponentID: data.modules[data.modules.length - 1]._id
        }));
        setNameInput(data.modules[data.modules.length - 1].name);
        setSizeInput(null);
        toggleOpen();
      },
      headers: {
        CubeID: cubeState._id
      },
      operation: 'createModule',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(name: "${name}") {
                modules {
                  _id
                  name
                }
              }
            }
          `
        }
      }
    });
  }, [cubeState._id, sendRequest]);

  const createRotation = React.useCallback(async function (name, setNameInput, setSizeInput, toggleOpen) {
    await sendRequest({
      callback: (data) => {
        setDisplayState(prevState => ({
          ...prevState,
          activeComponentID: data.rotations[data.rotations.length - 1]._id
        }));
        setNameInput(data.rotations[data.rotations.length - 1].name);
        setSizeInput(data.rotations[data.rotations.length - 1].size);
        toggleOpen();
      },
      headers: { CubeID: cubeState._id },
      operation: 'createRotation',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(name: "${name}") {
                rotations {
                  _id
                  name
                  size
                }
              }
            }
          `
        }
      }
    });
  }, [cubeState._id, sendRequest]);

  const deleteCard = React.useCallback(async function (cardID, destinationID) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'deleteCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  cardID: "${cardID}",
                  ${destinationID ? 'destinationID: "' + destinationID + '",' : ''}
                  originID: "${activeComponentState._id}"
                }
              )
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const deleteModule = React.useCallback(async function (setNameInput) {
    await sendRequest({
      callback: () => {
        setNameInput('Mainboard');
        setDisplayState(prevState => ({
          ...prevState,
          activeComponentID: 'mainboard'
        }));
      },
      headers: { CubeID: cubeState._id },
      operation: 'deleteModule',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(_id: "${activeComponentState._id}")
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const deleteRotation = React.useCallback(async function (setNameInput, setSizeInput) {
    await sendRequest({
      callback: () => {
        setNameInput('Mainboard');
        setSizeInput(null);
        setDisplayState(prevState => ({
          ...prevState,
          activeComponentID: 'mainboard'
        }));
      },
      headers: { CubeID: cubeState._id },
      operation: 'deleteRotation',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(_id: "${activeComponentState._id}")
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const editCard = React.useCallback(async function (changes) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'editCard',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  componentID: "${activeComponentState._id}",
                  ${changes}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const editCube = React.useCallback(async function (description, name) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'editCube',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  description: "${description}",
                  name: "${name}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [cubeState._id, sendRequest]);

  const editModule = React.useCallback(async function (name) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'editModule',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  moduleID: "${activeComponentState._id}",
                  name: "${name}"
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest])

  const editRotation = React.useCallback(async function (name, size) {
    await sendRequest({
      headers: { CubeID: cubeState._id },
      operation: 'editRotation',
      get body() {
        return {
          query: `
            mutation {
              ${this.operation}(
                input: {
                  rotationID: "${activeComponentState._id}",
                  name: "${name}",
                  size: ${size}
                }
              ) {
                _id
              }
            }
          `
        }
      }
    });
  }, [activeComponentState._id, cubeState._id, sendRequest]);

  const fetchCubeByID = React.useCallback(async function () {
    await sendRequest({
      callback: async (data) => {

        const allCards = [];

        for (const card of data.mainboard) {
          if (!allCards.find(item => item.id === card.scryfall_id)) allCards.push({ id: card.scryfall_id });
        }

        for (const card of data.sideboard) {
          if (!allCards.find(item => item.id === card.scryfall_id)) allCards.push({ id: card.scryfall_id });
        }

        for (const module of data.modules) {
          for (const card of module) {
            if (!allCards.find(item => item.id === card.scryfall_id)) allCards.push({ id: card.scryfall_id });
          }
        }

        for (const rotation of data.rotations) {
          for (const card of rotation) {
            if (!allCards.find(item => item.id === card.scryfall_id)) allCards.push({ id: card.scryfall_id });
          }
        }

        // according to scryfall api documentation, "A maximum of 75 card references may be submitted per request."
        const numberOfScryfallRequests = Math.ceil(allCards.length / 75);
        const scryfallRequestArrays = [];

        for (let requestNumber = 0; requestNumber < numberOfScryfallRequests; requestNumber++) {
          scryfallRequestArrays.push(allCards.splice(0, 75));
        }

        for (let request of scryfallRequestArrays) {
          await sendRequest({
            body: {
              identifiers: request
            },
            callback: async scryfallResponse => {
              for (let scryfallCardObject of scryfallResponse) {
                await populateScryfallData(data, scryfallCardObject);
              }
            },
            url: 'https://api.scryfall.com/cards/collection'
          });
        }
        setCubeState(data);
      },
      headers: { CubeID: cubeState._id },
      load: true,
      operation: 'fetchCubeByID',
      get body() {
        return {
          query: `
            query {
              ${this.operation} {
                ${cubeQuery}
              }
            }
          `
        }
      }
    });
  }, [cubeQuery, cubeState._id, sendRequest]);

  return (
    <CubeContext.Provider
      value={{
        loading,
        cubeQuery,
        activeComponentState,
        cubeState,
        displayState,
        setCubeState,
        setDisplayState,
        addCardToCube,
        createModule,
        createRotation,
        deleteCard,
        deleteModule,
        deleteRotation,
        editCard,
        editCube,
        editModule,
        editRotation,
        fetchCubeByID
      }}
    >
      <Cube />
    </CubeContext.Provider>
  );
}