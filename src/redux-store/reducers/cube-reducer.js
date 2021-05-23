import { cloneDeep } from 'lodash';

import customSort from '../../functions/custom-sort';
import returnComponent from '../../functions/return-component';
import { actionTypes } from '../actions/cube-actions';

const initialCubeState = {
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

function cubeReducer (cubeState = initialCubeState, action) {
  const { payload } = action;
  const copyOfCubeState = cloneDeep(cubeState);
  switch (action.type) {
    case actionTypes.ADD_CARD:
      try {
        const newCardList = copyOfCubeState.active_component_cards.concat([payload]);
        copyOfCubeState.active_component_cards = newCardList;
        copyOfCubeState.displayed_cards = filterCards(newCardList, copyOfCubeState.filter);
        returnComponent(copyOfCubeState.cube, copyOfCubeState.active_component_id).push(payload);
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.ADD_COMPONENT:
      try {
        const { newComponentId, newComponentName, newComponentType} = payload;

        copyOfCubeState.active_component_cards = [];
        copyOfCubeState.active_component_id = newComponentId;
        copyOfCubeState.active_component_name = newComponentName;
        copyOfCubeState.active_component_type = newComponentType;
        copyOfCubeState.displayed_cards = [];
  
        if (newComponentType === 'module') {
          copyOfCubeState.cube.modules = copyOfCubeState.cube.modules.concat([{
            _id: newComponentId,
            cards: [],
            name: newComponentName
          }]);
          copyOfCubeState.active_rotation_size = null;
        } else {
          copyOfCubeState.cube.rotations = copyOfCubeState.cube.rotations.concat([{
            _id: newComponentId,
            cards: [],
            name: newComponentName,
            size: 0
          }]);
          copyOfCubeState.active_rotation_size = 0;
        }
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.CHANGE_COMPONENT_NAME:
      try {
        if (cubeState.active_component_type === 'module') {
          const moduleIndex = cubeState.cube.modules.findIndex(function (mdl) {
            return mdl._id === cubeState.active_component_id;
          });
          copyOfCubeState.cube.modules[moduleIndex].name = payload;
        } else {
          const rotationIndex = cubeState.cube.rotations.findIndex(function (rtn) {
            return rtn._id === cubeState.active_component_id;
          });
          copyOfCubeState.cube.rotations[rotationIndex].name = payload;
        }
  
        copyOfCubeState.active_component_name = payload;
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.CHANGE_ROTATION_SIZE:
      try {
        const rotationIndex = cubeState.cube.rotations.findIndex(function (rtn) {
          return rtn._id === cubeState.active_component_id;
        });
        copyOfCubeState.cube.rotations[rotationIndex].size = payload;
        copyOfCubeState.active_rotation_size = payload;
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.DELETE_COMPONENT:
      try {
        copyOfCubeState.active_component_cards = cloneDeep(copyOfCubeState.cube.mainboard);
        copyOfCubeState.active_component_id = 'mainboard';
        copyOfCubeState.active_component_name = 'Mainboard';
        copyOfCubeState.active_component_type = 'builtIn';
        copyOfCubeState.active_rotation_size = null;
        copyOfCubeState.displayed_cards = filterCards(copyOfCubeState.active_component_cards, copyOfCubeState.filter);
        
        if (cubeState.active_component_type === 'module') {
          const deletedModuleIndex = copyOfCubeState.cube.modules.findIndex(function (module) {
            return module._id === cubeState.active_component_id;
          });
          copyOfCubeState.cube.modules.splice(deletedModuleIndex, 1);
        } else {
          const deletedRotationIndex = copyOfCubeState.cube.rotations.findIndex(function (rotation) {
            return rotation._id === cubeState.active_component_id;
          });
          copyOfCubeState.cube.modules.splice(deletedRotationIndex, 1);
        }
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.EDIT_CARD:
      try {
        const { cardId } = payload;
        delete payload.cardId;
        const cardToChangeIndex = copyOfCubeState.active_component_cards.findIndex(function (card) {
          return card._id === cardId;
        });
        const displayedCardToChangeIndex = copyOfCubeState.displayed_cards.findIndex(function (card) {
          return card._id === cardId;
        });

        copyOfCubeState.active_component_cards[cardToChangeIndex] = {
          ...copyOfCubeState.active_component_cards[cardToChangeIndex],
          ...payload
        }
        returnComponent(copyOfCubeState.cube, copyOfCubeState.active_component_id)[cardToChangeIndex] = {
          ...returnComponent(copyOfCubeState.cube, copyOfCubeState.active_component_id)[cardToChangeIndex],
          ...payload
        }
        copyOfCubeState.displayed_cards[displayedCardToChangeIndex] = {
          ...copyOfCubeState.displayed_cards[displayedCardToChangeIndex],
          ...payload
        }

        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.FILTER_CARDS:
      try {
        copyOfCubeState.displayed_cards = filterCards(copyOfCubeState.active_component_cards, payload);
        copyOfCubeState.filter = payload;
        
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.INITIALIZE_CUBE:
      try {
        return {
          ...copyOfCubeState,
          active_component_cards: cloneDeep(payload.mainboard),
          active_component_id: 'mainboard',
          active_component_name: 'Mainboard',
          active_rotation_size: undefined,
          active_component_type: 'builtIn',
          cube: payload,
          displayed_cards: filterCards(payload.mainboard, copyOfCubeState.filter)
        };
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.MOVE_OR_DELETE_CARD:
      try {
        const { cardId, destination } = payload;
        const originCardsArray = returnComponent(copyOfCubeState.cube, copyOfCubeState.active_component_id);
        const indexOfCardToMove = originCardsArray.findIndex(function (card) {
          return card._id === cardId;
        });
        const cardToMove = originCardsArray.splice(indexOfCardToMove, 1);
        let destinationCardsArray = returnComponent(copyOfCubeState.cube, destination);
  
        if (destinationCardsArray) {
          destinationCardsArray.push(cardToMove[0]);
        }
  
        copyOfCubeState.active_component_cards = cloneDeep(originCardsArray);
        copyOfCubeState.displayed_cards = filterCards(copyOfCubeState.active_component_cards, copyOfCubeState.filter);
  
        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.SWITCH_COMPONENT:
      try {
        const module = copyOfCubeState.cube.modules.find(function (mdl) {
          return mdl._id === payload;
        });
        const rotation = copyOfCubeState.cube.rotations.find(function (rtn) {
          return rtn._id === payload;
        });
  
        copyOfCubeState.active_component_id = payload;
        copyOfCubeState.active_component_cards = cloneDeep(returnComponent(copyOfCubeState.cube, payload));
    
        if (payload === 'mainboard') {
          return {
            ...copyOfCubeState,
            active_component_name: 'Mainboard',
            active_component_type: 'builtIn',
            active_rotation_size: undefined,
            displayed_cards: filterCards(copyOfCubeState.cube.mainboard, copyOfCubeState.filter)
          };
        } else if (payload === 'sideboard') {
          return {
            ...copyOfCubeState,
            active_component_name: 'Sideboard',
            active_component_type: 'builtIn',
            active_rotation_size: undefined,
            displayed_cards: filterCards(copyOfCubeState.cube.sideboard, copyOfCubeState.filter)
          };
        } else if (module) {
          return {
            ...copyOfCubeState,
            active_component_name: module.name,
            active_component_type: 'module',
            active_rotation_size: undefined,
            displayed_cards: filterCards(module.cards, copyOfCubeState.filter)
          };
        } else if (rotation) {
          return {
            ...copyOfCubeState,
            active_component_name: rotation.name,
            active_component_type: 'rotation',
            active_rotation_size: rotation.size,
            displayed_cards: filterCards(rotation.cards, copyOfCubeState.filter)
          };
        } else {
          // this should never happen
          break;
        }
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.SWITCH_VIEW_MODE:
      try {
        copyOfCubeState.view_mode = payload;

        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    case actionTypes.UPDATE_CUBE_INFO:
      try {
        copyOfCubeState.cube.description = payload.description;
        copyOfCubeState.cube.name = payload.name;

        return copyOfCubeState;
      } catch (error) {
        console.log(error);
        break;
      }
    default:
      return cubeState;
  }
}

function filterCards (activeComponentCards, filterText) {
  return customSort(activeComponentCards.filter(function (card) {
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
  }), ['name']);
}

export default cubeReducer;