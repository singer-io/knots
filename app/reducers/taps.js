import { UPDATE_TAPS, TAPS_LOADING } from '../actions/taps';

export type tapsStateType = {
  +loading: boolean,
  +taps: Array<string>
};

export default function knots(state = { loading: false, taps: [] }, action) {
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { loading: false });
    case UPDATE_TAPS:
      return Object.assign({}, state, { taps: action.taps, loading: false });
    default:
      return state;
  }
}
