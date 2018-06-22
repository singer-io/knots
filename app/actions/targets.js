/*
 * knots
 * Copyright 2018 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the
 * License.
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 *
 * This product includes software developed at
 * data.world, Inc.(http://data.world/).
 */

// @flow

import axios from 'axios';

const baseUrl = 'http://localhost:4321';

export const TARGETS_PAGE_LOADED = 'TARGETS_PAGE_LOADED';

export const TARGETS_LOADING = 'TARGETS_LOADING';
export const TARGET_SELECTED = 'TARGET_SELECTED';
export const UPDATE_TARGETS = 'UPDATE_TARGETS';
export const TARGET_INSTALLED = 'TARGET_INSTALLED';
export const TARGET_CONFIGURING = 'TARGET_CONFIGURING';
export const TARGET_CONFIGURED = 'TARGET_CONFIGURED';

type actionType = {
  +type: string
};

export function targetsPageLoaded() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGETS_PAGE_LOADED
    });
  };
}

export function getTargets() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGETS_LOADING
    });

    axios
      .get(`${baseUrl}/targets/`)
      .then((response) => {
        dispatch({
          type: UPDATE_TARGETS,
          targets: response.data.targets
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_TARGETS,
          targets: [],
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function selectTarget(
  target: { name: string, image: string },
  knot: string
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGET_SELECTED,
      target
    });

    axios
      .post(`${baseUrl}/targets/select`, { target, knot })
      .then(() => {
        dispatch({
          type: TARGET_INSTALLED
        });
      })
      .catch((error) => {
        dispatch({
          type: TARGET_INSTALLED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function submitFields(fieldValues: {}, knot: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TARGET_CONFIGURING
    });

    axios
      .post(`${baseUrl}/targets/`, { fieldValues, knot })
      .then(() => {
        dispatch({
          type: TARGET_CONFIGURED
        });
      })
      .catch((error) => {
        dispatch({
          type: TARGET_CONFIGURED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}
