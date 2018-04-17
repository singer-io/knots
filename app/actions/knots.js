import axios from 'axios';
import socketIOClient from 'socket.io-client';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

export const UPDATE_KNOTS = 'UPDATE_KNOTS';
export const KNOT_RUNNING = 'KNOT_RUNNING';
export const KNOT_RUN_COMPLETE = 'KNOT_RUN_COMPLETE';
export const KNOT_RUN_ERROR = 'KNOT_RUN_ERROR';
export const KNOT_SAVED = 'KNOT_SAVED';
export const KNOT_SAVE_ERROR = 'KNOT_SAVE_ERROR';

type actionType = {
  +type: string
};

let syncLogs = '';
// const appendSyncLogs = (data) => {
//   syncLogs = syncLogs.concat(`=> ${data} \n`);
// };

export function fetchKnots() {
  return (dispatch: (action: actionType) => void) => {
    axios
      .get(`${baseUrl}/knots/`)
      .then((response) => {
        dispatch({
          type: UPDATE_KNOTS,
          knots: response.data
        });
      })
      .catch(() =>
        dispatch({
          type: UPDATE_KNOTS,
          knots: []
        })
      );
  };
}

export function sync(knot) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: KNOT_RUNNING,
      syncLogs
    });
    axios
      .post(`${baseUrl}/sync/`, { knot })
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

export function saveKnot(name) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .post(`${baseUrl}/save-knot/`, { name })
      .then(() =>
        dispatch({
          type: KNOT_SAVED
        })
      )
      .catch(() =>
        dispatch({
          type: KNOT_SAVE_ERROR
        })
      );
  };
}

export function download(knot) {
  axios
    .post(`${baseUrl}/download/`, { knot })
    .then(() => {
      axios({
        url: 'http://localhost:4321/download',
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
}
