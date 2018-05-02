import {
  UPDATE_DATASETS,
  UPDATE_DATASET,
  SET_TOKEN,
  TARGET_CONFIGURED
} from '../actions/user';

export type targetsStateType = {
  +datasets: Array<{ id: string, owner: string }>,
  +token: string,
  +selectedDataset: string,
  +targetConfigured: boolean
};

const defaultState = {
  datasets: [],
  token: '',
  selectedDataset: '',
  targetConfigured: false
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
    case UPDATE_DATASETS:
      return Object.assign({}, state, { datasets: action.datasets });
    case UPDATE_DATASET:
      return Object.assign({}, state, {
        selectedDataset: action.selectedDataset
      });
    case SET_TOKEN:
      return Object.assign({}, state, {
        token: action.token
      });
    case TARGET_CONFIGURED:
      return Object.assign({}, state, {
        targetConfigured: true
      });
    default:
      return state;
  }
}
