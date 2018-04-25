import { TAPS_LOADING, UPDATE_TAPS } from '../actions/taps';

export type tapsStateType = {
  +tapsLoading: boolean,
  +taps: Array<string>
};

const defaultState = {
  tapsLoading: false,
  taps: []
};

export default function taps(state = defaultState, action) {
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { tapsLoading: true });
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        tapsLoading: false,
        taps: action.taps,
        error: action.error
      });
    default:
      return state;
  }
}
