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
});
