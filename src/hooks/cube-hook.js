import { useCallback, useEffect, useState } from 'react';
import returnComponent from '../functions/return-component';

let cubeState = {
  active_component_cards: [],
  active_component_id: 'mainboard',
  active_component_name: 'Mainboard',
  active_rotation_size: undefined,
  active_component_type: 'builtIn',
  cube: {
    modules: [],
    rotations: []
  },
  displayed_cards: [],
  filter: '',
  view_mode: 'Table'
};

let listeners = [];

let actions = {
  ADD_CARD: function (newCard) {
    if (cubeState.active_component_id === 'mainboard') {
      const newMainboardCardList = cubeState.cube.mainboard.concat([newCard]);
      return {
        ...cubeState,
        active_component_cards: newMainboardCardList,
        cube: {
          ...cubeState.cube,
          mainboard: newMainboardCardList
        },
        displayed_cards: filterCards(newMainboardCardList, cubeState.filter)
      };
    } else if (cubeState.active_component_id === 'sideboard') {
      const newSideboardCardList = cubeState.cube.sideboard.concat([newCard]);
      return {
        ...cubeState,
        active_component_cards: newSideboardCardList,
        cube: {
          ...cubeState.cube,
          sideboard: newSideboardCardList
        },
        displayed_cards: filterCards(newSideboardCardList, cubeState.filter)
      };
    } else if (cubeState.active_component_type === 'module') {
      const newModuleCardList = cubeState.active_component_cards.concat([newCard]);
      const moduleIndex = cubeState.cube.modules.findIndex(function (module) {
        return module._id === cubeState.active_component_id;
      });
      const moduleCopy = { ...cubeState.cube.modules[moduleIndex] };
      const moduleWithNewCard = {
        ...moduleCopy,
        cards: newModuleCardList
      };
      return {
        ...cubeState,
        active_component_cards: newModuleCardList,
        cube: {
          ...cubeState.cube,
          modules: cubeState.cube.modules.slice(0, moduleIndex)
            .concat([moduleWithNewCard])
            .concat(cubeState.cube.modules.slice(moduleIndex + 1))
        },
        displayed_cards: filterCards(newModuleCardList, cubeState.filter)
      };
    } else if (cubeState.active_component_type === 'rotation') {
      const newRotationCardList = cubeState.active_component_cards.concat([newCard]);
      const rotationIndex = cubeState.cube.rotations.findIndex(function (rotation) {
        return rotation._id === cubeState.active_component_id;
      });
      const rotationCopy = { ...cubeState.cube.rotations[rotationIndex] };
      const rotationWithNewCard = {
        ...rotationCopy,
        cards: newRotationCardList
      };
      return {
        ...cubeState,
        active_component_cards: newRotationCardList,
        cube: {
          ...cubeState.cube,
          rotations: cubeState.cube.rotations.slice(0, rotationIndex)
            .concat([rotationWithNewCard])
            .concat(cubeState.cube.rotations.slice(rotationIndex + 1))
        },
        displayed_cards: filterCards(newRotationCardList, cubeState.filter)
      };
    } else {
      // this should never happen
      return cubeState;
    }
  },
  CHANGE_COMPONENT_NAME: function (newName) {
    return {
      ...cubeState,
      active_component_name: newName
    };
  },
  CHANGE_ROTATION_SIZE: function (newSize) {
    return {
      ...cubeState,
      active_rotation_size: newSize
    };
  },
  FILTER_CARDS: function (newTextFilter) {
    return {
      ...cubeState,
      displayed_cards: filterCards(cubeState.active_component_cards, newTextFilter),
      filter: newTextFilter
    };
  },
  MOVE_OR_DELETE_CARD: function ({ cardId, destination }) {
    const activeComponentCardsArray = returnComponent(cubeState.cube, cubeState.active_component_id);
    const cardToMoveIndex = activeComponentCardsArray.findIndex(function (card) {
      return card._id === cardId;
    });
    const copyOfCardToMove = { ...activeComponentCardsArray[cardToMoveIndex] };
    const copyOfCubeState = { ...cubeState };
    const destinationCardsArray = returnComponent(cubeState.cube, destination);
    const newActiveComponentCardsArray = activeComponentCardsArray.slice(0, cardToMoveIndex)
      .concat(activeComponentCardsArray.slice(cardToMoveIndex + 1));
    let newDestinationCardsArray;

    if (destinationCardsArray) {
      newDestinationCardsArray = destinationCardsArray.concat([copyOfCardToMove]);
    }

    const destinationModule = cubeState.cube.modules.find(function (mdl) {
      return mdl._id === destination;
    });
    const destinationRotation = cubeState.cube.rotations.find(function (rtn) {
      return rtn._id === destination;
    });
    const originModule = cubeState.cube.modules.find(function (mdl) {
      return mdl._id === cubeState.active_component_id;
    });
    const originRotation = cubeState.cube.rotations.find(function (rtn) {
      return rtn._id === cubeState.active_component_id;
    });

    copyOfCubeState.active_component_cards = newActiveComponentCardsArray;
    copyOfCubeState.displayed_cards = filterCards(newActiveComponentCardsArray, cubeState.filter);

    if (destination === 'mainboard') {
      copyOfCubeState.cube.mainboard = newDestinationCardsArray;
    } else if (destination === 'sideboard') {
      copyOfCubeState.cube.sideboard = newDestinationCardsArray;
    } else if (destinationModule) {
      const moduleIndex = cubeState.cube.modules.findIndex(function (module) {
        return module._id === destination;
      });
      copyOfCubeState.cube.modules[moduleIndex].cards = newDestinationCardsArray;
    } else if (destinationRotation) {
      const rotationIndex = cubeState.cube.rotations.findIndex(function (rotation) {
        return rotation._id === destination;
      });
      copyOfCubeState.cube.rotations[rotationIndex].cards = newDestinationCardsArray;
    } else {
      // the card was deleted from the cube
    }

    if (cubeState.active_component_id === 'mainboard') {
      copyOfCubeState.cube.mainboard = newActiveComponentCardsArray;
    } else if (cubeState.active_component_id === 'sideboard') {
      copyOfCubeState.cube.sideboard = newActiveComponentCardsArray;
    } else if (originModule) {
      const moduleIndex = cubeState.cube.modules.findIndex(function (module) {
        return module._id === cubeState.active_component_id;
      });
      copyOfCubeState.cube.modules[moduleIndex].cards = newActiveComponentCardsArray;
    } else if (originRotation) {
      const rotationIndex = cubeState.cube.rotations.findIndex(function (rotation) {
        return rotation._id === cubeState.active_component_id;
      });
      copyOfCubeState.cube.rotations[rotationIndex].cards = newActiveComponentCardsArray;
    } else {
      // should never reach this block
    }

    return copyOfCubeState;
  },
  SWITCH_COMPONENT: function (componentId) {
    const module = cubeState.cube.modules.find(function (mdl) {
      return mdl._id === componentId;
    });
    const rotation = cubeState.cube.rotations.find(function (rtn) {
      return rtn._id === componentId;
    });

    if (componentId === 'mainboard') {
      return {
        ...cubeState,
        active_component_cards: cubeState.cube.mainboard,
        active_component_id: componentId,
        active_component_name: 'Mainboard',
        active_component_type: 'builtIn',
        active_rotation_size: undefined,
        displayed_cards: filterCards(cubeState.cube.mainboard, cubeState.filter)
      };
    } else if (componentId === 'sideboard') {
      return {
        ...cubeState,
        active_component_cards: cubeState.cube.sideboard,
        active_component_id: componentId,
        active_component_name: 'Sideboard',
        active_component_type: 'builtIn',
        active_rotation_size: undefined,
        displayed_cards: filterCards(cubeState.cube.sideboard, cubeState.filter)
      };
    } else if (module) {
      return {
        ...cubeState,
        active_component_cards: module.cards,
        active_component_id: componentId,
        active_component_name: module.name,
        active_component_type: 'module',
        active_rotation_size: undefined,
        displayed_cards: filterCards(module.cards, cubeState.filter)
      };
    } else if (rotation) {
      return {
        ...cubeState,
        active_component_cards: rotation.cards,
        active_component_id: componentId,
        active_component_name: rotation.name,
        active_component_type: 'rotation',
        active_rotation_size: rotation.size,
        displayed_cards: filterCards(rotation.cards, cubeState.filter)
      };
    } else {
      // this should never happen
      return cubeState;
    }
  },
  SWITCH_VIEW_MODE: function (newViewMode) {
    return {
      ...cubeState,
      view_mode: newViewMode
    };
  },
  UPDATE_CUBE: function (updatedCube) {
    const differentCube = cubeState.cube._id !== updatedCube._id;

    if (differentCube ||
      cubeState.active_component_id === 'mainboard' ||
      cubeState.cube.modules.length + cubeState.cube.rotations.length > updatedCube.modules.length + updatedCube.rotations.length) {
      return ({
        ...cubeState,
        active_component_cards: updatedCube.mainboard,
        active_component_id: 'mainboard',
        active_component_name: 'Mainboard',
        active_rotation_size: undefined,
        active_component_type: 'builtIn',
        cube: updatedCube,
        displayed_cards: filterCards(updatedCube.mainboard, cubeState.filter)
      });
    } else if (cubeState.active_component_id === 'sideboard') {
      return {
        ...cubeState,
        active_component_cards: updatedCube.sideboard,
        active_component_id: 'sideboard',
        active_component_name: 'Sideboard',
        active_rotation_size: undefined,
        active_component_type: 'builtIn',
        cube: updatedCube,
        displayed_cards: filterCards(updatedCube.sideboard, cubeState.filter)
      };
    } else if (cubeState.active_component_type === 'module') {
      const module = updatedCube.modules.find(function (mdl) {
        return mdl._id === cubeState.active_component_id;
      });

      return {
        ...cubeState,
        active_component_cards: module.cards,
        active_component_id: module._id,
        active_component_name: module.name,
        active_rotation_size: undefined,
        active_component_type: 'module',
        cube: updatedCube,
        displayed_cards: filterCards(module.cards, cubeState.filter)
      };
    } else if (cubeState.active_component_type === 'rotation') {
      const rotation = updatedCube.rotations.find(function (rtn) {
        return rtn._id === cubeState.active_component_id;
      });

      return {
        ...cubeState,
        active_component_cards: rotation.cards,
        active_component_id: rotation._id,
        active_component_name: rotation.name,
        active_rotation_size: rotation.size,
        active_component_type: 'rotation',
        cube: updatedCube,
        displayed_cards: filterCards(rotation.cards, cubeState.filter)
      };
    } else {
      // this should never happen
      return cubeState;
    }
  }
};

function filterCards (activeComponentCards, filterText) {
  return activeComponentCards.filter(function (card) {
    const wordArray = filterText.split(" ");
    return (
      wordArray.every(function (word) {
        return (
          card.keywords.find((keyword) => keyword.toLowerCase().includes(word.toLowerCase())) ||
          card.name.toLowerCase().includes(word.toLowerCase()) ||
          card.type_line.toLowerCase().includes(word.toLowerCase())
        );
      })
    );
  });
}

export const useCube = (listening) => {
  const setCubeState = useState(cubeState)[1];

  const dispatch = useCallback(function (actionType, actionValue) {
    const newCubeState = actions[actionType](actionValue);
    cubeState = newCubeState;

    for (const listener of listeners) {
      listener(newCubeState);
    }
  }, []);

  useEffect(() => {
    if (listening) {
      listeners.push(setCubeState);
    }

    return () => {
      if (listening) {
        listeners = listeners.filter(function (lstnr) {
          return lstnr !== setCubeState;
        });
      }
    }
  }, [listening, setCubeState]);

  return [cubeState, dispatch];
};