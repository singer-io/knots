import { TAPS_LOADING, UPDATE_TAPS, UPDATE_TAP_FIELDS } from '../actions/taps';

export type tapsStateType = {
  +tapsLoading: boolean,
  +taps: Array<string>,
  +tapFields: Array<{}>,
  +error: boolean
};

const defaultState = {
  tapsLoading: false,
  taps: [],
  tapFields: [],
  error: ''
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
    case UPDATE_TAP_FIELDS:
      return Object.assign({}, state, {
        tapsLoading: false,
        tapFields: action.tapFields,
        error: action.error
      });
    default:
      return state;
  }
}
