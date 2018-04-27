import {
  UPDATE_TARGETS,
  TARGETS_LOADING,
  TARGET_INSTALLED
} from '../actions/targets';

export type targetsStateType = {
  +targets: Array<{}>,
  +targetsLoading: boolean
};

const defaultState = {
  targets: [],
  targetsLoading: false,
  targetInstalled: false
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
    case TARGETS_LOADING:
      return Object.assign({}, state, {
        targetsLoading: true
      });
    case UPDATE_TARGETS:
      return Object.assign({}, state, {
        targetsLoading: false,
        targets: action.targets
      });
    case TARGET_INSTALLED:
      return Object.assign({}, state, {
        targetsLoading: false,
        targetInstalled: true
      });
    default:
      return state;
  }
}
