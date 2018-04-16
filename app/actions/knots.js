import axios from 'axios';
import socketIOClient from 'socket.io-client';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

export const UPDATE_KNOTS = 'UPDATE_KNOTS';
export const KNOT_RUNNING = 'KNOT_RUNNING';
export const KNOT_RUN_COMPLETE = 'KNOT_RUN_COMPLETE';
export const KNOT_RUN_ERROR = 'KNOT_RUN_ERROR';

type actionType = {
  +type: string
};

let syncLogs = '';
const appendSyncLogs = (data) => {
  syncLogs = syncLogs.concat(`=> ${data} \n`);
};

export function fetchKnots() {
  return (dispatch: (action: actionType) => void) => {
    axios
      .get(`${baseUrl}/knots/`)
      .then((response) =>
        dispatch({
          type: UPDATE_KNOTS,
          knots: response.data
        })
      )
      .catch(() =>
        dispatch({
          type: UPDATE_KNOTS,
          knots: []
        })
      );
  };
}

export function sync() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_RUNNING,
      syncLogs
    });
    axios
      .get(`${baseUrl}/sync/`)
      .then(() => {
        dispatch(syncLiveLogs());
      })
      .catch(() =>
        dispatch({
          type: KNOT_RUN_ERROR
        })
      );
  };
}

export function syncLiveLogs() {
  return (dispatch: (action: actionType) => void) => {
    socket.on('live-sync-logs', (data) => {
      syncLogs = syncLogs.concat(`=> ${data} \n`);
      dispatch({ type: KNOT_RUNNING, syncLogs });
      setTimeout(() => {
        dispatch({ type: KNOT_RUN_COMPLETE, syncLogs });
      }, 5000);
    });
    socket.on('complete', () => {
      dispatch({ type: KNOT_RUN_COMPLETE, syncLogs });
    });
  };
}
