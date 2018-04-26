import {
  TAPS_LOADING,
  UPDATE_TAPS,
  UPDATE_TAP_FIELDS,
  UPDATE_TAP_FIELD,
  SCHEMA_RECEIVED
} from '../actions/taps';

export type tapsStateType = {
  +tapsLoading: boolean,
  +taps: Array<string>,
  +tapFields: Array<{}>,
  +fieldValues: {},
  +schema: Array<{}>,
  +error: boolean
};

const defaultState = {
  tapsLoading: false,
  taps: [],
  tapFields: [],
  fieldValues: {},
  schema: [],
  error: ''
};

export default function taps(state = defaultState, action) {
  const { fieldValues } = state;
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { tapsLoading: true });
    case UPDATE_TAPS:
      return Object.assign({}, state, {
        tapsLoading: false,
        taps: action.taps,
        error: action.error
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
    case SCHEMA_RECEIVED:
      return Object.assign({}, state, {
        tapsLoading: false,
        schema: action.schema,
        error: action.error
      });
    default:
      return state;
  }
}
