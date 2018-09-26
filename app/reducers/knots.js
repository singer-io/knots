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

import {
  UPDATE_DOCKER_VERSION,
  UPDATE_TAP_LOGS,
  UPDATE_TAP_STATE_VALUE,
  UPDATE_TARGET_LOGS,
  UPDATE_NAME,
  KNOT_SYNCING,
  KNOT_SYNCED,
  DETECTING_DOCKER,
  FETCHING_KNOTS,
  FETCHED_KNOTS,
  KNOT_DELETED,
  LOADED_KNOT,
  LOADING_KNOT,
  DOCKER_RUNNING,
  RESET_STORE,
  RESET_KNOT_ERROR,
  GENERATED_UUID,
  SEEDING_STATE
} from '../actions/knots';

export type knotsStateType = {
  +detectingDocker: boolean,
  +dockerVersion: string,
  +dockerRunning: boolean,
  +dockerError: string,
  +dockerVerified: boolean,

  +fetchingKnots: boolean,
  +knots: Array<string>,

  +tapLogs: Array<string>,
  +tapSeededState: { [string]: string },
  +targetLogs: Array<string>,
  +knotName: string,
  +syncing: boolean,
  +knotDeleted: boolean,
  +knotError: string,
  +knotLoading: boolean,
  +knotLoaded: boolean,

  +uuid: string,
  +schema: Array<{}>
};

export const defaultState = () => ({
  detectingDocker: false,
  dockerVersion: '',
  dockerRunning: false,
  dockerError: '',
  dockerVerified: false,

  fetchingKnots: false,
  knots: [],
  tapLogs: [],
  tapSeededState: {},
  targetLogs: [],
  knotName: '',
  knotSyncing: false,
  knotSynced: false,
  knotDeleted: false,
  knotError: '',
  knotLoading: false,
  knotLoaded: false,

  uuid: '',
  schema: []
});

export default function knots(state = defaultState(), action) {
  switch (action.type) {
    case DETECTING_DOCKER:
      return Object.assign({}, state, {
        detectingDocker: true
      });
    case UPDATE_DOCKER_VERSION:
      return Object.assign({}, state, {
        dockerVersion: action.version,
        dockerError: action.error,
        dockerVerified: !!action.error,
        detectingDocker: false
      });
    case DOCKER_RUNNING:
      return Object.assign({}, state, {
        dockerRunning: action.running,
        dockerError: action.error,
        dockerVerified: true,
        detectingDocker: false
      });
    case FETCHING_KNOTS:
      return Object.assign({}, state, {
        fetchingKnots: true,
        knotDeleted: false
      });
    case FETCHED_KNOTS:
      return Object.assign({}, state, {
        fetchingKnots: false,
        knots: action.knots || []
      });
    case UPDATE_TAP_LOGS:
      return Object.assign({}, state, {
        tapLogs: action.newLog.split('\n')
      });
    case UPDATE_TAP_STATE_VALUE: {
      const selectedDate = action.date;
      const tapStateObj = {};
      state.schema.forEach((schemaObj) => {
        tapStateObj[schemaObj.stream] = selectedDate;
      });
      return Object.assign({}, state, {
        tapSeededState: tapStateObj
      });
    }
    case UPDATE_TARGET_LOGS:
      return Object.assign({}, state, {
        targetLogs: action.newLog.split('\n')
      });
    case UPDATE_NAME:
      return Object.assign({}, state, {
        knotName: action.name
      });
    case KNOT_SYNCING:
      return Object.assign({}, state, {
        knotSyncing: true,
        knotSynced: false,
        tapLogs: [],
        targetLogs: []
      });
    case KNOT_SYNCED:
      return Object.assign({}, state, {
        knotSyncing: false,
        knotSynced: true,
        knotError: action.error || ''
      });
    case KNOT_DELETED:
      return Object.assign({}, state, {
        knotDeleted: true
      });
    case LOADING_KNOT:
      return Object.assign({}, state, {
        knotLoading: true
      });
    case LOADED_KNOT:
      return Object.assign({}, state, {
        knotLoading: false,
        knotLoaded: true,
        knotName: action.knotName,
        knotError: action.error || ''
      });
    case RESET_KNOT_ERROR:
      return Object.assign({}, state, {
        knotError: '',
        knotSyncing: false,
        knotSynced: false
      });
    case GENERATED_UUID:
      return Object.assign({}, state, {
        uuid: action.uuid
      });
    case SEEDING_STATE:
      return Object.assign({}, state, {
        knotName: action.knotName,
        knotError: action.error || '',
        schema: action.schema
      });
    case RESET_STORE:
      // Fact that objects are passed by reference makes this necessary, open to other suggestions
      return defaultState();
    default:
      return state;
  }
}
