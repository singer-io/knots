import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as tapActions from '../../app/actions/taps';
import { sampleTaps, sampleTapConfig, sampleSchema } from '../utils';

const baseUrl = 'http://localhost:4321';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const taps = sampleTaps;
const newLog = '';
const tap = 'sampleTap';
const field = 'name';
const value = '';
const knot = '';
const index = 1;
const tapConfig = sampleTapConfig;
const skipDiscovery = false;
const schema = sampleSchema;
const specImplementation = {};

describe('taps actions', () => {
  describe('taps page loaded', () => {
    it('should dispatch TAPS_PAGE_LOADED', () => {
      const store = mockStore({});

      const expectedActions = [{ type: tapActions.TAPS_PAGE_LOADED }];

      store.dispatch(tapActions.tapsPageLoaded());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('schema page loaded', () => {
    it('should dispatch SCHEMA_PAGE_LOADED', () => {
      const store = mockStore({});

      const expectedActions = [{ type: tapActions.SCHEMA_PAGE_LOADED }];

      store.dispatch(tapActions.schemaPageLoaded());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('fetch taps', () => {
    it('should dispatch UPDATE_TAPS with list of taps', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .get('/')
        .reply(200, {
          taps
        });

      const expectedActions = [
        {
          type: tapActions.TAPS_LOADING
        },
        {
          type: tapActions.UPDATE_TAPS,
          taps
        }
      ];

      return store.dispatch(tapActions.fetchTaps()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch UPDATE_TAPS with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .get('/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: tapActions.TAPS_LOADING
        },
        {
          type: tapActions.UPDATE_TAPS,
          taps: [],
          error: 'error message'
        }
      ];

      return store.dispatch(tapActions.fetchTaps()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('select tap', () => {
    it('should dispatch TAP_SELECTED with specific tap', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/select/', {
          tap: taps[0],
          uuid: 'qwertyui',
          knot: 'tap'
        })
        .reply(200, {});

      const expectedActions = [
        {
          type: tapActions.TAP_SELECTED,
          tap: taps[0]
        }
      ];

      return store
        .dispatch(tapActions.selectTap(taps[0], 'qwertyui', 'tap'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch TAP_SELECTED with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/select/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: tapActions.TAP_SELECTED,
          tap: '',
          error: 'error message'
        }
      ];

      return store
        .dispatch(tapActions.selectTap(undefined, undefined))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('update tap field', () => {
    it('should dispatch UPDATE_TAP_FIELD', () => {
      const store = mockStore({});

      const expectedActions = [
        {
          type: tapActions.UPDATE_TAP_FIELD,
          tap,
          field,
          value
        }
      ];

      store.dispatch(tapActions.updateTapField(tap, field, value));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('submit config', () => {
    it('should dispatch SCHEMA_RECEIVED with specific tap', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/config/', {
          tap: taps[0],
          tapConfig,
          uuid: 'asdfgjk',
          knot,
          skipDiscovery
        })
        .reply(200, { schema });

      const expectedActions = [
        {
          type: tapActions.SCHEMA_LOADING
        },
        {
          type: tapActions.SCHEMA_RECEIVED,
          schema
        }
      ];

      return store
        .dispatch(
          tapActions.submitConfig(
            taps[0],
            tapConfig,
            'asdfgjk',
            knot,
            skipDiscovery
          )
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch SCHEMA_RECEIVED with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/taps/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/config/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: tapActions.SCHEMA_LOADING
        },
        {
          type: tapActions.SCHEMA_RECEIVED,
          schema: [],
          error: 'error message'
        }
      ];

      return store
        .dispatch(tapActions.submitConfig(undefined, undefined, undefined))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('edit schema field', () => {
    it('should dispatch UPDATE_SCHEMA_FIELD', () => {
      const store = mockStore({});

      const expectedActions = [
        {
          type: tapActions.UPDATE_SCHEMA_FIELD,
          field,
          index,
          value,
          specImplementation
        }
      ];

      store.dispatch(
        tapActions.editSchemaField(field, index, value, specImplementation)
      );
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('update schema logs', () => {
    it('should dispatch UPDATE_SCHEMA_LOGS', () => {
      const store = mockStore({});

      const expectedActions = [
        {
          type: tapActions.UPDATE_SCHEMA_LOGS,
          newLog
        }
      ];

      store.dispatch(tapActions.updateSchemaLogs(newLog));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
