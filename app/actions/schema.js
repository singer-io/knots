import axios from 'axios';
import socketIOClient from 'socket.io-client';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

export const SCHEMA_LOADING = 'SCHEMA_LOADING';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';
export const UPDATE_SCHEMA = 'UPDATE_SCHEMA';
export const SUBMIT_SCHEMA = 'SUBMIT_SCHEMA';
export const SCHEMA_UPDATED = 'SCHEMA_UPDATED';
export const SCHEMA_UPDATE_FAILED = 'SCHEMA_UPDATE_FAILED';
export const DISCOVER_SCHEMA = 'DISCOVER_SCHEMA';

type actionType = {
  +type: string
};

let liveLogs = '';

export function fetchSchema(knot) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_LOADING
    });

    axios
      .post(`${baseUrl}/schema/`, {
        knot
      })
      .then((response) =>
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: response.data || []
        })
      )
      .catch(() =>
        dispatch({
          type: SCHEMA_ERROR
        })
      );
  };
}

export function editField(field, index, value) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA,
      field,
      index,
      value
    });
  };
}

export function submitSchema(schema) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .put(`${baseUrl}/schema/`, {
        streams: schema
      })
      .then(() => {
        dispatch({
          type: SCHEMA_UPDATED
        });
      })
      .catch(() => {
        dispatch({
          type: SCHEMA_UPDATE_FAILED
        });
      });
  };
}

export function discoveryLiveLogs() {
  return (dispatch: (action: actionType) => void) => {
    socket.on('live-logs', (data) => {
      liveLogs = liveLogs.concat(`${data} \n`);
      dispatch({ type: DISCOVER_SCHEMA, schema: [], liveLogs });
    });
  };
}
