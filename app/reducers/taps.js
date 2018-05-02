import {
  TAPS_LOADING,
  UPDATE_TAPS,
  UPDATE_TAP_FIELDS,
  UPDATE_TAP_FIELD,
  SCHEMA_RECEIVED,
  UPDATE_SCHEMA_FIELD,
  SCHEMA_LOADING,
  SCHEMA_UPDATED,
  SELECT_TAP
} from '../actions/taps';

export type tapsStateType = {
  +tapsLoading: boolean,
  +schemaLoading: boolean,
  +taps: Array<string>,
  +selectedTap: string,
  +tapFields: Array<{}>,
  +fieldValues: {},
  +schema: Array<{}>,
  +schemaUpdated: false,
  +error: string,
  +syntaxError: boolean,
  +showModal: boolean,
  +liveLogs: string
};

const defaultState = {
  tapsLoading: false,
  selectedTap: '',
  schemaLoading: false,
  taps: [],
  tapFields: [],
  fieldValues: {},
  schema: [],
  schemaUpdated: false,
  error: '',
  syntaxError: false,
  showModal: false,
  liveLogs: ''
};

export default function taps(state = defaultState, action) {
  const { fieldValues } = state;
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
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        schemaLoading: false,
        schema: action.schema,
        error: action.error
      });
    case UPDATE_SCHEMA_FIELD:
      if (schema[action.index]) {
        switch (action.field) {
          case 'selected':
            schema[action.index].metadata[0].metadata[action.field] =
              action.value;

            return Object.assign({}, state, {
              tapSchema: schema
            });
          case 'replication_key':
            schema[action.index].replication_key = action.value;

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
    case TAP_ERROR:
      return Object.assign({}, state, {
        showModal: true,
        schema: [],
        error: action.error,
        syntaxError: action.syntaxError
      });
    case TOGGLE_MODAL:
      return { ...state, showModal: !state.showModal };
    case DISCOVER_SCHEMA:
      return Object.assign({}, state, {
        tapsLoading: true,
        liveLogs: action.liveLogs,
        schema: action.schema
      });
    default:
      return state;
  }
}
