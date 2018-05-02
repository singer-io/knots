import {
  UPDATE_TARGETS,
  TARGETS_LOADING,
  TARGET_SELECTED
} from '../actions/targets';

export type targetsStateType = {
  +targets: Array<{}>,
  +targetsLoading: boolean,
  +targetSelected: boolean
};

const defaultState = {
  targets: [],
  targetsLoading: false,
  targetInstalled: false,
  targetSelected: false
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
    case TARGET_SELECTED:
      return Object.assign({}, state, {
        targetSelected: true
      });
    case TARGETS_LOADING:
      return Object.assign({}, state, {
        targetsLoading: true
      });
    case UPDATE_TARGETS:
      return Object.assign({}, state, {
        targetsLoading: false,
        targets: action.targets
      });
    default:
      return state;
  }
}
