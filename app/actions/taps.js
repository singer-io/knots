// @flow
import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const TAPS_LOADING = 'TAPS_LOADING';
export const UPDATE_TAPS = 'UPDATE_TAPS';
export const SELECT_TAP = 'SELECT_TAP';
export const UPDATE_TAP_FIELDS = 'UPDATE_TAP_FIELDS';
export const UPDATE_TAP_FIELD = 'UPDATE_TAP_FIELD';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';
export const UPDATE_SCHEMA_FIELD = 'UPDATE_SCHEMA_FIELD';
export const SCHEMA_LOADING = 'SCHEMA_LOADING';
export const SCHEMA_UPDATED = 'SCHEMA_UPDATED';
export const TAP_ERROR = 'TAP_ERROR';
export const TOGGLE_MODAL = 'TOGGLE_MODAL';
export const DISCOVER_SCHEMA = 'DISCOVER_SCHEMA';
export const UPDATE_SCHEMA_LOGS = 'UPDATE_SCHEMA_LOGS';

type actionType = {
  +type: string
};

export function fetchTaps() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TAPS_LOADING
    });

    axios
      .get(`${baseUrl}/taps/`)
      .then((response) =>
        dispatch({
          type: UPDATE_TAPS,
          taps: response.data.taps,
          error: response.data.error
        })
      )
      .catch((error) =>
        dispatch({
          type: UPDATE_TAPS,
          taps: [],
          error
        })
      );
  };
}

export function selectTap(tap: { name: string, image: string }) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SELECT_TAP,
      tap
    });

    axios
      .post(`${baseUrl}/taps/`, {
        tap
      })
      .then((response) => {
        console.log('The tap fields', response.data);
        dispatch({
          type: UPDATE_TAP_FIELDS,
          tapFields: response.data.config,
          error: response.data.error
        });
      })
      .catch((error) =>
        dispatch({
          type: UPDATE_TAP_FIELDS,
          tapFields: [],
          error
        })
      );
  };
}

export function updateTapField(key: string, value: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TAP_FIELD,
      key,
      value
    });
  };
}

function ISODateString(d) {
  function pad(n) {
    return n < 10 ? `0${n}` : n;
  }
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(
    d.getUTCDate()
  )}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(
    d.getUTCSeconds()
  )}Z`;
}

export function submitConfig(
  tap: { name: string, image: string },
  config: { start_date?: string }
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_LOADING
    });
    const tapConfig = config;

    if (tapConfig.start_date) {
      tapConfig.start_date = ISODateString(new Date(tapConfig.start_date));
    }

    axios
      .post(`${baseUrl}/tap/config/`, {
        tap,
        tapConfig
      })
      .then((response) => {
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: response.data.schema,
          error: response.data.error
        });
      })
      .catch((error) => {
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: [],
          error: error.toString()
        });
      });
  };
}

export function editSchemaField(field: string, index: string, value: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA_FIELD,
      field,
      index,
      value
    });
  };
}

export function submitSchema(schema: {}) {
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
      .catch((error) => {
        dispatch({
          type: SCHEMA_UPDATED,
          error
        });
      });
  };
}

export function toggle() {
  return (dispatch: (action: actionType) => void) =>
    dispatch({ type: TOGGLE_MODAL });
}

export function updateSchemaLogs(newLog: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA_LOGS,
      newLog
    });
  };
}
