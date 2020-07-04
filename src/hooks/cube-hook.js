import { useCardSort } from '../hooks/card-sort-hook';
const { appendPropertiesAndSort } = useCardSort();

export const useCube = (state, action) => {

  let displayed_cards;
  let active_component_cards;
  let active_component_id;
  let active_component_name;
  let active_component_type;
  let active_rotation_size;
  let module;
  let rotation;

  switch (action.type) {
    case 'FILTER_CARDS':

      displayed_cards = appendPropertiesAndSort(state.active_component_cards.filter(function (card) {
        return (
          card.name.toLowerCase().includes(action.value.toLowerCase()) ||
          card.type_line.toLowerCase().includes(action.value.toLowerCase()) ||
          card.color.toLowerCase().includes(action.value.toLowerCase())
        );
      }));

      return {
        ...state,
        displayed_cards,
        filter: action.value
      };

    case 'SWITCH_COMPONENT':

      module = state.cube.modules.find(function (module) {
        return module._id === action.value;
      });;
      rotation = state.cube.rotations.find(function (rotation) {
        return rotation._id === action.value;
      });;

      if (action.value === 'mainboard') {
        active_component_cards = state.cube.mainboard;
        active_component_name = 'Mainboard';
        active_component_type = 'mainboard'
      } else if (action.value === 'sideboard') {
        active_component_cards = state.cube.sideboard;
        active_component_name = 'Sideboard';
        active_component_type = 'sideboard';
      } else if (module) {
        active_component_cards = module.cards;
        active_component_name = module.name;
        active_component_type = 'module';
      } else {
        active_component_cards = rotation.cards;
        active_component_name = rotation.name;
        active_component_type = 'rotation';
      }

      displayed_cards = appendPropertiesAndSort(active_component_cards.filter(function (card) {
        return (
          card.name.toLowerCase().includes(state.filter.toLowerCase()) ||
          card.type_line.toLowerCase().includes(state.filter.toLowerCase()) ||
          card.color.toLowerCase().includes(state.filter.toLowerCase())
        );
      }));
      active_rotation_size = rotation ? rotation.size : undefined;

      return {
        ...state,
        active_component_cards,
        active_component_id: action.value,
        active_component_name,
        active_rotation_size,
        active_component_type,
        cube: state.cube,
        displayed_cards,
        filter: state.filter
      };

    case 'UPDATE_CUBE':

      const sameCube = (state.cube && state.cube._id === action.value._id) ? true : false;

      if (!sameCube ||
        state.active_component_type === 'mainboard' ||
        state.cube.modules.length + state.cube.rotations.length > action.value.modules.length + action.value.rotations.length) {
        active_component_cards = action.value.mainboard;
        active_component_id = 'mainboard';
        active_component_name = 'Mainboard';
        active_component_type = 'mainboard';
      } else if (state.active_component_type === 'sideboard') {
        active_component_cards = action.value.sideboard;
        active_component_id = 'sideboard';
        active_component_name = 'Sideboard';
        active_component_type = 'sideboard';
      } else if (state.active_component_type === 'module') {
        module = action.value.modules.find(function (module) {
          return module._id === state.active_component_id;
        });
        active_component_cards = module.cards;
        active_component_id = module._id;
        active_component_name = module.name;
        active_component_type = 'module';
      } else {
        rotation = action.value.rotations.find(function (rotation) {
          return rotation._id === state.active_component_id;
        });
        active_component_cards = rotation.cards;
        active_component_id = rotation._id;
        active_component_name = rotation.name;
        active_component_type = 'rotation';
      }

      const filter = sameCube ? state.filter : '';
      displayed_cards = appendPropertiesAndSort(active_component_cards.filter(function (card) {
        return (
          card.name.toLowerCase().includes(filter.toLowerCase()) ||
          card.type_line.toLowerCase().includes(filter.toLowerCase()) ||
          card.color.toLowerCase().includes(filter.toLowerCase())
        );
      }));
      active_rotation_size = rotation ? rotation.size : undefined;

      return {
        active_component_cards,
        active_component_id,
        active_component_name,
        active_rotation_size,
        active_component_type,
        cube: action.value,
        displayed_cards,
        filter: state.filter
      };

    default:
      return state;
  }
}