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

export const TAPS_PAGE_LOADED = 'TAPS_PAGE_LOADED';
export const SCHEMA_PAGE_LOADED = 'SCHEMA_PAGE_LOADED';

export const TAPS_LOADING = 'TAPS_LOADING';
export const UPDATE_TAPS = 'UPDATE_TAPS';

export const SCHEMA_LOADING = 'SCHEMA_LOADING';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';

export const UPDATE_TAP_FIELD = 'UPDATE_TAP_FIELD';
export const UPDATE_SCHEMA_FIELD = 'UPDATE_SCHEMA_FIELD';

export const SCHEMA_UPDATED = 'SCHEMA_UPDATED';

export const UPDATE_SCHEMA_LOGS = 'UPDATE_SCHEMA_LOGS';

export const TAP_SELECTED = 'TAP_SELECTED';

type actionType = {
  +type: string
};

export function tapsPageLoaded() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TAPS_PAGE_LOADED
    });
  };
}

export function schemaPageLoaded() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_PAGE_LOADED
    });
  };
}

export function fetchTaps() {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: TAPS_LOADING
    });

    axios
      .get(`${baseUrl}/taps/`)
      .then((response) => {
        dispatch({
          type: UPDATE_TAPS,
          taps: response.data.taps
        });
      })
      .catch((error) => {
        dispatch({
          type: UPDATE_TAPS,
          taps: [],
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function selectTap(
  tap: { name: string, image: string, isLegacy: boolean },
  knotName: string
) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .post(`${baseUrl}/taps/select/`, {
        tap,
        knot: knotName
      })
      .then(() => {
        dispatch({
          type: TAP_SELECTED,
          tap
        });
      })
      .catch((error) => {
        dispatch({
          type: TAP_SELECTED,
          tap: '',
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function updateTapField(
  tap: string,
  field: string,
  value: string | number
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_TAP_FIELD,
      tap,
      field,
      value
    });
  };
}

export function submitConfig(
  tap: { name: string, image: string },
  config: { start_date?: string },
  knotName: string
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_LOADING
    });
    const tapConfig = config;

    const payload = {
      tap,
      tapConfig,
      knot: knotName
    };

    axios
      .post(`${baseUrl}/taps/config/`, payload)
      .then((response) => {
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: response.data.schema
        });
      })
      .catch((error) => {
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: [],
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function editSchemaField(
  field: string,
  index: string,
  value: boolean | string,
  isLegacy: boolean
) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA_FIELD,
      field,
      index,
      value,
      isLegacy
    });
  };
}

export function submitSchema(schema: {}, knot: string) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .put(`${baseUrl}/taps/schema/`, {
        schema: { streams: schema },
        knot
      })
      .then(() => {
        dispatch({
          type: SCHEMA_UPDATED
        });
      })
      .catch((error) => {
        dispatch({
          type: SCHEMA_UPDATED,
          error: error.response ? error.response.data.message : error.message
        });
      });
  };
}

export function updateSchemaLogs(newLog: string) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA_LOGS,
      newLog
    });
  };
}
