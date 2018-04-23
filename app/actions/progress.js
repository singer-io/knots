export function updateProgress() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: 'SCHEMA_LOADING'
    });
  };
}

export function update() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: 'SCHEMA_LOADING'
    });
  };
}
