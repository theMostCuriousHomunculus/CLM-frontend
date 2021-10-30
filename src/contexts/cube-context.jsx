import React, { createContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';

import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Cube from '../pages/Cube';

export const CubeContext = createContext({
  loading: false,
  activeComponentState: {
    _id: 'mainbaord',
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
    published: false,
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
  cloneCube: () => null,
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

export default function ContextualizedCubePage() {
  const history = useHistory();
  const [activeComponentState, setActiveComponentState] = React.useState({
    _id: 'mainboard',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  });
  const { cubeID } = useParams();
  const [cubeState, setCubeState] = React.useState({
    _id: cubeID,
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
    notes
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
    published
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
  const { requestSubscription } = useSubscribe();

  const filterCards = React.useCallback(
    (cards, text) =>
      cards.filter((card) => {
        const wordArray = text.split(' ');
        return wordArray.every(
          (word) =>
            card.keywords
              .join(' ')
              .toLowerCase()
              .includes(word.toLowerCase()) ||
            card.name.toLowerCase().includes(word.toLowerCase()) ||
            card.type_line.toLowerCase().includes(word.toLowerCase())
        );
      }),
    []
  );

  React.useEffect(() => {
    const state = { _id: displayState.activeComponentID };

    if (state._id === 'sideboard') {
      state.displayedCards = filterCards(
        cubeState.sideboard,
        displayState.filter
      );
      state.name = 'Sideboard';
    } else if (cubeState.modules.find((module) => module._id === state._id)) {
      const module = cubeState.modules.find((mdl) => mdl._id === state._id);
      state.displayedCards = filterCards(module.cards, displayState.filter);
      state.name = module.name;
    } else if (
      cubeState.rotations.find((rotation) => rotation._id === state._id)
    ) {
      const rotation = cubeState.rotations.find((rtn) => rtn._id === state._id);
      state.displayedCards = filterCards(rotation.cards, displayState.filter);
      state.maxSize = rotation.cards.length;
      state.name = rotation.name;
      state.size = rotation.size;
    } else {
      state._id = 'mainboard';
      state.displayedCards = filterCards(
        cubeState.mainboard,
        displayState.filter
      );
      state.name = 'Mainboard';
    }

    setActiveComponentState(state);
  }, [cubeState, displayState, filterCards]);

  const addCardToCube = React.useCallback(
    async function ({
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
                componentID: "${activeComponentState._id}",
                card: {
                  ${back_image ? 'back_image: "' + back_image + '",' : ''}
                  cmc: ${cmc},
                  collector_number: ${collector_number},
                  color_identity: [${color_identity.map(
                    (ci) => '"' + ci + '"'
                  )}],
                  image: "${image}",
                  keywords: [${keywords.map((kw) => '"' + kw + '"')}],
                  mana_cost: "${mana_cost}",
                  ${
                    Number.isInteger(mtgo_id) ? 'mtgo_id: ' + mtgo_id + ',' : ''
                  }
                  name: "${name}",
                  oracle_id: "${oracle_id}",
                  scryfall_id: "${scryfall_id}",
                  set: "${set}",
                  set_name: "${set_name}",
                  ${
                    Number.isInteger(tcgplayer_id)
                      ? 'tcgplayer_id: ' + tcgplayer_id + ','
                      : ''
                  }
                  type_line: "${type_line}"
                }
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const cloneCube = React.useCallback(
    async function () {
      await sendRequest({
        callback: (data) => {
          history.push(`/cube/${data._id}`);
          setCubeState(data);
        },
        headers: { CubeID: cubeState._id },
        load: true,
        operation: 'cloneCube',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation} {
                ${cubeQuery}
              }
            }
          `
          };
        }
      });
    },
    [cubeQuery, cubeState._id, history, sendRequest]
  );

  const createModule = React.useCallback(
    async function (name, toggleOpen) {
      await sendRequest({
        callback: (data) => {
          setDisplayState((prevState) => ({
            ...prevState,
            activeComponentID: data.modules[data.modules.length - 1]._id
          }));
          toggleOpen();
        },
        headers: { CubeID: cubeState._id },
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
          };
        }
      });
    },
    [cubeState._id, sendRequest]
  );

  const createRotation = React.useCallback(
    async function (name, toggleOpen) {
      await sendRequest({
        callback: (data) => {
          setDisplayState((prevState) => ({
            ...prevState,
            activeComponentID: data.rotations[data.rotations.length - 1]._id
          }));
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
          };
        }
      });
    },
    [cubeState._id, sendRequest]
  );

  const deleteCard = React.useCallback(
    async function (cardID, destinationID) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'deleteCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                cardID: "${cardID}",
                ${
                  destinationID ? 'destinationID: "' + destinationID + '",' : ''
                }
                originID: "${activeComponentState._id}"
              )
            }
          `
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const deleteModule = React.useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setDisplayState((prevState) => ({
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
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const deleteRotation = React.useCallback(
    async function () {
      await sendRequest({
        callback: () => {
          setDisplayState((prevState) => ({
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
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const editCard = React.useCallback(
    async function (changes) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'editCard',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                componentID: "${activeComponentState._id}",
                ${changes}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const editCube = React.useCallback(
    async function (description, name, published) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'editCube',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                description: "${description}",
                name: "${name}",
                published: ${published}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [cubeState._id, sendRequest]
  );

  const editModule = React.useCallback(
    async function (name) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'editModule',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                moduleID: "${activeComponentState._id}",
                name: "${name}"
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const editRotation = React.useCallback(
    async function (name, size) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'editRotation',
        get body() {
          return {
            query: `
            mutation {
              ${this.operation}(
                rotationID: "${activeComponentState._id}",
                name: "${name}",
                size: ${size}
              ) {
                _id
              }
            }
          `
          };
        }
      });
    },
    [activeComponentState._id, cubeState._id, sendRequest]
  );

  const fetchCubeByID = React.useCallback(
    async function () {
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
          };
        }
      });
    },
    [cubeQuery, cubeState._id, sendRequest]
  );

  React.useEffect(() => {
    requestSubscription({
      headers: { cubeID },
      queryString: cubeQuery,
      setup: fetchCubeByID,
      subscriptionType: 'subscribeCube',
      update: setCubeState
    });
  }, [cubeID, cubeQuery, fetchCubeByID, requestSubscription]);

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
        cloneCube,
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