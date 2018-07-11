import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as knotActions from '../../app/actions/knots';

const baseUrl = 'http://localhost:4321';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('knots actions', () => {
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

    return store.dispatch(knotActions.delete()).then(() => {
      expect(store.getActions()).toEqual(expectedActions);
    });
  });
});
