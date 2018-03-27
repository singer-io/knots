import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_TARGETS = 'UPDATE_TAPS';
export const TOKEN_LOADING = 'TOKEN_LOADING';
export const TOKEN_LOADED = 'TOKEN_LOADED';
export const TOKEN_LOADING_ERROR = 'TOKEN_LOADING_ERROR';
export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const UPDATE_DATASET = 'UPDATE_DATASET';

type actionType = {
  +type: string
};

export function submitFields(dataset, token) {
  return () => {
    axios
      .post(`${baseUrl}/target/`, {
        dataset_id: dataset,
        api_token: token
      })
      .then((response) => {
        console.log('Final response', response);
      })
      .catch(() => {
        console.log('Final post failed');
      });
  };
}

export function getToken(code) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TOKEN_LOADING
    });

    axios
      .post(`${baseUrl}/token/`, {
        code
      })
      .then((response) => {
        dispatch({
          type: TOKEN_LOADED,
          token: response.data.token
        });
      })
      .catch(
        dispatch({
          type: TOKEN_LOADING_ERROR
        })
      );
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
        const datasets = response.data.records.map((record) => record.title);
        console.log('The result', datasets);
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
