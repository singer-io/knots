import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_TAPS = 'UPDATE_TAPS';
export const TAPS_LOADING = 'TAPS_LOADING';
export const UPDATE_TAP_FIELDS = 'UPDATE_TAP_FIELDS';
export const SET_TAP_FIELDS = 'SET_TAP_FIELDS';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';

type actionType = {
  +type: string
};

export function fetchTapFields(tap, version) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TAPS_LOADING
    });

    axios
      .post(`${baseUrl}/taps/`, {
        tap,
        version
      })
      .then((response) =>
        dispatch({
          type: UPDATE_TAP_FIELDS,
          dockerVersion: response.data.dockerVersion,
          tapFields: response.data.config || []
        })
      )
      .catch(() =>
        dispatch({
          type: UPDATE_TAP_FIELDS,
          dockerInstalled: true,
          tapFields: []
        })
      );
  };
}

export function setTapFields(key, value, index) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SET_TAP_FIELDS,
      key,
      value,
      index
    });
  };
}

export function submitConfig(config) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TAPS_LOADING
    });

    axios
      .post(`${baseUrl}/tap/schema/`, {
        config
      })
      .then((response) => {
        console.log('This sis the schem a response', response);
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: response.data || []
        });
      })
      .catch(() =>
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: []
        })
      );
  };
}
