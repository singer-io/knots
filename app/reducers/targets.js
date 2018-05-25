import {
  UPDATE_TARGETS,
  TARGETS_LOADING,
  TARGET_SELECTED
} from '../actions/targets';
import { LOADED_KNOT } from '../actions/knots';

export type targetsStateType = {
  +targets: Array<{}>,
  +targetsLoading: boolean,
  +targetSelected: boolean,
  +selectedTarget: { name: sring, image: string }
};

const defaultState = {
  targets: [],
  targetsLoading: false,
  targetInstalled: false,
  targetSelected: false,
  selectedTarget: { name: '', image: '' }
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
    case TARGET_SELECTED:
      return Object.assign({}, state, {
        targetSelected: true,
        selectedTarget: action.target
      });
    case LOADED_KNOT:
      return Object.assign({}, state, {
        selectedTarget: action.target
      });
    default:
      return state;
  }
}
