import { UPDATE_DOCKER_VERSION, DOCKER_VERSION_ERROR } from '../actions/knots';

export type knotsStateType = {
  +dockerVersionDetected: boolean,
  +dockerVersion: string,
  +dockerVersionError: string
};

const defaultState = {
  dockerVersionDetected: false,
  dockerVersion: '',
  dockerVersionError: ''
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
    default:
      return state;
  }
}
