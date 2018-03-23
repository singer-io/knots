import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_KNOTS = 'UPDATE_KNOTS';

type actionType = {
  +type: string
};

export function fetchKnots() {
  return (dispatch: (action: actionType) => void) => {
    axios
      .get(`${baseUrl}/knots/`)
      .then((response) =>
        dispatch({
          type: UPDATE_KNOTS,
          knots: response.data
        })
      )
      .catch(() =>
        dispatch({
          type: UPDATE_KNOTS,
          knots: []
        })
      );
  };
}
