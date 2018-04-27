import { UPDATE_DATASETS, UPDATE_DATASET, SET_TOKEN } from '../actions/user';

export type targetsStateType = {
  +datasets: Array<{ id: string, owner: string }>,
  +token: string,
  +selectedDataset: string
};

const defaultState = {
  datasets: [],
  token: '',
  selectedDataset: ''
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_DATASETS:
      return Object.assign({}, state, { datasets: action.datasets });
    case UPDATE_DATASET:
      return Object.assign({}, state, {
        selectedDataset: `https://data.world/${action.selectedDataset}`
      });
    case SET_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      });
    default:
      return state;
  }
}
