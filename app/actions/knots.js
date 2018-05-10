import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_DOCKER_VERSION = 'UPDATE_DOCKER_VERSION';
export const DOCKER_VERSION_ERROR = 'DOCKER_VERSION_ERROR';
export const UPDATE_TAP_LOGS = 'UPDATE_TAP_LOGS';
export const UPDATE_TARGET_LOGS = 'UPDATE_TARGET_LOGS';
export const UPDATE_NAME = 'UPDATE_NAME';
export const KNOT_SYNCING = 'KNOT_SYNCING';
export const KNOT_SYNCED = 'KNOT_SYNCED';

type actionType = {
  +type: string
};

export function detectDocker() {
  return (dispatch: (action: actionType) => void) => {
    axios
      .get(`${baseUrl}/docker/`)
      .then((response) =>
        dispatch({
          type: UPDATE_DOCKER_VERSION,
          version: response.data.version,
          error: response.data.version
        })
      )
      .catch((error) =>
        dispatch({
          type: DOCKER_VERSION_ERROR,
          error: JSON.stringify(error)
        })
      );
  };
}

export function updateName(name) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_NAME,
      name
    });
  };
}

export function sync(tap) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_SYNCING
    });

    axios
      .post(`${baseUrl}/sync`, { tap })
      .then(() =>
        dispatch({
          type: KNOT_SYNCED
        })
      )
      .catch(() =>
        dispatch({
          type: KNOT_SYNCED
        })
      );
  };
}

export function updateTapLogs(newLog: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TAP_LOGS,
      newLog
    });
  };
}

export function updateTargetLogs(newLog: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TARGET_LOGS,
      newLog
    });
  };
}
