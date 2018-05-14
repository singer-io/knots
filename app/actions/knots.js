// @flow
import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const DETECTING_DOCKER = 'DETECTING_DOCKER';
export const UPDATE_DOCKER_VERSION = 'UPDATE_DOCKER_VERSION';
export const DOCKER_VERSION_ERROR = 'DOCKER_VERSION_ERROR';
export const FETCHING_KNOTS = 'FETCHING_KNOTS';
export const FETCHED_KNOTS = 'FETCHED_KNOTS';
export const UPDATE_TAP_LOGS = 'UPDATE_TAP_LOGS';
export const UPDATE_TARGET_LOGS = 'UPDATE_TARGET_LOGS';
export const UPDATE_NAME = 'UPDATE_NAME';
export const KNOT_SYNCING = 'KNOT_SYNCING';
export const KNOT_SYNCED = 'KNOT_SYNCED';
export const KNOT_DELETED = 'KNOT_DELETED';

type actionType = {
  +type: string
};

export function detectDocker() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: DETECTING_DOCKER
    });

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

export function getKnots() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: FETCHING_KNOTS
    });

    axios
      .get(`${baseUrl}/knots/`)
      .then((response) =>
        dispatch({
          type: FETCHED_KNOTS,
          knots: response.data.knots,
          error: response.data.error
        })
      )
      .catch((error) =>
        dispatch({
          type: FETCHED_KNOTS,
          knots: [],
          error: error.toString()
        })
      );
  };
}

export function updateName(name: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_NAME,
      name
    });
  };
}

export function save(selectedTap: string, knotName: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_SYNCING
    });

    axios
      .post(`${baseUrl}/save`, { tap: selectedTap, knotName })
      .then(() =>
        dispatch({
          type: KNOT_SYNCED
        })
      )
      .catch((error) =>
        dispatch({
          type: KNOT_SYNCED,
          error: error.toString()
        })
      );
  };
}

export function sync(tap: string) {
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

export function deleteKnot(knot: string) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .post(`${baseUrl}/delete`, { knot })
      .then(() =>
        dispatch({
          type: KNOT_DELETED
        })
      )
      .catch();
  };
}

export function downloadKnot(knot: string) {
  return () => {
    axios
      .post(`${baseUrl}/download/`, { knot })
      .then(() => {
        console.log('Progress');
        axios({
          url: `http://localhost:4321/download?knot=${knot}`,
          method: 'GET',
          responseType: 'blob' // important
        })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${knot}.zip`);
            document.body.appendChild(link);
            link.click();
          })
          .catch();
      })
      .catch();
  };
}
