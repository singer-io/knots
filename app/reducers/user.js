/* eslint-disable no-case-declarations */
import {
  UPDATE_DATASET,
  SET_TOKEN,
  TARGET_CONFIGURED,
  UPDATE_TARGET_FIELD
} from '../actions/user';

export type targetsStateType = {
  +targetConfigured: boolean,
  +'target-datadotworld': {
    fieldValues: {
      dataset_id: string,
      dataset_owner: string,
      api_token: string
    }
  },
  +'target-stitch': { fieldValues: { client_id: string, token: string } }
};

const defaultState = {
  targetConfigured: false,
  'target-datadotworld': { token: '', fieldValues: { dataset: '', owner: '' } },
  'target-stitch': { fieldValues: { client_id: '', token: '' } }
};

export default function targets(state = defaultState, action) {
  switch (action.type) {
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
    case UPDATE_TARGET_FIELD:
      const target = state[action.target];
      target.fieldValues[action.field] = action.value;

      return Object.assign({}, state, {
        [action.target]: target
      });
    default:
      return state;
  }
}
