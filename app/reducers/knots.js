import {
  UPDATE_DOCKER_VERSION,
  DOCKER_VERSION_ERROR,
  UPDATE_NAME,
  KNOT_SYNCING,
  KNOT_SYNCED
} from '../actions/knots';

export type knotsStateType = {
  +dockerVersionDetected: boolean,
  +dockerVersion: string,
  +dockerVersionError: string,
  +knotName: string,
  +syncing: boolean
};

const defaultState = {
  dockerVersionDetected: false,
  dockerVersion: '',
  dockerVersionError: '',
  knotName: '',
  knotSyncing: false,
  knotSynced: false
};

export default function knots(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_DOCKER_VERSION:
      return Object.assign({}, state, {
        dockerVersionDetected: true,
        dockerVersion: action.version,
        dockerVersionError: action.error
      });
    case DOCKER_VERSION_ERROR:
      return Object.assign({}, state, {
        dockerVersionDetected: true,
        dockerVersion: '',
        dockerVersionError: action.error
      });
    case UPDATE_NAME:
      return Object.assign({}, state, {
        knotName: action.name
      });
    case KNOT_SYNCING:
      return Object.assign({}, state, {
        knotSyncing: true
      });
    case KNOT_SYNCED:
      return Object.assign({}, state, {
        knotSyncing: false,
        knotSynced: true
      });
    default:
      return state;
  }
}
