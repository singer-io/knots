import userReducer, { defaultState } from '../../app/reducers/user';
import * as userActions from '../../app/actions/user';
import { LOADED_KNOT, RESET_STORE } from '../../app/actions/knots';

const selectedTarget = {
  name: 'target-datadotworld'
};
const updatedTarget = {
  fieldValues: {
    dataset_id: 'testing',
    dataset_owner: '',
    dataset_url: '',
    api_token: ''
  }
};
const targetConfig = {
  dataset_owner: 'tester'
};

describe('user reducer', () => {
  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual(defaultState);
  });

  it('should handle UPDATE_TARGET_FIELD', () => {
    expect(
      userReducer(undefined, {
        type: userActions.UPDATE_TARGET_FIELD,
        target: 'target-datadotworld',
        field: 'dataset_id',
        value: 'testing'
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        'target-datadotworld': updatedTarget
      })
    );
  });

  it('should handle LOADED_KNOT', () => {
    expect(
      userReducer(undefined, {
        type: LOADED_KNOT,
        target: selectedTarget,
        targetConfig
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        'target-datadotworld': {
          fieldValues: {
            dataset_owner: 'tester'
          }
        }
      })
    );
  });

  it('should handle RESET_STORE', () => {
    expect(
      userReducer(undefined, {
        type: RESET_STORE
      })
    ).toEqual(
      Object.assign({}, defaultState, {
        targetConfigured: false,
        'target-datadotworld': {
          fieldValues: {
            dataset_id: '',
            dataset_owner: '',
            dataset_url: '',
            api_token: ''
          }
        }
      })
    );
  });
});
