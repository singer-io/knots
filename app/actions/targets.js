// @flow
import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const TARGET_SELECTED = 'TARGET_SELECTED';
export const TARGETS_LOADING = 'TARGETS_LOADING';
export const UPDATE_TARGETS = 'UPDATE_TARGETS';
export const TARGET_INSTALLED = 'TARGET_INSTALLED';
export const TARGET_CONFIGURING = 'TARGET_CONFIGURING';
export const TARGET_CONFIGURED = 'TARGET_CONFIGURED';

type actionType = {
  +type: string
};

export function getTargets() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGETS_LOADING
    });

    axios
      .get(`${baseUrl}/targets/`)
      .then((response) =>
        dispatch({
          type: UPDATE_TARGETS,
          targets: response.data
        })
      )
      .catch(() =>
        dispatch({
          type: TARGETS_LOADING,
          taps: []
        })
      );
  };
}

export function selectTarget(target: string, version: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGET_SELECTED,
      target
    });

    axios
      .post(`${baseUrl}/target/install`, {
        target,
        version
      })
      .then(() => {
        dispatch({
          type: TARGET_INSTALLED
        });
      })
      .catch((error) => {
        dispatch({
          type: TARGET_INSTALLED,
          error
        });
      });
  };
}

export function submitFields(dataset: string, token: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGET_CONFIGURING
    });

    const datasetArray = dataset.split('/');
    axios
      .post(`${baseUrl}/target/`, {
        owner: datasetArray[0],
        dataset_id: datasetArray[1],
        api_token: token
      })
      .then(() => {
        dispatch({
          type: TARGET_CONFIGURED
        });
      })
      .catch(() => {
        console.log('Final post failed');
      });
  };
}
