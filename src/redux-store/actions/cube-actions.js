const actionTypes = {
  ADD_CARD: 'ADD_CARD',
  ADD_COMPONENT: 'ADD_COMPONENT',
  CHANGE_COMPONENT_NAME: 'CHANGE_COMPONENT_NAME',
  CHANGE_ROTATION_SIZE: 'CHANGE_ROTATION_SIZE',
  DELETE_COMPONENT: 'DELETE_COMPONENT',
  EDIT_CARD: 'EDIT_CARD',
  FILTER_CARDS: 'FILTER_CARDS',
  INITIALIZE_CUBE: 'INITIALIZE_CUBE',
  MOVE_OR_DELETE_CARD: 'MOVE_OR_DELETE_CARD',
  SWITCH_COMPONENT: 'SWITCH_COMPONENT',
  SWITCH_VIEW_MODE: 'SWITCH_VIEW_MODE',
  UPDATE_CUBE_INFO: 'UPDATE_CUBE_INFO'
}

const actionCreators = {
  add_card: (payload) => {
    return {
      type: actionTypes.ADD_CARD,
      payload
    }
  },
  add_component: (payload) => {
    return {
      type: actionTypes.ADD_COMPONENT,
      payload
    }
  },
  change_component_name: (payload) => {
    return {
      type: actionTypes.CHANGE_COMPONENT_NAME,
      payload
    }
  },
  change_rotation_size: (payload) => {
    return {
      type: actionTypes.CHANGE_ROTATION_SIZE,
      payload
    }
  },
  delete_component: () => {
    return {
      type: actionTypes.DELETE_COMPONENT
    }
  },
  edit_card: (payload) => {
    return {
      type: actionTypes.EDIT_CARD,
      payload
    }
  },
  filter_cards: (payload) => {
    return {
      type: actionTypes.FILTER_CARDS,
      payload
    }
  },
  initialize_cube: (payload) => {
    return {
      type: actionTypes.INITIALIZE_CUBE,
      payload
    }
  },
  move_or_delete_card: (payload) => {
    return {
      type: actionTypes.MOVE_OR_DELETE_CARD,
      payload
    }
  },
  switch_component: (payload) => {
    return {
      type: actionTypes.SWITCH_COMPONENT,
      payload
    }
  },
  switch_view_mode: (payload) => {
    return {
      type: actionTypes.SWITCH_VIEW_MODE,
      payload
    }
  },
  update_cube_info: (payload) => {
    return {
      type: actionTypes.UPDATE_CUBE_INFO,
      payload
    }
  }
}

module.exports = {
  actionTypes,
  actionCreators
}