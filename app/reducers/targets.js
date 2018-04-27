import { UPDATE_TARGETS, TARGETS_LOADING } from '../actions/targets';

export type targetsStateType = {
  +targets: Array<{}>,
  +targetsLoading: boolean
};

const defaultState = {
  targets: [],
  targetsLoading: false
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
    default:
      return state;
  }
}
