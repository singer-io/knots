import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as knotActions from '../../app/actions/knots';

const baseUrl = 'http://localhost:4321';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

const knot = 'sampleKnot';
const sampleSavedKnot = {
  name: 'sampleKnot',
  schema: [
    {
      metadata: [],
      schema: {},
      stream: 'testSample',
      tap_stream_id: 'testSample'
    }
  ],
  tap: { name: 'sampleTap' },
  tapConfig: {},
  target: { name: 'sampleTarget' },
  targetConfig: {}
};

const sampleSavedKnotJson = {
  tap: { name: 'sampleTap', image: 'sampleTapImage' },
  target: { name: 'sampleTarget', image: 'sampleTargetImage' }
};

describe('knots actions', () => {
  describe('sync page', () => {
    it('should dispatch SYNC_PAGE_LOADED', () => {
      const store = mockStore({});
      const expectedActions = [{ type: knotActions.SYNC_PAGE_LOADED }];

      store.dispatch(knotActions.syncPageLoaded());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('verify docker', () => {
    it('should dispatch UPDATE_DOCKER_VERSION and DOCKER_RUNNING', () => {
      const store = mockStore({});
      const version = '1.7.0';

      nock(`${baseUrl}/docker`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/installed')
        .reply(200, { version })
        .get('/running')
        .reply(200, {});

      const expectedActions = [
        {
          type: knotActions.DETECTING_DOCKER
        },
        {
          type: knotActions.UPDATE_DOCKER_VERSION,
          version
        },
        {
          type: knotActions.DOCKER_RUNNING,
          running: true
        }
      ];

      return store.dispatch(knotActions.verifyDocker()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch UPDATE_DOCKER_VERSION with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/docker`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/installed')
        .reply(500, { message: 'error message' })
        .get('/running')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.DETECTING_DOCKER
        },
        {
          type: knotActions.UPDATE_DOCKER_VERSION,
          version: '',
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.verifyDocker()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch DOCKER_RUNNING with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/docker`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/installed')
        .reply(200, { version: '1.7.0' })
        .get('/running')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.DETECTING_DOCKER
        },
        {
          type: knotActions.UPDATE_DOCKER_VERSION,
          version: '1.7.0'
        },
        {
          type: knotActions.DOCKER_RUNNING,
          running: false,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.verifyDocker()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('get knots', () => {
    it('should dispatch FETCHED_KNOTS with list of knots', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/')
        .reply(200, {
          knots: [{ name: 'sampleKnot' }, { name: 'sampleKnot2' }]
        });

      const expectedActions = [
        {
          type: knotActions.FETCHING_KNOTS
        },
        {
          type: knotActions.FETCHED_KNOTS,
          knots: [{ name: 'sampleKnot' }, { name: 'sampleKnot2' }]
        }
      ];

      return store.dispatch(knotActions.getKnots()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch FETCHED_KNOTS with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.FETCHING_KNOTS
        },
        {
          type: knotActions.FETCHED_KNOTS,
          knots: [],
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.getKnots()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('update name', () => {
    it('should dispatch UPDATE_NAME', () => {
      const store = mockStore({});
      const name = 'testName';

      const expectedActions = [
        {
          type: knotActions.UPDATE_NAME,
          name
        }
      ];

      store.dispatch(knotActions.updateName(name));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('update tap logs', () => {
    it('should dispatch UPDATE_TAP_LOGS', () => {
      const store = mockStore({});
      const newLog = 'taps log';

      const expectedActions = [
        {
          type: knotActions.UPDATE_TAP_LOGS,
          newLog
        }
      ];

      store.dispatch(knotActions.updateTapLogs(newLog));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('update target logs', () => {
    it('should dispatch UPDATE_TARGET_LOGS', () => {
      const store = mockStore({});
      const newLog = 'target log';

      const expectedActions = [
        {
          type: knotActions.UPDATE_TARGET_LOGS,
          newLog
        }
      ];

      store.dispatch(knotActions.updateTargetLogs(newLog));
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('delete knot', () => {
    it('should dispatch KNOT_DELETED', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/delete', { knot })
        .reply(200, {});

      const expectedActions = [{ type: knotActions.KNOT_DELETED }];

      return store.dispatch(knotActions.deleteKnot(knot)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch KNOT_DELETED with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/delete')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.KNOT_DELETED,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.deleteKnot()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('download knot', () => {
    it('should dispatch download knot action', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/download/', { knot })
        .reply(200, {});

      const expectedActions = [];

      return store.dispatch(knotActions.downloadKnot(knot)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('load values', () => {
    it('should dispatch LOADED_KNOT with knot properties', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/load', { knot })
        .reply(200, sampleSavedKnot);

      const expectedActions = [
        {
          type: knotActions.LOADING_KNOT
        },
        {
          type: knotActions.LOADED_KNOT,
          tap: sampleSavedKnot.tap,
          target: sampleSavedKnot.target,
          tapConfig: sampleSavedKnot.tapConfig,
          targetConfig: sampleSavedKnot.targetConfig,
          knotName: sampleSavedKnot.name,
          schema: sampleSavedKnot.schema
        }
      ];

      return store.dispatch(knotActions.loadValues(knot)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch LOADED_KNOT with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/load', { knot: 'knot' })
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.LOADING_KNOT
        },
        {
          type: knotActions.LOADED_KNOT,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.loadValues('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('reset store', () => {
    it('should dispatch RESET_STORE', () => {
      const store = mockStore({});

      const expectedActions = [
        {
          type: knotActions.RESET_STORE
        }
      ];

      store.dispatch(knotActions.resetStore());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('cancel knot', () => {
    it('should dispatch cancel action', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/cancel/', { knot })
        .reply(200, {});

      return store.dispatch(knotActions.cancel(knot)).then(() => {
        expect(store.getActions()).toEqual([]);
      });
    });
  });

  describe('generate uuid', () => {
    it('should dispatch generated uuid action with a uuid', () => {
      const store = mockStore({});

      store.dispatch(knotActions.generateUUID());
      expect(store.getActions()[0].type).toEqual('GENERATED_UUID');
      expect(store.getActions()[0].uuid).toBeTruthy();
    });
  });

  describe('load knot', () => {
    it('should dispatch LOADED_KNOT_JSON with tap and target properties', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/loadknot', { knot })
        .reply(200, sampleSavedKnotJson);

      const expectedActions = [
        {
          type: knotActions.LOADING_KNOT
        },
        {
          type: knotActions.LOADED_KNOT_JSON,
          tap: sampleSavedKnotJson.tap,
          target: sampleSavedKnotJson.target
        }
      ];

      return store.dispatch(knotActions.loadKnot(knot)).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch LOADED_KNOT with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/loadknot', { knot: 'knot' })
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.LOADING_KNOT
        },
        {
          type: knotActions.LOADED_KNOT_JSON,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.loadKnot('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('reset knot error', () => {
    it('should dispatch RESET_KNOT_ERROR', () => {
      const store = mockStore({});

      store.dispatch(knotActions.resetKnotError());
      expect(store.getActions()[0].type).toEqual('RESET_KNOT_ERROR');
    });
  });

  describe('partial sync', () => {
    it('should dispatch KNOT_SYNCING', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/partial-sync', { knotName: 'knot' })
        .reply(200, {});

      const expectedActions = [
        {
          type: knotActions.KNOT_SYNCING
        }
      ];

      return store.dispatch(knotActions.partialSync('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch KNOT_SYNCED with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/partial-sync', { knotName: 'knot' })
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.KNOT_SYNCED,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.partialSync('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('full sync', () => {
    it('should dispatch KNOT_SYNCING', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/full-sync', { knotName: 'knot' })
        .reply(200, {});

      const expectedActions = [
        {
          type: knotActions.KNOT_SYNCING
        }
      ];

      return store.dispatch(knotActions.sync('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch KNOT_SYNCED with error', () => {
      const store = mockStore({});

      nock(`${baseUrl}/knots/`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .post('/full-sync', { knotName: 'knot' })
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: knotActions.KNOT_SYNCED,
          error: 'error message'
        }
      ];

      return store.dispatch(knotActions.sync('knot')).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });
});
