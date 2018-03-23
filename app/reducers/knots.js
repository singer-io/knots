import { UPDATE_KNOTS } from '../actions/knots';

export type knotsStateType = {
  +knots: Array<string>
};

export default function knots(state = { knots: [] }, action) {
  switch (action.type) {
    case UPDATE_KNOTS:
      return Object.assign({}, state, { knots: action.knots });
    default:
      return state;
  }
}
