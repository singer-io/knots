import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const TARGETS_LOADING = 'TARGETS_LOADING';
export const UPDATE_TARGETS = 'UPDATE_TARGETS';
export const TARGET_INSTALLED = 'TARGET_INSTALLED';

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

export function installTargets(target, version) {
  return (dispatch: (action: actionType) => void) => {
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
      .catch(() => {
        dispatch({
          type: TARGETS_LOADING
        });
      });
  };
}
