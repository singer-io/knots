import {
  UPDATE_KNOTS,
  KNOT_RUNNING,
  KNOT_RUN_COMPLETE,
  KNOT_SAVED
} from '../actions/knots';

export type knotsStateType = {
  +knots: Array<string>,
  +loading: boolean,
  +synced: boolean,
  +text: string,
  +syncLogs: string,
  +saved: boolean
};

export default function knots(
  state = {
    knots: [],
    loading: false,
    synced: false,
    syncLogs: '',
    saved: false
  },
  action
) {
  switch (action.type) {
    case UPDATE_KNOTS:
      return Object.assign({}, state, { knots: action.knots });
    case KNOT_RUNNING:
      return Object.assign({}, state, {
        loading: true,
        synced: false,
        syncLogs: action.syncLogs
      });
    case KNOT_RUN_COMPLETE:
      return Object.assign({}, state, { loading: false, synced: true });
    case KNOT_SAVED:
      return Object.assign({}, state, { saved: true });
    default:
      return state;
  }
}
