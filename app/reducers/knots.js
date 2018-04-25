import {
  DOCKER_VERSION_LOADING,
  UPDATE_DOCKER_VERSION,
  DOCKER_VERSION_ERROR
} from '../actions/knots';

export type knotsStateType = {
  +dockerVersionLoading: boolean,
  +dockerVersion: string,
  +dockerVersionError: string
};

const defaultState = {
  dockerVersionLoading: false,
  dockerVersion: '',
  dockerVersionError: ''
};

export default function knots(state = defaultState, action) {
  switch (action.type) {
    case DOCKER_VERSION_LOADING:
      return Object.assign({}, state, { dockerVersionLoading: true });
    case UPDATE_DOCKER_VERSION:
      return Object.assign({}, state, {
        dockerVersionLoading: false,
        dockerVersion: action.version,
        dockerVersionError: action.error
      });
    case DOCKER_VERSION_ERROR:
      return Object.assign({}, state, {
        dockerVersionLoading: false,
        dockerVersion: '',
        dockerVersionError: action.error
      });
    default:
      return state;
  }
}
