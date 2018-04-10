import {
  UPDATE_KNOTS,
  KNOT_RUNNING,
  KNOT_RUN_COMPLETE,
  SHOW_MODAL,
  CLOSE_MODAL,
  SET_KNOT_NAME,
  SAVE_KNOT
} from '../actions/knots';

export type knotsStateType = {
  +knots: Array<string>,
  +loading: boolean,
  +text: string
};

export default function knots(
  state = { knots: [], loading: false, text: 'New' },
  +synced: boolean,
  +showSaveModal: boolean,
  +knotName: string
};

export default function knots(
  state = {
    knots: [],
    loading: false,
    synced: false,
    showSaveModal: false,
    knotName: ''
  },
  action
) {
  switch (action.type) {
    case UPDATE_KNOTS:
      return Object.assign({}, state, { knots: action.knots });
    case KNOT_RUNNING:
      return Object.assign({}, state, { loading: true, synced: false });
    case KNOT_RUN_COMPLETE:
      return Object.assign({}, state, { loading: false, text: action.string });
      return Object.assign({}, state, { loading: false, synced: true });
    case SHOW_MODAL:
      return Object.assign({}, state, { showSaveModal: true });
    case CLOSE_MODAL:
      return Object.assign({}, state, { showSaveModal: false });
    case SET_KNOT_NAME:
      return Object.assign({}, state, { knotName: action.name });
    default:
      return state;
  }
}
