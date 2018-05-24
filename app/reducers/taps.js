import {
  TAPS_LOADING,
  UPDATE_TAPS,
  UPDATE_TAP_FIELDS,
  UPDATE_TAP_FIELD,
  SCHEMA_RECEIVED,
  UPDATE_SCHEMA_FIELD,
  SCHEMA_LOADING,
  SCHEMA_UPDATED,
  SELECT_TAP,
  UPDATE_SCHEMA_LOGS
} from '../actions/taps';

export type tapsStateType = {
  +tapsLoading: boolean,
  +schemaLoading: boolean,
  +schemaLoaded: boolean,
  +taps: Array<string>,
  +selectedTap: { name: string, image: string },
  +tapFields: Array<{}>,
  +fieldValues: {},
  +schema: Array<{}>,
  +schemaLogs: Array<string>,
  +schemaUpdated: false,
  +error: string,
  +liveLogs: string
};

const defaultState = {
  tapsLoading: false,
  selectedTap: { name: '', image: '' },
  schemaLoading: false,
  schemaLoaded: false,
  schemaLogs: [],
  taps: [],
  tapFields: [],
  fieldValues: {
    api_type: 'BULK',
    select_fields_by_default: true
  },
  schema: [],
  schemaUpdated: false,
  error: '',
  liveLogs: ''
};

export default function taps(state = defaultState, action) {
  const { fieldValues, schema } = state;
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { tapsLoading: true });
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        tapsLoading: false,
        taps: action.taps,
        error: action.error
      });
    case SELECT_TAP:
      return Object.assign({}, state, {
        selectedTap: action.tap
      });
    case UPDATE_TAP_FIELDS:
      return Object.assign({}, state, {
        tapsLoading: false,
        tapFields: action.tapFields,
        error: action.error
      });
    case UPDATE_TAP_FIELD:
      fieldValues[action.key] = action.value;
      return Object.assign({}, state, {
        fieldValues
      });
    case SCHEMA_LOADING:
      return Object.assign({}, state, {
        schemaLoading: true
      });
    case UPDATE_SCHEMA_LOGS:
      return Object.assign({}, state, {
        schemaLogs: [...state.schemaLogs, action.newLog]
      });
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        schemaLoading: false,
        schemaLoaded: true,
        schema: action.schema,
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

              schema[action.index].metadata[
                indexToUpdate
              ].metadata.selected = true;
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
    default:
      return state;
  }
}
