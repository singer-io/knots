/* eslint-disable no-case-declarations */
/*
 * Knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc. (http://data.world/).
 */

import {
  UPDATE_DATASET,
  SET_TOKEN,
  TARGET_CONFIGURED,
  UPDATE_TARGET_FIELD
} from '../actions/user';
import { LOADED_KNOT } from '../actions/knots';

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
  'target-datadotworld': {
    fieldValues: { dataset_id: '', dataset_owner: '', api_token: '' }
  },
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
    case LOADED_KNOT:
      const newTarget = state[action.target.name];
      newTarget.fieldValues = action.targetConfig;
      return Object.assign({}, state, {
        [action.target.name]: newTarget
      });
    default:
      return state;
  }
}
