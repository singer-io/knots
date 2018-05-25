// @flow
import axios from 'axios';
import { shell } from 'electron';

const baseUrl = 'http://localhost:4321';

export const DETECTING_DOCKER = 'DETECTING_DOCKER';
export const UPDATE_DOCKER_VERSION = 'UPDATE_DOCKER_VERSION';
export const FETCHING_KNOTS = 'FETCHING_KNOTS';
export const FETCHED_KNOTS = 'FETCHED_KNOTS';

export const UPDATE_TAP_LOGS = 'UPDATE_TAP_LOGS';
export const UPDATE_TARGET_LOGS = 'UPDATE_TARGET_LOGS';
export const UPDATE_NAME = 'UPDATE_NAME';
export const KNOT_SYNCING = 'KNOT_SYNCING';
export const KNOT_SYNCED = 'KNOT_SYNCED';
export const KNOT_DELETED = 'KNOT_DELETED';
export const FINAL_STEP = 'FINAL_STEP';

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
          version: response.data.version
        })
      )
      .catch((error) => {
        dispatch({
          type: UPDATE_DOCKER_VERSION,
          version: '',
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function getKnots() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: FETCHING_KNOTS
    });

    axios
      .get(`${baseUrl}/knots/`)
      .then((response) => {
        dispatch({
          type: FETCHED_KNOTS,
          knots: response.data.knots
        });
      })
      .catch((error) => {
        dispatch({
          type: FETCHED_KNOTS,
          knots: [],
          error: error.response ? error.response.data.message : error.message
        });
      });
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

export function save(
  knotName: string,
  selectedTap: { name: string, image: string },
  selectedTarget: { name: string, image: string }
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_SYNCING
    });

    axios
      .post(`${baseUrl}/knots/save`, {
        knotName,
        tap: selectedTap,
        target: selectedTarget
      })
      .then(() =>
        dispatch({
          type: KNOT_SYNCED
        })
      )
      .catch((error) => {
        dispatch({
          type: KNOT_SYNCED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function sync(knotName: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_SYNCING
    });
    dispatch({
      type: FINAL_STEP
    });

    axios
      .post(`${baseUrl}/sync`, { knotName })
      .then(() =>
        dispatch({
          type: KNOT_SYNCED
        })
      )
      .catch((error) => {
        dispatch({
          type: KNOT_SYNCED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function partialSync(knotName: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_SYNCING
    });
    dispatch({
      type: FINAL_STEP
    });

    axios
      .post(`${baseUrl}/sync/partial`, { knotName })
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
      .post(`${baseUrl}/knots/delete`, { knot })
      .then(() => {
        dispatch({
          type: KNOT_DELETED
        });
      })
      .catch((error) => {
        dispatch({
          type: KNOT_DELETED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function downloadKnot(knot: string) {
  return () => {
    axios
      .post(`${baseUrl}/knots/download/`, { knot })
      .then(() => {
        shell.openExternal(`http://localhost:4321/knots/download?knot=${knot}`);
      })
      .catch();
  };
}
