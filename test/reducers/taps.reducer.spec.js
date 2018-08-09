import tapReducer, { defaultState } from '../../app/reducers/taps';
import * as tapActions from '../../app/actions/taps';
import { LOADED_KNOT, RESET_STORE } from '../../app/actions/knots';

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
const selectedTap = { name: 'tap-salesforce' };
const updatedSFTap = {
  valid: false,
  fieldValues: {
    api_type: 'BULK',
    client_id: '12090',
    client_secret: '',
    refresh_token: '',
    select_fields_by_default: true,
    start_date: ''
  }
};
const updatedRedshiftTap = {
  valid: false,
  fieldValues: {
    host: 'testing',
    port: undefined,
    dbname: '',
    schema: 'public',
    user: '',
    password: '',
    start_date: ''
  }
};
const tapConfig = { start_date: '01-01-2017' };
const schema = [{ tap_stream_id: 'testing' }];

describe('taps reducer', () => {
  it('should return the initial state', () => {
    expect(tapReducer(undefined, {})).toEqual(defaultState());
  });

  it('should handle TAPS_LOADING', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.TAPS_LOADING
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
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
      Object.assign({}, defaultState(), {
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
      Object.assign({}, defaultState(), {
        tapSelected: true,
        selectedTap
      })
    );
  });

  it('should handle UPDATE_TAP_FIELD', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.UPDATE_TAP_FIELD,
        tap: 'tap-salesforce',
        field: 'client_id',
        value: '12090'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        'tap-salesforce': updatedSFTap
      })
    );

    expect(
      tapReducer(undefined, {
        type: tapActions.UPDATE_TAP_FIELD,
        tap: 'tap-redshift',
        field: 'host',
        value: 'testing'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        'tap-redshift': updatedRedshiftTap
      })
    );
  });

  it('should handle SCHEMA_LOADING', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.SCHEMA_LOADING
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
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
        newLog: 'logs'
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        schemaLogs: ['logs']
      })
    );
  });

  it('should handle SCHEMA_RECEIVED', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.SCHEMA_RECEIVED,
        schema,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        schema,
        schemaLoading: false,
        schemaLoaded: true
      })
    );
  });

  // TODO: Needs a more comprehensive test
  it('should handle UPDATE_SCHEMA_FIELD', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.UPDATE_SCHEMA_FIELD
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        schema: []
      })
    );
  });

  it('should handle SCHEMA_UPDATED', () => {
    expect(
      tapReducer(undefined, {
        type: tapActions.SCHEMA_UPDATED,
        error: ''
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        tapsLoading: false,
        schemaUpdated: true
      })
    );
  });

  it('should handle LOADED_KNOT', () => {
    expect(
      tapReducer(undefined, {
        type: LOADED_KNOT,
        tap: selectedTap,
        tapConfig,
        schema
      })
    ).toEqual(
      Object.assign(
        {},
        defaultState(),
        {
          selectedTap,
          schema,
          schemaLoaded: true
        },
        {
          [selectedTap.name]: Object.assign(
            {},
            defaultState[selectedTap.name],
            {
              fieldValues: tapConfig,
              valid: true
            }
          )
        }
      )
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      tapReducer(undefined, {
        type: RESET_STORE
      })
    ).toEqual(
      Object.assign({}, defaultState(), {
        'tap-salesforce': {
          valid: false,
          fieldValues: {
            client_id: '',
            client_secret: '',
            refresh_token: '',
            api_type: 'BULK',
            select_fields_by_default: true,
            start_date: ''
          }
        },
        'tap-redshift': {
          valid: false,
          fieldValues: {
            host: '',
            port: undefined,
            dbname: '',
            schema: 'public',
            user: '',
            password: '',
            start_date: ''
          }
        }
      })
    );
  });
});
