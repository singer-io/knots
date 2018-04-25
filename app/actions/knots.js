import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const DOCKER_VERSION_LOADING = 'DOCKER_VERSION_LOADING';
export const UPDATE_DOCKER_VERSION = 'UPDATE_DOCKER_VERSION';
export const DOCKER_VERSION_ERROR = 'DOCKER_VERSION_ERROR';

type actionType = {
  +type: string
};

export function detectDocker() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: DOCKER_VERSION_LOADING
    });

    axios
      .get(`${baseUrl}/docker/`)
      .then((response) =>
        dispatch({
          type: UPDATE_DOCKER_VERSION,
          version: response.data.version,
          error: response.data.version
        })
      )
      .catch((error) =>
        dispatch({
          type: DOCKER_VERSION_ERROR,
          error: JSON.stringify(error)
        })
      );
  };
}
