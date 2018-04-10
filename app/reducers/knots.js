import {
  UPDATE_KNOTS,
  KNOT_RUNNING,
  KNOT_RUN_COMPLETE
} from '../actions/knots';

export type knotsStateType = {
  +knots: Array<string>,
  +loading: boolean,
  +text: string
};

export default function knots(
  state = { knots: [], loading: false, text: 'New' },
  action
) {
  switch (action.type) {
    case UPDATE_KNOTS:
      return Object.assign({}, state, { knots: action.knots });
    case KNOT_RUNNING:
      return Object.assign({}, state, { loading: true });
    case KNOT_RUN_COMPLETE:
      return Object.assign({}, state, { loading: false, text: action.string });
    default:
      return state;
  }
}
