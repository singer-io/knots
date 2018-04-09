import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const SCHEMA_LOADING = 'UPDATE_SCHEMA';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';
export const UPDATE_SCHEMA = 'UPDATE_SCHEMA';
export const SUBMIT_SCHEMA = 'SUBMIT_SCHEMA';
export const SCHEMA_UPDATED = 'SCHEMA_UPDATED';
export const SCHEMA_UPDATE_FAILED = 'SCHEMA_UPDATE_FAILED';

type actionType = {
  +type: string
};

export function fetchSchema() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_LOADING
    });

    axios
      .get(`${baseUrl}/schema/`)
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
  console.log('These are my arguments', field, index, value);
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
      .then((res) => {
        console.log('This is the response', res);
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
