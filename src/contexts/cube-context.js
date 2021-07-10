import React, { createContext } from 'react';
import { useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import Cube from '../pages/Cube';

export const CubeContext = createContext({
  loading: false,
  activeComponentState: {
    _id: null,
    displayedCards: [],
    maxSize: null,
    name: null,
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
    filter: null
  },
  setCubeState: () => null,
  setDisplayState: () => null,
  addCardToCube: () => null,
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
    _id: null,
    displayedCards: [],
    maxSize: null,
    name: null,
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
    back_image
    cmc
    collector_number
    color_identity
    image
    keywords
    mana_cost
    mtgo_id
    name
    oracle_id
    scryfall_id
    set
    set_name
    tcgplayer_id
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
    back_image,
    cmc,
    collector_number,
    color_identity,
    image,
    keywords,
    mana_cost,
    mtgo_id,
    name,
    oracle_id,
    scryfall_id,
    set,
    set_name,
    tcgplayer_id,
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
                    ${back_image ? 'back_image: "' + back_image + '",' : ''}
                    cmc: ${cmc},
                    collector_number: ${collector_number},
                    color_identity: [${color_identity.map(ci => '"' + ci + '"')}],
                    image: "${image}",
                    keywords: [${keywords.map(kw => '"' + kw + '"')}],
                    mana_cost: "${mana_cost}",
                    ${Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',' : ''}
                    name: "${name}",
                    oracle_id: "${oracle_id}",
                    scryfall_id: "${scryfall_id}",
                    set: "${set}",
                    set_name: "${set_name}",
                    ${Number.isInteger(tcgplayer_id) ? 'tcgplayer_id: ' + tcgplayer_id + ',' : ''}
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
      callback: (data) => setCubeState(data),
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