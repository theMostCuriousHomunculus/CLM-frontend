import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import usePopulate from '../hooks/populate-hook';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Cube from '../pages/Cube';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { CardCacheContext } from './CardCache';

export const CubeContext = createContext({
  activeComponentState: {
    _id: 'mainbaord',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  },
  cubeState: {
    _id: null,
    creator: {
      _id: null,
      avatar: null,
      name: null
    },
    description: null,
    image: {
      alt: undefined,
      scryfall_id: undefined,
      src: undefined
    },
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
  setDisplayState: () => null,
  // addCardToCube: () => null,
  cloneCube: () => null,
  createModule: () => null,
  createRotation: () => null,
  deleteCard: () => null,
  deleteModule: () => null,
  deleteRotation: () => null,
  editCard: () => null,
  editCube: () => null,
  editModule: () => null,
  editRotation: () => null
});

export default function ContextualizedCubePage() {
  const navigate = useNavigate();
  const [activeComponentState, setActiveComponentState] = useState({
    _id: 'mainboard',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  });
  const { cubeID } = useParams();
  const { addCardsToCache, scryfallCardDataCache } =
    useContext(CardCacheContext);
  const [cubeState, setCubeState] = useState({
    _id: cubeID,
    creator: {
      _id: null,
      avatar: null,
      name: '...'
    },
    description: '',
    image: {
      alt: undefined,
      scryfall_id: undefined,
      src: undefined
    },
    mainboard: [],
    modules: [],
    name: '',
    published: false,
    rotations: [],
    sideboard: []
  });
  const [displayState, setDisplayState] = useState({
    activeComponentID: 'mainboard',
    filter: ''
  });
  const cardQuery = `
    _id
    cmc
    color_identity
    notes
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
    image
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
  const { populateCachedScryfallData } = usePopulate();
  const { loading, sendRequest } = useRequest();

  const filterCards = useCallback(
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

  useEffect(() => {
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

  const updateCubeState = useCallback(
    async function (data) {
      const cardSet = new Set();

      if (data.image) cardSet.add(data.image);

      for (const card of data.mainboard) {
        cardSet.add(card.scryfall_id);
      }

      for (const card of data.sideboard) {
        cardSet.add(card.scryfall_id);
      }

      for (const module of data.modules) {
        for (const card of module.cards) {
          cardSet.add(card.scryfall_id);
        }
      }

      for (const rotation of data.rotations) {
        for (const card of rotation.cards) {
          cardSet.add(card.scryfall_id);
        }
      }

      await addCardsToCache([...cardSet]);

      if (data.image) {
        data.image = {
          alt: scryfallCardDataCache.current[data.image].name,
          scryfall_id: data.image,
          src: scryfallCardDataCache.current[data.image].art_crop
        };
      }

      data.mainboard.forEach(populateCachedScryfallData);

      data.sideboard.forEach(populateCachedScryfallData);

      for (const module of data.modules) {
        module.cards.forEach(populateCachedScryfallData);
      }

      for (const rotation of data.rotations) {
        rotation.cards.forEach(populateCachedScryfallData);
      }

      setCubeState(data);
    },
    [addCardsToCache, populateCachedScryfallData]
  );

  // const addCardToCube = useCallback(
  //   async function ({ name, scryfall_id }) {
  //     await sendRequest({
  //       headers: { CubeID: cubeState._id },
  //       operation: 'addCardToCube',
  //       get body() {
  //         return {
  //           query: `
  //           mutation {
  //             ${this.operation}(
  //               componentID: "${activeComponentState._id}",
  //               name: "${name}",
  //               scryfall_id: "${scryfall_id}"
  //             ) {
  //               _id
  //             }
  //           }
  //         `
  //         };
  //       }
  //     });
  //   },
  //   [activeComponentState._id, cubeState._id, sendRequest]
  // );

  const cloneCube = useCallback(
    async function () {
      await sendRequest({
        callback: (data) => {
          navigate(`/cube/${data._id}`);
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
    [cubeQuery, cubeState._id, navigate, sendRequest]
  );

  const createModule = useCallback(
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

  const createRotation = useCallback(
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

  const deleteCard = useCallback(
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

  const deleteModule = useCallback(
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

  const deleteRotation = useCallback(
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

  const editCard = useCallback(
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

  const editCube = useCallback(
    async function (description, image, name, published) {
      await sendRequest({
        headers: { CubeID: cubeState._id },
        operation: 'editCube',
        get body() {
          return {
            query: `
              mutation {
                ${this.operation}(
                  description: "${description}",
                  ${image ? `image: "${image}",` : ''}
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

  const editModule = useCallback(
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

  const editRotation = useCallback(
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

  const fetchCubeByID = useCallback(
    async function () {
      await sendRequest({
        callback: updateCubeState,
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
    [cubeQuery, cubeState._id, sendRequest, updateCubeState]
  );

  useSubscribe({
    connectionInfo: { cubeID },
    queryString: cubeQuery,
    setup: fetchCubeByID,
    subscriptionType: 'subscribeCube',
    update: updateCubeState
  });

  return (
    <CubeContext.Provider
      value={{
        activeComponentState,
        cubeState,
        displayState,
        setDisplayState,
        // addCardToCube,
        cloneCube,
        createModule,
        createRotation,
        deleteCard,
        deleteModule,
        deleteRotation,
        editCard,
        editCube,
        editModule,
        editRotation
      }}
    >
      {loading ? <LoadingSpinner /> : <Cube />}
    </CubeContext.Provider>
  );
}
