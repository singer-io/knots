import { UPDATE_DATASETS, UPDATE_DATASET } from '../actions/user';

export type targetsStateType = {
  +datasets: Array<string>,
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
        selectedDataset: action.selectedDataset
      });
    default:
      return state;
  }
}
