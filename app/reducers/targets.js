import { UPDATE_TARGETS } from '../actions/targets';

export type targetsStateType = {
  +targets: Array<{}>,
  loading: boolean
};

const defaultState = {
  targets: [],
  loading: false
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_TARGETS:
      return Object.assign({}, state, { targets: action.targets });
    default:
      return state;
  }
}
