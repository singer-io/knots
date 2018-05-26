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
import socketIOClient from 'socket.io-client';

const baseUrl = 'http://localhost:4321';
const socket = socketIOClient(baseUrl);

export const SCHEMA_LOADING = 'SCHEMA_LOADING';
export const SCHEMA_RECEIVED = 'SCHEMA_RECEIVED';
export const SCHEMA_ERROR = 'SCHEMA_ERROR';
export const UPDATE_SCHEMA = 'UPDATE_SCHEMA';
export const SUBMIT_SCHEMA = 'SUBMIT_SCHEMA';
export const SCHEMA_UPDATED = 'SCHEMA_UPDATED';
export const SCHEMA_UPDATE_FAILED = 'SCHEMA_UPDATE_FAILED';
export const DISCOVER_SCHEMA = 'DISCOVER_SCHEMA';

type actionType = {
  +type: string
};

let liveLogs = '';

export function fetchSchema(knot) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: SCHEMA_LOADING
    });

    axios
      .post(`${baseUrl}/schema/`, {
        knot
      })
      .then((response) =>
        dispatch({
          type: SCHEMA_RECEIVED,
          schema: response.data || []
        })
      )
      .catch(() =>
        dispatch({
          type: SCHEMA_ERROR
        })
      );
  };
}

export function editField(field, index, value) {
  return (dispatch: (action: actionType) => void) => {
    dispatch({
      type: UPDATE_SCHEMA,
      field,
      index,
      value
    });
  };
}

export function submitSchema(schema) {
  return (dispatch: (action: actionType) => void) => {
    axios
      .put(`${baseUrl}/schema/`, {
        streams: schema
      })
      .then(() => {
        dispatch({
          type: SCHEMA_UPDATED
        });
      })
      .catch(() => {
        dispatch({
          type: SCHEMA_UPDATE_FAILED
        });
      });
  };
}

export function discoveryLiveLogs() {
  return (dispatch: (action: actionType) => void) => {
    socket.on('live-logs', (data) => {
      liveLogs = liveLogs.concat(`${data} \n`);
      dispatch({ type: DISCOVER_SCHEMA, schema: [], liveLogs });
    });
  };
}
