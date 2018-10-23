import tapReducer, { defaultState } from '../../app/reducers/taps';
import * as tapActions from '../../app/actions/taps';
import { LOADED_KNOT, RESET_STORE } from '../../app/actions/knots';
import {
  sampleTaps,
  sampleSelectedTap,
  sampleUpdatedSFTap,
  sampleUpdatedRedshiftTap,
  sampleTapConfig,
  sampleSchema
} from '../utils';

const taps = sampleTaps;
const selectedTap = sampleSelectedTap;
const updatedSFTap = sampleUpdatedSFTap;
const updatedRedshiftTap = sampleUpdatedRedshiftTap;
const tapConfig = sampleTapConfig;
const schema = sampleSchema;

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

  it('should handle MODIFY_SCHEMA', () => {
    const sampleCatalog = [
      {
        metadata: [
          {
            breadcrumb: [],
            metadata: {
              'table-key-properties': []
            }
          }
        ]
      }
    ];

    expect(
      tapReducer(
        { schema: sampleCatalog },
        {
          type: tapActions.MODIFY_SCHEMA,
          streamIndex: 0,
          field: "metadata[0].metadata['table-key-properties']",
          value: ['category_id']
        }
      )
    ).toEqual(
      Object.assign(
        {},
        {
          schema: [
            {
              metadata: [
                {
                  breadcrumb: [],
                  metadata: {
                    'table-key-properties': ['category_id']
                  }
                }
              ]
            }
          ]
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
