import nock from 'nock';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as targetActions from '../../app/actions/targets';
import { sampleTargets } from '../utils';

const baseUrl = 'http://localhost:4321';
const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('target actions', () => {
  describe('target page loaded', () => {
    it('should dispatch TARGETS_PAGE_LOADED', () => {
      const store = mockStore({});
      const expectedActions = [{ type: targetActions.TARGETS_PAGE_LOADED }];

      store.dispatch(targetActions.targetsPageLoaded());
      expect(store.getActions()).toEqual(expectedActions);
    });
  });

  describe('get targets', () => {
    it('should dispatch UPDATE_TARGETS with list of targets', () => {
      const store = mockStore({});

      nock(`${baseUrl}/targets`)
        .defaultReplyHeaders({
          'Access-Control-Allow-Origin': '*'
        })
        .get('/')
        .reply(200, { targets: sampleTargets });

      const expectedActions = [
        {
          type: targetActions.TARGETS_LOADING
        },
        {
          type: targetActions.UPDATE_TARGETS,
          targets: sampleTargets
        }
      ];

      return store.dispatch(targetActions.getTargets()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });

    it('should dispatch UPDATE_TARGETS with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/targets/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .get('/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: targetActions.TARGETS_LOADING
        },
        {
          type: targetActions.UPDATE_TARGETS,
          targets: [],
          error: 'error message'
        }
      ];

      return store.dispatch(targetActions.getTargets()).then(() => {
        expect(store.getActions()).toEqual(expectedActions);
      });
    });
  });

  describe('select target', () => {
    it('should dispatch TARGET_SELECTED with specific target', () => {
      const store = mockStore({});

      nock(`${baseUrl}/targets/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/select', {
          target: sampleTargets[0],
          knot: 'target',
          uuid: 'targetUUID'
        })
        .reply(200, {});

      const expectedActions = [
        {
          type: targetActions.TARGET_SELECTED,
          target: sampleTargets[0]
        },
        {
          type: targetActions.TARGET_INSTALLED
        }
      ];

      return store
        .dispatch(
          targetActions.selectTarget(sampleTargets[0], 'targetUUID', 'target')
        )
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch TARGET_SELECTED with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/targets/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/select')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: targetActions.TARGET_SELECTED,
          target: undefined
        },
        {
          type: targetActions.TARGET_INSTALLED,
          error: 'error message'
        }
      ];

      return store
        .dispatch(targetActions.selectTarget(undefined, undefined))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });

  describe('submit fields', () => {
    it('should dispatch TARGET_CONFIGURING', () => {
      const store = mockStore({});
      const fieldValues = { id: '1234' };

      nock(`${baseUrl}/targets/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/', {
          fieldValues,
          uuid: 'uniqueUUID'
        })
        .reply(200, {});

      const expectedActions = [
        {
          type: targetActions.TARGET_CONFIGURING
        },
        {
          type: targetActions.TARGET_CONFIGURED
        }
      ];

      return store
        .dispatch(targetActions.submitFields(fieldValues, 'uniqueUUID'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('should dispatch TARGET_CONFIGURED with errors', () => {
      const store = mockStore({});

      nock(`${baseUrl}/targets/`)
        .defaultReplyHeaders({ 'Access-Control-Allow-Origin': '*' })
        .post('/')
        .reply(500, { message: 'error message' });

      const expectedActions = [
        {
          type: targetActions.TARGET_CONFIGURING
        },
        {
          type: targetActions.TARGET_CONFIGURED,
          error: 'error message'
        }
      ];

      return store
        .dispatch(targetActions.submitFields(undefined, undefined))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions);
        });
    });
  });
});
