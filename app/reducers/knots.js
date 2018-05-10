import {
  UPDATE_DOCKER_VERSION,
  DOCKER_VERSION_ERROR,
  UPDATE_TAP_LOGS,
  UPDATE_TARGET_LOGS,
  UPDATE_NAME,
  KNOT_SYNCING,
  KNOT_SYNCED
} from '../actions/knots';

export type knotsStateType = {
  +dockerVersionDetected: boolean,
  +dockerVersion: string,
  +dockerVersionError: string,
  +tapLogs: [],
  +targetLogs: [],
  +knotName: string,
  +syncing: boolean
};

const defaultState = {
  dockerVersionDetected: false,
  dockerVersion: '',
  dockerVersionError: '',
  tapLogs: [],
  targetLogs: [],
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
    case UPDATE_TAP_LOGS:
      return Object.assign({}, state, {
        tapLogs: [...state.tapLogs, action.newLog]
      });
    case UPDATE_TARGET_LOGS:
      return Object.assign({}, state, {
        targetLogs: [...state.targetLogs, action.newLog]
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
