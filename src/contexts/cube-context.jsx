import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import cubeQuery from '../constants/cube-query';
import fetchCubeByID from '../graphql/queries/cube/fetch-cube-by-ID';
import useRequest from '../hooks/request-hook';
import useSubscribe from '../hooks/subscribe-hook';
import Cube from '../pages/Cube';
import LoadingSpinner from '../components/miscellaneous/LoadingSpinner';
import { ErrorContext } from './Error';

export const CubeContext = createContext({
  abortControllerRef: { current: new AbortController() },
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
      _id: '',
      image_uris: {
        art_crop: ''
      },
      name: '',
      card_faces: [
        {
          image_uris: {
            art_crop: ''
          },
          name: ''
        }
      ]
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
  createModule: () => null,
  createRotation: () => null,
  deleteCard: () => null,
  deleteModule: () => null,
  deleteRotation: () => null,
  editRotation: () => null
});

export default function ContextualizedCubePage() {
  const { setErrorMessages } = useContext(ErrorContext);
  const location = useLocation();
  const { cubeID } = useParams();
  const abortControllerRef = useRef(new AbortController());
  const { sendRequest } = useRequest();
  const [activeComponentState, setActiveComponentState] = useState({
    _id: 'mainboard',
    displayedCards: [],
    maxSize: null,
    name: 'Mainboard',
    size: null
  });
  const [cubeState, setCubeState] = useState({
    _id: cubeID,
    creator: {
      _id: null,
      avatar: null,
      name: '...'
    },
    description: '',
    image: {
      _id: '',
      image_uris: {
        art_crop: ''
      },
      name: '',
      card_faces: [
        {
          image_uris: {
            art_crop: ''
          },
          name: ''
        }
      ]
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
  const [loading, setLoading] = useState(false);
  const { cubeData } = location.state || {};

  const filterCards = useCallback(
    (cards, text) =>
      cards.filter((card) => {
        const wordArray = text.split(' ');
        return wordArray.every(
          (word) =>
            card.scryfall_card.keywords.join(' ').toLowerCase().includes(word.toLowerCase()) ||
            card.scryfall_card.name.toLowerCase().includes(word.toLowerCase()) ||
            card.scryfall_card.type_line.toLowerCase().includes(word.toLowerCase())
        );
      }),
    []
  );

  useEffect(() => {
    const state = { _id: displayState.activeComponentID };

    if (state._id === 'sideboard') {
      state.displayedCards = filterCards(cubeState.sideboard, displayState.filter);
      state.name = 'Sideboard';
    } else if (cubeState.modules.find((module) => module._id === state._id)) {
      const module = cubeState.modules.find((mdl) => mdl._id === state._id);
      state.displayedCards = filterCards(module.cards, displayState.filter);
      state.name = module.name;
    } else if (cubeState.rotations.find((rotation) => rotation._id === state._id)) {
      const rotation = cubeState.rotations.find((rtn) => rtn._id === state._id);
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
                ${destinationID ? 'destinationID: "' + destinationID + '",' : ''}
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

  useSubscribe({
    cleanup: () => {
      abortControllerRef.current.abort();
    },
    connectionInfo: { cubeID },
    dependencies: cubeID,
    queryString: cubeQuery,
    setup: async () => {
      if (cubeData) {
        setCubeState(cubeData);
      } else {
        try {
          setLoading(true);
          const data = await fetchCubeByID({
            headers: { CubeID: cubeID },
            queryString: `{${cubeQuery}}`,
            signal: abortControllerRef.current.signal
          });
          setCubeState(data.data.fetchCubeByID);
        } catch (error) {
          setErrorMessages((prevState) => [...prevState, error.message]);
        } finally {
          setLoading(false);
        }
      }
    },
    subscriptionType: 'subscribeCube',
    update: setCubeState
  });

  return (
    <CubeContext.Provider
      value={{
        abortControllerRef,
        activeComponentState,
        cubeState,
        displayState,
        setDisplayState,
        createModule,
        createRotation,
        deleteCard,
        deleteModule,
        deleteRotation,
        editRotation
      }}
    >
      {loading ? <LoadingSpinner /> : <Cube />}
    </CubeContext.Provider>
  );
}
