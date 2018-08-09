import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as userActions from '../../app/actions/user';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('user actions', () => {
  it('should dispatch UPDATE_TARGET_FIELD', () => {
    const store = mockStore({});
    const target = 'target-datadotworld';
    const field = 'dataset_owner';
    const value = 'tester';
    const expectedActions = [
      {
        type: userActions.UPDATE_TARGET_FIELD,
        target,
        field,
        value
      }
    ];

    store.dispatch(userActions.updateTargetField(target, field, value));
    expect(store.getActions()).toEqual(expectedActions);
  });
});
