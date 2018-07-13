import tapReducer, { defaultState } from '../../app/reducers/taps';
import * as tapActions from '../../app/actions/taps';

const taps = [
  {
    name: 'sampleTap1',
    tapImage: 'sampleTap1',
    tapKey: 'tap-sampleTap1'
  },
  {
    name: 'sampleTap2',
    tapImage: 'sampleTap2',
    tapKey: 'tap-sampleTap2'
  }
];
const selectedTap = { name: 'sampleTap' };
const updatedTap = {
  fieldValues: {
    api_type: 'BULK',
    client_id: '12090',
    client_secret: '',
    refresh_token: '',
    select_fields_by_default: true,
    start_date: ''
  }
};

describe('taps reducer', () => {
  it('should return the initial state', () => {
    expect(tapReducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle TAPS_LOADING', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.TAPS_LOADING
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        tapsLoading: true
      })
    );
  });

  it('should handle UPDATE_TAPS', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.UPDATE_TAPS,
        taps,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        tapsLoading: false,
        taps
      })
    );
  });

  it('should handle TAP_SELECTED', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.TAP_SELECTED,
        tap: selectedTap,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        tapSelected: true,
        selectedTap
      })
    );
  });

  it('should handle UPDATE_TAP_FIELD', () => {
    expect(
      tapReducer(defaultState, {
        type: tapActions.UPDATE_TAP_FIELD,
        tap: 'tap-salesforce',
        field: 'client_id',
        value: '12090'
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        'tap-salesforce': updatedTap
      })
    );
  });

  it('should handle SCHEMA_LOADING', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.SCHEMA_LOADING
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        schemaLoaded: false,
        schemaLoading: true,
        schemaLogs: [],
        error: ''
      })
    );
  });

  it('should handle UPDATE_SCHEMA_LOGS', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.UPDATE_SCHEMA_LOGS,
        newLog: ''
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        schemaLogs: ['']
      })
    );
  });

  it('should handle SCHEMA_RECIEVED', () => {});
  it('should handle UPDATE_SCHEMA_FIELD', () => {});

  it('should handle SCHEMA_UPDATED', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.SCHEMA_UPDATED,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        tapsLoading: false,
        schemaUpdated: true
      })
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.RESET_STORE
      })
    ).toEqual(defaultState);
  });
});
