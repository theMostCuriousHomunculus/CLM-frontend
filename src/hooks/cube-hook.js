import { useCallback, useEffect, useState } from 'react';

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
  cube_description: '',
  cube_name: '',
  displayed_cards: [],
  filter: '',
  view_mode: 'Table'
};

let listeners = [];

let actions = {
  CHANGE_COMPONENT_NAME: function (newName) {
    return {
      ...cubeState,
      active_component_name: newName
    };
  },
  CHANGE_CUBE_DESCRIPTION: function (newDescription) {
    return {
      ...cubeState,
      cube_description: newDescription
    };
  },
  CHANGE_CUBE_NAME: function (newName) {
    return {
      ...cubeState,
      cube_name: newName
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
    const differentCube = cubeState.cube._id !== updatedCube._id ? true : false;

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
        cube_description: updatedCube.description,
        cube_name: updatedCube.name,
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
        cube_description: updatedCube.description,
        cube_name: updatedCube.name,
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
        cube_description: updatedCube.description,
        cube_name: updatedCube.name,
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
        cube_description: updatedCube.description,
        cube_name: updatedCube.name,
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