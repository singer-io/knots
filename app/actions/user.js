import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const UPDATE_DATASET = 'UPDATE_DATASET';
export const SET_TOKEN = 'SET_TOKEN';

type actionType = {
  +type: string
};

export function setToken(token) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SET_TOKEN,
      token
    });
  };
}

export function getDatasets(token) {
  return (dispatch: (action: actionType) => void) => {
    axios({
      method: 'GET',
      url: 'https://api.data.world/v0/user/datasets/own',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        const datasets = response.data.records;
        dispatch({
          type: UPDATE_DATASETS,
          datasets
        });
      })
      .catch(console.log);
  };
}

export function setDataset(selectedDataset) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_DATASET,
      selectedDataset
    });
  };
}

export function fetchToken(knot) {
  return (dispatch: (action: actionType) => void) => {
    console.log('What I have received', knot);
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
