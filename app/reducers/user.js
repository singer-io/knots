import { UPDATE_DATASETS, UPDATE_DATASET } from '../actions/user';

export type targetsStateType = {
  +datasets: Array<string>,
  +token: string,
  +selectedDataset: string
};

const defaultState = {
  datasets: [],
  token:
    'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJrbm90LWxvY2FsOmtpbnV0aGlhbiIsImlzcyI6ImNsaWVudDprbm90LWxvY2FsOmFnZW50OmtpbnV0aGlhbjo6Zjg1YjM3MjItOGJhNC00NDIzLTlkZmEtZjFiNGQxNjQ4NmYzIiwiaWF0IjoxNTIwOTQ5NTgzLCJyb2xlIjpbInVzZXJfYXBpX3dyaXRlIiwidXNlcl9hcGlfcmVhZCJdLCJleHAiOjE1MjczMzQzMTUsImdlbmVyYWwtcHVycG9zZSI6dHJ1ZX0.vnkCqNXd3i6Ba4jV5CqmlTO2GMJAzddLzUvy75vFpMNsruQBl48cIu4DnL4WVIgRsr1QmFcUL_HKtpLJNsoKFw',
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
