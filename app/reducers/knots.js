import {
  UPDATE_DOCKER_VERSION,
  DOCKER_VERSION_ERROR,
  UPDATE_TAP_LOGS,
  UPDATE_TARGET_LOGS,
  UPDATE_NAME,
  KNOT_SYNCING,
  KNOT_SYNCED,
  DETECTING_DOCKER,
  FETCHING_KNOTS,
  FETCHED_KNOTS
} from '../actions/knots';

export type knotsStateType = {
  +detectingDocker: boolean,
  +fetchingKnots: boolean,
  +knots: Array<string>,
  +dockerVersionDetected: boolean,
  +dockerVersion: string,
  +dockerVersionError: string,
  +tapLogs: Array<string>,
  +targetLogs: Array<string>,
  +knotName: string,
  +syncing: boolean
};

const defaultState = {
  detectingDocker: false,
  fetchingKnots: false,
  dockerVersionDetected: false,
  dockerVersion: '',
  dockerVersionError: '',
  knots: [],
  tapLogs: [],
  targetLogs: [],
  knotName: '',
  knotSyncing: false,
  knotSynced: false
};

export default function knots(state = defaultState, action) {
  switch (action.type) {
    case DETECTING_DOCKER:
      return Object.assign({}, state, {
        detectingDocker: true
      });
    case FETCHING_KNOTS:
      return Object.assign({}, state, {
        fetchingKnots: true
      });
    case FETCHED_KNOTS:
      return Object.assign({}, state, {
        fetchingKnots: false,
        knots: action.knots || []
      });
    case UPDATE_DOCKER_VERSION:
      return Object.assign({}, state, {
        detectingDocker: false,
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
