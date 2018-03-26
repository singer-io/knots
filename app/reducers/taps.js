import {
  UPDATE_TAPS,
  TAPS_LOADING,
  UPDATE_TAP_FIELDS,
  SET_TAP_FIELDS
} from '../actions/connect';

export type tapsStateType = {
  +loading: boolean,
  +taps: Array<string>,
  +dockerInstalled: boolean,
  +dockerVersion: string,
  +tapFields: Array<{}>,
  +fieldValues: {}
};

const defaultState = {
  loading: false,
  taps: [],
  dockerVersion: '',
  tapFields: [],
  fieldValues: {}
};

export default function taps(state = defaultState, action) {
  const fields = state.tapFields;
  const values = state.fieldValues;
  switch (action.type) {
    case TAPS_LOADING:
      return Object.assign({}, state, { loading: false });
    case UPDATE_TAPS:
      return Object.assign({}, state, { taps: action.taps, loading: false });
    case UPDATE_TAP_FIELDS:
      return Object.assign({}, state, {
        taps: action.taps,
        loading: false,
        dockerVersion: action.dockerVersion,
        tapFields: action.tapFields
      });
    case SET_TAP_FIELDS:
      console.log('This is the action', action);
      console.log('These are the otheres', fields, values);
      fields[action.index].value = action.value;
      values[action.key] = action.value;

      return Object.assign({}, state, {
        tapFields: fields,
        fieldValues: values
      });
    default:
      return state;
  }
}
