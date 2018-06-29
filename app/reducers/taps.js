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
import { tapPropertiesType } from '../utils/shared-types';

export type tapsStateType = {
  +tapsLoading: boolean,
  +tapSelected: boolean,
  +schemaLoading: boolean,
  +schemaLoaded: boolean,
  +taps: Array<string>,
  +selectedTap: tapPropertiesType,
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
  selectedTap: {
    name: '',
    image: ''
  },
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
        schemaLoaded: false,
        schemaLoading: true,
        schemaLogs: [],
        error: ''
      });
    case UPDATE_SCHEMA_LOGS:
      return Object.assign({}, state, {
        schemaLogs: [...state.schemaLogs, action.newLog]
      });
    case SCHEMA_RECEIVED:
      const compareStreams = (a, b) => {
        if (a.stream < b.stream) {
          return -1;
        } else if (a.stream > b.stream) {
          return 1;
        }
        return 0;
      };

      return Object.assign({}, state, {
        schemaLoading: false,
        schemaLoaded: true,
        schema: action.schema
          ? action.schema.sort(compareStreams)
          : state.schema,
        error: action.error
      });
    case UPDATE_SCHEMA_FIELD: {
      if (schema[action.index]) {
        const metadataIndexToUpdate = (stream) => {
          let indexToUpdate = -1;
          stream.metadata.forEach((metadata, index) => {
            if (metadata.breadcrumb.length === 0) {
              indexToUpdate = index;
            }
          });
          return indexToUpdate;
        };

        const setImpliedReplicationMethod = (stream, usesMetadata) => {
          const streamClone = Object.assign({}, stream);
          const { replicationMethod: repMethodMetadata = true } =
            usesMetadata || {};
          const indexToUpdate = metadataIndexToUpdate(streamClone);

          if (indexToUpdate > -1) {
            const forcedRepMethod =
              streamClone.metadata[indexToUpdate].metadata[
                'forced-replication-method'
              ];

            if (repMethodMetadata) {
              const repKey =
                streamClone.metadata[indexToUpdate].metadata['replication-key'];
              if (repKey) {
                streamClone.metadata[indexToUpdate].metadata[
                  'replication-method'
                ] =
                  'INCREMENTAL';
              } else if (!forcedRepMethod && !repKey) {
                streamClone.metadata[indexToUpdate].metadata[
                  'replication-method'
                ] =
                  'FULL_TABLE';
              }
              return streamClone;
            }
          }

          if (streamClone.replication_key) {
            streamClone.replication_method = 'INCREMENTAL';
          } else {
            streamClone.replication_method = 'FULL_TABLE';
          }
          return streamClone;
        };

        const setSelected = (stream, usesMetadata, newSelectedValue) => {
          const streamClone = Object.assign({}, stream);
          const { selected: selectedMetadata = true } = usesMetadata || {};
          const indexToUpdate = metadataIndexToUpdate(streamClone);
          if (selectedMetadata && indexToUpdate > -1) {
            if (!newSelectedValue) {
              delete streamClone.metadata[indexToUpdate].metadata[
                'replication-key'
              ];
              delete streamClone.metadata[indexToUpdate].metadata[
                'replication-method'
              ];
              const updatedMetadata = streamClone.metadata.map(
                (mdataProperties) => {
                  const fields = Object.assign({}, mdataProperties);
                  delete fields.metadata.selected;
                  return fields;
                }
              );
              streamClone.metadata = updatedMetadata;
            } else {
              const updatedMetadata = streamClone.metadata.map(
                (mdataProperties) => {
                  const fields = Object.assign({}, mdataProperties);
                  if (
                    !fields.metadata.inclusion ||
                    fields.metadata.inclusion === 'available'
                  ) {
                    fields.metadata.selected = newSelectedValue;
                  }
                  return fields;
                }
              );
              streamClone.metadata = updatedMetadata;
            }
          } else if (newSelectedValue) {
            streamClone.schema.selected = newSelectedValue;
            const schemaProperties = streamClone.schema.properties;
            Object.keys(schemaProperties).forEach((field) => {
              const fieldProperties = schemaProperties[field];
              if (
                !fieldProperties.inclusion ||
                fieldProperties.inclusion === 'available'
              ) {
                fieldProperties.selected = newSelectedValue;
              }
            });
          } else {
            delete streamClone.schema.selected;
            delete streamClone.replication_key;
            delete streamClone.replication_method;
            Object.keys(streamClone.schema.properties).forEach((field) => {
              delete streamClone.schema.properties[field].selected;
            });
          }
          return streamClone;
        };

        const setReplicationKey = (stream, usesMetadata, newReplicationKey) => {
          const streamClone = Object.assign({}, stream);
          const { replicationKey: repKeyMetadata = true } = usesMetadata || {};
          const indexToUpdate = metadataIndexToUpdate(streamClone);

          if (repKeyMetadata && indexToUpdate > -1) {
            streamClone.metadata[indexToUpdate].metadata[
              'replication-key'
            ] = newReplicationKey;
          } else {
            streamClone.replication_key = newReplicationKey;
          }
          return streamClone;
        };

        switch (action.field) {
          case 'selected':
            schema[action.index] = setSelected(
              schema[action.index],
              action.specImplementation.usesMetadata,
              action.value
            );

            schema[action.index] = setImpliedReplicationMethod(
              schema[action.index],
              action.specImplementation.usesMetadata
            );

            return Object.assign({}, state, {
              tapSchema: schema
            });
          case 'replication-key':
            schema[action.index] = setReplicationKey(
              schema[action.index],
              action.specImplementation.usesMetadata,
              action.value
            );

            schema[action.index] = setImpliedReplicationMethod(
              schema[action.index],
              action.specImplementation.usesMetadata
            );

            return Object.assign({}, state, {
              tapSchema: schema
            });
          default:
            return state;
        }
      }
      return state;
    }
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
          schema: action.schema,
          schemaLoaded: true
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
