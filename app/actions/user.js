// @flow
import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const UPDATE_DATASET = 'UPDATE_DATASET';
export const SET_TOKEN = 'SET_TOKEN';
export const UPDATE_TARGET_FIELD = 'UPDATE_TARGET_FIELD';

type actionType = {
  +type: string
};

export function setToken(token: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SET_TOKEN,
      token
    });
  };
}

export function setDataset(selectedDataset: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_DATASET,
      selectedDataset
    });
  };
}

export function fetchToken(knot: string) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .post(`${baseUrl}/token/`, {
        knot
      })
      .then((response) => {
        dispatch({
          type: SET_TOKEN,
          token: response.data.token
        });
      })
      .catch(() => {
        console.log('Final post failed');
      });
  };
}

export function updateField(target: string, field: string, value: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TARGET_FIELD,
      target,
      field,
      value
    });
  };
}
