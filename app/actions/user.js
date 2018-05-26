// @flow
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

import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export const UPDATE_DATASET = 'UPDATE_DATASET';
export const SET_TOKEN = 'SET_TOKEN';
export const UPDATE_TARGET_FIELD = 'UPDATE_TARGET_FIELD';

type actionType = {
  +type: string
};

export function setToken(token: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SET_TOKEN,
      token
    });
  };
}

export function fetchToken(knot: string) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .post(`${baseUrl}/token/`, {
        knot
      })
      .then((response) => {
        dispatch({
          type: SET_TOKEN,
          token: response.data.token
        });
      })
      .catch(() => {
        console.log('Final post failed');
      });
  };
}

export function updateField(target: string, field: string, value: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TARGET_FIELD,
      target,
      field,
      value
    });
  };
}
