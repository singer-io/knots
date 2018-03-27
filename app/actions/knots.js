import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_KNOTS = 'UPDATE_KNOTS';
export const KNOT_RUNNING = 'KNOT_RUNNING';
export const KNOT_RUN_COMPLETE = 'KNOT_RUN_COMPLETE';
export const KNOT_RUN_ERROR = 'KNOT_RUN_ERROR';

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
          type: KNOT_RUN_ERROR
        })
      );
  };
}
