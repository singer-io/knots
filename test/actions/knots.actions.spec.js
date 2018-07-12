import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as knotActions from '../../app/actions/knots';

const baseUrl = 'http://localhost:4321';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('knots actions', () => {
  it('should dispatch SYNC_PAGE_LOADED', () => {
    const store = mockStore({});

    const expectedActions = [{ type: knotActions.SYNC_PAGE_LOADED }];

    store.dispatch(knotActions.syncPageLoaded());
    expect(store.getActions()).toEqual(expectedActions);
  });

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

  it('should dispatch FETCHED_KNOTS with list of knots', () => {
    const store = mockStore({});

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .get('/')
      .reply(200, { knots: [{ name: 'sampleKnot' }, { name: 'sampleKnot2' }] });

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

  it('should dispatch KNOT_SYNCED on first save of knot', () => {
    const store = mockStore({});
    const knotName = 'testName';
    const selectedTap = { name: 'sampleTap' };
    const selectedTarget = { name: 'sampleTarget' };
    const currentName = 'testName';

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/save', {
        knotName,
        tap: selectedTap,
        target: selectedTarget,
        currentName
      })
      .reply(200, {});

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED
      }
    ];

    return store
      .dispatch(
        knotActions.save(knotName, selectedTap, selectedTarget, currentName)
      )
      .then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
  });

  it('should dispatch KNOT_SYNCED on save with error', () => {
    const store = mockStore({});

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/save', {})
      .reply(500, { message: 'error message' });

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED,
        error: 'error message'
      }
    ];

    return store.dispatch(knotActions.save()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch KNOT_SYNCED for full sync action', () => {
    const store = mockStore({});
    const knotName = 'testName';

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/full-sync', { knotName })
      .reply(200, {});

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED
      }
    ];

    return store.dispatch(knotActions.sync(knotName)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch KNOT_SYNCED for full sync with error', () => {
    const store = mockStore({});

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/full-sync')
      .reply(500, { message: 'error message' });

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED,
        error: 'error message'
      }
    ];

    return store.dispatch(knotActions.sync()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch KNOT_SYNCED for partial sync action', () => {
    const store = mockStore({});
    const knotName = 'testName';

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/partial-sync', { knotName })
      .reply(200, {});

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED
      }
    ];

    return store.dispatch(knotActions.partialSync(knotName)).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  it('should dispatch KNOT_SYNCED for partial sync with error', () => {
    const store = mockStore({});

    nock(`${baseUrl}/knots/`)
      .defaultReplyHeaders({
        'Access-Control-Allow-Origin': '*'
      })
      .post('/partial-sync')
      .reply(500, { message: 'error message' });

    const expectedActions = [
      {
        type: knotActions.KNOT_SYNCING
      },
      {
        type: knotActions.KNOT_SYNCED,
        error: 'error message'
      }
    ];

    return store.dispatch(knotActions.partialSync()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

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

  it('should dispatch KNOT_DELETED', () => {
    const store = mockStore({});
    const knot = 'sampleKnot';

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

  it('should dispatch download knot action', () => {
    const store = mockStore({});
    const knot = 'sampleKnot';

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

  it('should dispatch LOADED_KNOT with knot properties', () => {
    const store = mockStore({});
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

  it('should dispatch cancel action', () => {
    const store = mockStore({});
    const knot = 'sampleKnot';

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
