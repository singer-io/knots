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

/* eslint-disable no-case-declarations */

import {
  TAPS_LOADING,
  UPDATE_TAPS,
  UPDATE_TAP_FIELD,
  SCHEMA_RECEIVED,
  UPDATE_SCHEMA_FIELD,
  SCHEMA_LOADING,
  SCHEMA_UPDATED,
  UPDATE_SCHEMA_LOGS,
  TAP_SELECTED
} from '../actions/taps';
import { LOADED_KNOT, RESET_STORE } from '../actions/knots';

export type tapsStateType = {
  +tapsLoading: boolean,
  +tapSelected: boolean,
  +schemaLoading: boolean,
  +schemaLoaded: boolean,
  +taps: Array<string>,
  +selectedTap: { name: string, image: string },
  +schema: Array<{}>,
  +schemaLogs: Array<string>,
  +schemaUpdated: false,
  +error: string,
  +'tap-redshift': {
    fieldValues: {
      host: string,
      port: number,
      dbname: string,
      schema: string,
      user: string,
      password: string
    }
  },
  'tap-salesforce': {
    fieldValues: {
      client_id: string,
      client_secret: string,
      refresh_token: string,
      api_type: string,
      select_fields_by_default: string,
      start_date: string
    }
  }
};

const defaultState = {
  tapsLoading: false,
  tapSelected: false,
  selectedTap: { name: '', image: '' },
  schemaLoading: false,
  schemaLoaded: false,
  schemaLogs: [],
  taps: [],

  schema: [],
  schemaUpdated: false,
  error: '',
  'tap-redshift': {
    fieldValues: {
      host: '',
      port: undefined,
      dbname: '',
      schema: 'public',
      user: '',
      password: '',
      start_date: ''
    }
  },
  'tap-salesforce': {
    fieldValues: {
      client_id: '',
      client_secret: '',
      refresh_token: '',
      api_type: 'BULK',
      select_fields_by_default: true,
      start_date: ''
    }
  }
};

export default function taps(state = defaultState, action) {
  const { schema } = state;

  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { tapsLoading: true });
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        tapsLoading: false,
        taps: action.taps,
        error: action.error
      });
    case TAP_SELECTED:
      return Object.assign({}, state, {
        tapSelected: !action.error,
        selectedTap: action.tap,
        error: action.error
      });
    case UPDATE_TAP_FIELD:
      const tap = state[action.tap];
      tap.fieldValues[action.field] = action.value;

      return Object.assign({}, state, {
        [action.tap]: tap
      });
    case SCHEMA_LOADING:
      return Object.assign({}, state, {
        schemaLoading: true,
        schemaLogs: []
      });
    case UPDATE_SCHEMA_LOGS:
      return Object.assign({}, state, {
        schemaLogs: [...state.schemaLogs, action.newLog]
      });
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        schemaLoading: false,
        schemaLoaded: true,
        schema: state.schema.length > 0 ? state.schema : action.schema,
        error: action.error
      });
    case UPDATE_SCHEMA_FIELD:
      if (schema[action.index]) {
        let indexToUpdate;
        switch (action.field) {
          case 'selected':
            // Find the metadata with an empty breadcrumb and update its metadata
            schema[action.index].metadata.forEach((metadata, index) => {
              if (metadata.breadcrumb.length === 0) {
                indexToUpdate = index;
              }
            });
            schema[action.index].metadata[indexToUpdate].metadata[
              action.field
            ] =
              action.value;
            return Object.assign({}, state, {
              tapSchema: schema
            });
          case 'replication-key':
            schema[action.index].metadata.forEach((metadata, index) => {
              if (metadata.breadcrumb.length === 0) {
                indexToUpdate = index;
              }
            });

            // Select a stream when a user chooses its replication key
            if (action.value === '') {
              delete schema[action.index].metadata[indexToUpdate].metadata[
                'replication-key'
              ];

              delete schema[action.index].metadata[indexToUpdate].metadata
                .selected;
            } else {
              schema[action.index].metadata[indexToUpdate].metadata[
                'replication-key'
              ] =
                action.value;
            }

            return Object.assign({}, state, {
              tapSchema: schema
            });
          default:
            return state;
        }
      }
      return state;
    case SCHEMA_UPDATED:
      return Object.assign({}, state, {
        tapsLoading: false,
        schemaUpdated: true,
        error: action.error
      });
    case LOADED_KNOT:
      const savedTap = state[action.tap.name];
      savedTap.fieldValues = action.tapConfig;

      return Object.assign(
        {},
        state,
        {
          selectedTap: action.tap,
          schema: action.schema
        },
        { [action.tap.name]: savedTap }
      );

    case RESET_STORE:
      // Fact that objects are passed by reference makes this necessary, open to other suggestions
      return {
        tapsLoading: false,
        tapSelected: false,
        selectedTap: { name: '', image: '' },
        schemaLoading: false,
        schemaLoaded: false,
        schemaLogs: [],
        taps: [],

        schema: [],
        schemaUpdated: false,
        error: '',
        'tap-redshift': {
          fieldValues: {
            host: '',
            port: undefined,
            dbname: '',
            schema: 'public',
            user: '',
            password: '',
            start_date: ''
          }
        },
        'tap-salesforce': {
          fieldValues: {
            client_id: '',
            client_secret: '',
            refresh_token: '',
            api_type: 'BULK',
            select_fields_by_default: true,
            start_date: ''
          }
        }
      };
    default:
      return state;
  }
}
