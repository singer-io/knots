import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_KNOTS = 'UPDATE_KNOTS';
export const KNOT_RUNNING = 'KNOT_RUNNING';
export const KNOT_RUN_COMPLETE = 'KNOT_RUN_COMPLETE';
export const KNOT_RUN_ERROR = 'KNOT_RUN_ERROR';
export const SHOW_MODAL = 'SHOW_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const SET_KNOT_NAME = 'SET_KNOT_NAME';
export const SAVE_KNOT = 'SAVE_KNOT';

type actionType = {
  +type: string
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
      type: KNOT_RUNNING
    });
    axios
      .get(`${baseUrl}/sync/`)
      .then(() =>
        dispatch({
          type: KNOT_RUN_COMPLETE
        })
      )
      .catch(() =>
        dispatch({
          type: KNOT_RUN_ERROR,
          synced: false
        })
      );
  };
}

export function showModal() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SHOW_MODAL,
      showSaveModal: true
    });
  };
}

export function closeModal() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: CLOSE_MODAL
    });
  };
}

export function setKnotName(name) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SET_KNOT_NAME,
      name
    });
  };
}

export function saveKnot(name) {
  axios
    .post('/save-knot/', { name })
    .then((res) => {
      console.log(res);
    })
    .catch();
}
